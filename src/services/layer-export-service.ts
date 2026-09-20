"use client";

import GeoJSON from 'ol/format/GeoJSON';
import KML from 'ol/format/KML';
import VectorLayer from 'ol/layer/Vector';
import type Feature from 'ol/Feature';
import type { Geometry } from 'ol/geom';
import type { Map } from 'ol';
import { transformExtent } from 'ol/proj';
import type { MapLayer, VectorMapLayer } from '@/lib/types';
import { saveFileWithPicker } from '@/services/download-service';
import * as shpwrite from '@mapbox/shp-write';
import { getGeeGeoTiffDownloadUrl } from '@/ai/flows/gee-flow';

export function sanitizeLayerName(name: string): string {
  if (!name || !name.trim()) return 'capa_exportada';
  return name
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-]/g, '')
    .slice(0, 50) || 'capa_exportada';
}

/**
 * Extracts all features from an OpenLayers layer or VectorSource
 */
export function extractFeaturesFromLayer(layerOrSource: any): Feature<Geometry>[] {
  if (!layerOrSource) return [];

  // If it's a VectorLayer
  if (layerOrSource instanceof VectorLayer || (layerOrSource.getSource && typeof layerOrSource.getSource === 'function')) {
    const source = layerOrSource.getSource();
    if (!source) return [];
    // If it's a cluster source
    if (typeof (source as any).getSource === 'function') {
      const underlying = (source as any).getSource();
      if (underlying && typeof underlying.getFeatures === 'function') {
        return underlying.getFeatures();
      }
    }
    if (typeof source.getFeatures === 'function') {
      return source.getFeatures();
    }
  }

  // If it has getFeatures directly (e.g. VectorSource)
  if (typeof layerOrSource.getFeatures === 'function') {
    return layerOrSource.getFeatures();
  }

  return [];
}

/**
 * Prepares and sanitizes GeoJSON features for Shapefile (DBF) export
 */
function sanitizeFeaturesForShp(geojsonObj: any) {
  const features = (geojsonObj.features || []).filter(
    (f: any) => f && f.geometry && f.geometry.coordinates && f.geometry.coordinates.length > 0
  );

  const cleanedFeatures = features.map((f: any) => {
    const cleanProps: Record<string, any> = {};
    if (f.properties && typeof f.properties === 'object') {
      for (const [key, value] of Object.entries(f.properties)) {
        if (value === null || value === undefined) {
          cleanProps[key] = '';
        } else if (typeof value === 'object') {
          try {
            cleanProps[key] = JSON.stringify(value);
          } catch {
            cleanProps[key] = String(value);
          }
        } else {
          cleanProps[key] = value;
        }
      }
    }
    return {
      ...f,
      properties: cleanProps,
    };
  });

  return {
    type: 'FeatureCollection',
    features: cleanedFeatures,
  };
}

/**
 * Exports a set of OpenLayers features to the requested format (GeoJSON, KML, or Shapefile ZIP)
 */
export async function exportFeatures({
  features,
  fileName,
  format,
}: {
  features: Feature<Geometry>[];
  fileName: string;
  format: 'geojson' | 'kml' | 'shp';
}): Promise<void> {
  if (!features || features.length === 0) {
    throw new Error('No hay entidades disponibles para exportar.');
  }

  const safeName = sanitizeLayerName(fileName);
  const writeOptions = {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
    decimals: 7,
  };

  if (format === 'geojson') {
    const geojsonFormat = new GeoJSON();
    const textData = geojsonFormat.writeFeatures(features, writeOptions);

    await saveFileWithPicker({
      fileContent: textData,
      suggestedName: `${safeName}.geojson`,
      fileType: 'geojson',
    });
  } else if (format === 'kml') {
    const kmlFormat = new KML({ extractStyles: false, showPointNames: true });
    const textData = kmlFormat.writeFeatures(features, writeOptions);

    await saveFileWithPicker({
      fileContent: textData,
      suggestedName: `${safeName}.kml`,
      fileType: 'kml',
    });
  } else if (format === 'shp') {
    const geojsonFormat = new GeoJSON();
    const rawGeoJson = geojsonFormat.writeFeaturesObject(features, writeOptions);
    const cleanGeoJson = sanitizeFeaturesForShp(rawGeoJson);

    if (!cleanGeoJson.features || cleanGeoJson.features.length === 0) {
      throw new Error('La capa no contiene geometrías válidas para generar un Shapefile.');
    }

    const geomTypes = new Set(cleanGeoJson.features.map((f: any) => f.geometry.type));
    const isOnlyPolygons = Array.from(geomTypes).every((t) => t === 'Polygon' || t === 'MultiPolygon');
    const isOnlyPoints = Array.from(geomTypes).every((t) => t === 'Point' || t === 'MultiPoint');
    const isOnlyLines = Array.from(geomTypes).every((t) => t === 'LineString' || t === 'MultiLineString');

    let typesConfig: Record<string, string>;
    if (isOnlyPolygons) {
      typesConfig = { polygon: safeName, multipolygon: safeName };
    } else if (isOnlyPoints) {
      typesConfig = { point: safeName, multipoint: safeName };
    } else if (isOnlyLines) {
      typesConfig = { line: safeName, multiline: safeName };
    } else {
      typesConfig = {
        point: `${safeName}_puntos`,
        multipoint: `${safeName}_puntos`,
        line: `${safeName}_lineas`,
        multiline: `${safeName}_lineas`,
        polygon: `${safeName}_poligonos`,
        multipolygon: `${safeName}_poligonos`,
      };
    }

    const zipResult = await shpwrite.zip(cleanGeoJson, {
      types: typesConfig,
      outputType: 'blob',
    });

    const blob =
      zipResult instanceof Blob
        ? zipResult
        : new Blob([zipResult], { type: 'application/zip' });

    await saveFileWithPicker({
      fileContent: blob,
      suggestedName: `${safeName}.zip`,
      fileType: 'shp',
    });
  } else {
    throw new Error(`Formato no soportado: ${format}`);
  }
}

