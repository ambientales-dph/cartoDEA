import type { MapLayer } from '@/lib/types';
import { projectFormalNames, deasOrgNames } from '@/lib/project-names';

export interface LayerOriginInfo {
  isDea: boolean;
  isLocal: boolean;
  isRaster?: boolean;
  isDownloadOnly?: boolean;
  sizeBytes?: number;
  downloadUrl?: string;
  projectCode?: string;
  projectName?: string;
  cuencaName?: string;
  sourceLabel: string;
  sourceDescription: string;
}

export function getLayerOriginInfo(layer: MapLayer): LayerOriginInfo {
  const isRaster =
    Boolean(layer.isDownloadOnly) ||
    Boolean(layer.isFootprint) ||
    layer.category === 'img' ||
    layer.category === 'dem' ||
    (typeof layer.olLayer?.get === 'function' && Boolean(layer.olLayer.get('isFootprint')));

  const downloadUrl =
    layer.downloadUrl ||
    layer.url ||
    (typeof layer.olLayer?.get === 'function' ? layer.olLayer.get('downloadUrl') : undefined);

  const sizeBytes =
    layer.sizeBytes ||
    (typeof layer.olLayer?.get === 'function' ? layer.olLayer.get('sizeBytes') : undefined);

  // 1. Detección de Capa DEA (Proyectos estandarizados de la Dirección)
  let projectCode: string | undefined =
    layer.projectCode ||
    (typeof layer.olLayer?.get === 'function' ? layer.olLayer.get('projectCode') : undefined);

  if (!projectCode && layer.url) {
    try {
      const match = layer.url.match(/[?&]projectCode=([^&]+)/i);
      if (match && match[1]) {
        projectCode = decodeURIComponent(match[1]).toUpperCase();
      }
    } catch {
      // ignore
    }
  }

  if (!projectCode && layer.layerName) {
    const match = layer.layerName.match(/^([a-zA-Z]{2,4}\d{3})/i);
    if (match && match[1]) {
      projectCode = match[1].toUpperCase();
    }
  }

  const isDea =
    Boolean(layer.isDeas) ||
    Boolean(projectCode) ||
    layer.sourceType === 'dea' ||
    (typeof layer.olLayer?.get === 'function' && Boolean(layer.olLayer.get('isDeas'))) ||
    layer.id.startsWith('gis-');

  if (isDea && projectCode) {
    const cleanCode = projectCode.toUpperCase().trim();
    const formalName = projectFormalNames[cleanCode];
    const orgCode = cleanCode.replace(/\d+$/, '');
    const cuencaName = deasOrgNames[orgCode] || (orgCode ? `Cuenca ${orgCode}` : undefined);

    const desc = formalName && formalName !== cleanCode
      ? `${cleanCode} · ${formalName}`
      : cleanCode;

    return {
      isDea: true,
      isLocal: false,
      isRaster,
      isDownloadOnly: isRaster,
      sizeBytes,
      downloadUrl,
      projectCode: cleanCode,
      projectName: formalName || cleanCode,
      cuencaName,
      sourceLabel: isRaster ? 'Ráster Proyecto DEA' : 'Proyecto DEA',
      sourceDescription: desc,
    };
  }

  if (isDea) {
    return {
      isDea: true,
      isLocal: false,
      isRaster,
      isDownloadOnly: isRaster,
      sizeBytes,
      downloadUrl,
      sourceLabel: isRaster ? 'Ráster Proyecto DEA' : 'Proyecto DEA',
      sourceDescription: 'Capa de Cuenca DEA PBA',
    };
  }

  // 2. Detección de Capa Local (Cargada desde disco: SHP, GeoJSON, KML/KMZ, GeoTIFF)
  const originalFileName: string | undefined =
    layer.originalFileName ||
    (typeof layer.olLayer?.get === 'function' ? layer.olLayer.get('originalFileName') : undefined);

  const isLocalExplicit =
    layer.sourceType === 'local' ||
    Boolean(originalFileName) ||
    (typeof layer.olLayer?.get === 'function' && layer.olLayer.get('sourceType') === 'local');

  if (isLocalExplicit || (layer.type === 'vector' && !layer.url) || layer.type === 'geotiff') {
    const fileLabel = originalFileName || layer.name;
    return {
      isDea: false,
      isLocal: true,
      sourceLabel: 'Archivo local',
      sourceDescription: fileLabel,
    };
  }

  // 3. Otros orígenes del visor
  if (layer.type === 'drawing') {
    return {
      isDea: false,
      isLocal: false,
      sourceLabel: 'Capa de dibujo',
      sourceDescription: 'Geometría vectorial digitalizada',
    };
  }

  if (layer.type === 'analysis') {
    return {
      isDea: false,
      isLocal: false,
      sourceLabel: 'Análisis espacial',
      sourceDescription: 'Resultado de geoproceso',
    };
  }

  if (layer.type === 'wfs') {
    return {
      isDea: false,
      isLocal: false,
      sourceLabel: 'Servidor WFS',
      sourceDescription: layer.layerName ? `Capa: ${layer.layerName}` : 'Servicio WFS externo',
    };
  }

  if (layer.type === 'wms') {
    return {
      isDea: false,
      isLocal: false,
      sourceLabel: 'Servidor WMS',
      sourceDescription: layer.layerName ? `Capa: ${layer.layerName}` : 'Servicio WMS externo',
    };
  }

  if (layer.type === 'gee') {
    return {
      isDea: false,
      isLocal: false,
      sourceLabel: 'Google Earth Engine',
      sourceDescription: layer.geeParams?.bandCombination || 'Imágenes satelitales',
    };
  }

  return {
    isDea: false,
    isLocal: false,
    sourceLabel: 'Origen',
    sourceDescription: layer.name,
  };
}