/**
 * Exports a single MapLayer (vector) to GeoJSON, KML, or Shapefile ZIP
 */
export async function exportVectorLayer(
  layer: VectorMapLayer | MapLayer,
  format: 'geojson' | 'kml' | 'shp'
): Promise<void> {
  if (!layer || !(layer.olLayer instanceof VectorLayer)) {
    throw new Error('Solo se pueden exportar capas vectoriales en este formato.');
  }

  const features = extractFeaturesFromLayer(layer.olLayer);
  if (!features || features.length === 0) {
    throw new Error(`La capa "${layer.name}" no tiene entidades para exportar.`);
  }

  await exportFeatures({
    features,
    fileName: layer.name,
    format,
  });
}

/**
 * Exports multiple vector layers merged into a single file
 */
export async function exportMultipleVectorLayers(
  layers: (VectorLayer<any> | VectorMapLayer | MapLayer)[],
  baseName: string,
  format: 'geojson' | 'kml' | 'shp'
): Promise<void> {
  if (!layers || layers.length === 0) {
    throw new Error('No hay capas seleccionadas para exportar.');
  }

  const allFeatures: Feature<Geometry>[] = [];
  for (const item of layers) {
    const l = 'olLayer' in item ? item.olLayer : item;
    const feats = extractFeaturesFromLayer(l);
    allFeatures.push(...feats);
  }

  if (allFeatures.length === 0) {
    throw new Error('Ninguna de las capas contiene entidades para exportar.');
  }

  await exportFeatures({
    features: allFeatures,
    fileName: baseName,
    format,
  });
}

/**
 * Handles GeoTIFF export for GEE or WMS layers in current view
 */
export async function exportWmsOrGeeAsGeotiff(
  layer: MapLayer,
  map: Map | null
): Promise<void> {
  if (!layer || !map) {
    throw new Error('El mapa o la capa no están disponibles.');
  }

  if (layer.type === 'gee') {
    const geeParams = layer.olLayer?.get('geeParams') || (layer as any).geeParams;
    if (!geeParams || !geeParams.bandCombination) {
      throw new Error('La capa GEE no tiene los parámetros necesarios para la exportación.');
    }

    const view = map.getView();
    const size = map.getSize();
    if (!size) throw new Error('No se pudo determinar el tamaño de la vista del mapa.');
    const extent = view.calculateExtent(size);
    const extent4326 = transformExtent(extent, view.getProjection(), 'EPSG:4326');

    const result = await getGeeGeoTiffDownloadUrl({
      aoi: {
        minLon: extent4326[0],
        minLat: extent4326[1],
        maxLon: extent4326[2],
        maxLat: extent4326[3],
      },
      bandCombination: geeParams.bandCombination,
      startDate: geeParams.startDate,
      endDate: geeParams.endDate,
      minElevation: geeParams.minElevation,
      maxElevation: geeParams.maxElevation,
    });

    if (result?.downloadUrl) {
      window.open(result.downloadUrl, '_blank');
    } else {
      throw new Error('No se recibió una URL de descarga de GeoTIFF desde GEE.');
    }
  } else if (layer.type === 'wms') {
    const source = (layer.olLayer as any)?.getSource?.();
    if (source && typeof source.getUrl === 'function') {
      const wmsUrl = source.getUrl();
      const params = source.getParams?.() || {};
      const layersParam = params.LAYERS || (layer as any).layerName;
      const view = map.getView();
      const size = map.getSize();
      if (size && view) {
        const extent = view.calculateExtent(size);
        const [minx, miny, maxx, maxy] = extent;
        const wmsGeotiffUrl = `${wmsUrl}?service=WMS&version=1.1.1&request=GetMap&layers=${encodeURIComponent(
          layersParam
        )}&styles=${encodeURIComponent(params.STYLES || '')}&bbox=${minx},${miny},${maxx},${maxy}&width=${Math.round(
          size[0]
        )}&height=${Math.round(size[1])}&srs=EPSG:3857&format=image/geotiff`;

        window.open(wmsGeotiffUrl, '_blank');
        return;
      }
    }
    throw new Error('No se pudo generar la exportación GeoTIFF para esta capa WMS.');
  } else {
    throw new Error('La exportación directa a GeoTIFF solo está disponible para capas GEE y WMS.');
  }
}
