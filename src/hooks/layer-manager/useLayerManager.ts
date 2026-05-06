"use client";

import React, { useState, useCallback, useRef } from 'react';
import type { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import type Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { transformExtent } from 'ol/proj';
import { useToast } from "@/hooks/use-toast";
import type { MapLayer, VectorMapLayer, StyleOptions, GraduatedSymbology, CategorizedSymbology, LayerGroup, PlainFeatureData, GeoTiffStyle, LabelOptions } from '@/lib/types';
import { nanoid } from 'nanoid';
import { Style, Stroke, Fill, Circle as CircleStyle, Text as TextStyle } from 'ol/style';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';

const LAYER_START_Z_INDEX = 1000;

const colorMap: { [key: string]: string } = {
  rojo: '#e63946',
  verde: '#2a9d8f',
  azul: '#0077b6',
  amarillo: '#ffbe0b',
  naranja: '#f4a261',
  violeta: '#8338ec',
  negro: '#000000',
  blanco: '#ffffff',
  gris: '#adb5bd',
  cian: '#00ffff',
  magenta: '#ff00ff',
  transparent: 'rgba(0,0,0,0)',
};

const isValidHex = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

interface UseLayerManagerProps {
  mapRef: React.RefObject<Map | null>;
  isMapReady: boolean;
  onShowTableRequest: (data: PlainFeatureData[], name: string, id: string) => void;
}

export const useLayerManager = ({
  mapRef,
  isMapReady,
  onShowTableRequest,
}: UseLayerManagerProps) => {
  const [layers, setLayersInternal] = useState<(MapLayer | LayerGroup)[]>([]);
  const { toast } = useToast();
  const [lastRemovedLayers, setLastRemovedLayers] = useState<(MapLayer | LayerGroup)[]>([]);

  // --- Style Factory ---
  const createLayerStyle = useCallback((layer: MapLayer) => {
    return (feature: any) => {
      let fillColor = 'rgba(51, 153, 204, 0.2)';
      let strokeColor = '#3399CC';
      let strokeWidth = 2;
      let radius = 5;
      let lineDash: number[] | undefined = undefined;

      // 1. Basic Symbology (Graduated > Categorized > Simple)
      if (layer.graduatedSymbology) {
        const symbology = layer.graduatedSymbology;
        const value = feature.get(symbology.field);
        fillColor = 'rgba(128,128,128,0.5)';
        if (typeof value === 'number') {
            fillColor = symbology.colors[symbology.colors.length - 1];
            for (let i = 0; i < symbology.breaks.length; i++) {
                if (value <= symbology.breaks[i]) {
                    fillColor = symbology.colors[i];
                    break;
                }
            }
        }
        strokeColor = colorMap[symbology.strokeColor] || (isValidHex(symbology.strokeColor) ? symbology.strokeColor : '#000000');
        strokeWidth = symbology.strokeWidth;
      } else if (layer.categorizedSymbology) {
        const symbology = layer.categorizedSymbology;
        const value = feature.get(symbology.field);
        const category = symbology.categories.find(c => c.value === value);
        fillColor = category ? category.color : 'rgba(128,128,128,0.5)';
        strokeColor = colorMap[symbology.strokeColor] || (isValidHex(symbology.strokeColor) ? symbology.strokeColor : '#000000');
        strokeWidth = symbology.strokeWidth;
      } else if (layer.simpleStyle) {
        const styleOptions = layer.simpleStyle;
        strokeColor = colorMap[styleOptions.strokeColor] || styleOptions.strokeColor;
        fillColor = colorMap[styleOptions.fillColor] || styleOptions.fillColor;
        strokeWidth = styleOptions.lineWidth;
        radius = styleOptions.pointSize || 5;
        lineDash = styleOptions.lineStyle === 'dashed' ? [10, 10] : styleOptions.lineStyle === 'dotted' ? [2, 5] : undefined;
      }

      // 2. Labels
      let textStyle: TextStyle | undefined = undefined;
      if (layer.labelOptions?.enabled && layer.labelOptions.labelParts.length > 0) {
        const options = layer.labelOptions;
        const labelText = options.labelParts.map(part => {
          if (part.type === 'field') return String(feature.get(part.value) ?? '');
          if (part.type === 'newline') return '\n';
          return part.value;
        }).join('');

        if (labelText.trim()) {
          textStyle = new TextStyle({
            text: labelText,
            font: `bold ${options.fontSize}px ${options.fontFamily}`,
            fill: new Fill({ color: colorMap[options.textColor] || options.textColor }),
            stroke: new Stroke({ color: colorMap[options.outlineColor] || options.outlineColor, width: 3 }),
            overflow: options.overflow,
            placement: options.placement,
            offsetY: options.offsetY,
            padding: [2, 2, 2, 2],
          });
        }
      }

      return new Style({
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: strokeColor, width: strokeWidth, lineDash: lineDash }),
        image: new CircleStyle({
          radius: radius,
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: strokeColor, width: 1.5 })
        }),
        text: textStyle
      });
    };
  }, []);

  const setLayers = useCallback((updater: React.SetStateAction<(MapLayer | LayerGroup)[]>) => {
    setLayersInternal(prevItems => {
        const newItems = typeof updater === 'function' ? updater(prevItems) : updater(prevItems);
        const operationalLayers: MapLayer[] = [];
        newItems.forEach(item => {
            if ('layers' in item) operationalLayers.push(...item.layers);
            else operationalLayers.push(item);
        });

        operationalLayers.forEach((layer, index) => {
            const newZIndex = LAYER_START_Z_INDEX + (operationalLayers.length - 1 - index);
            layer.olLayer.setZIndex(newZIndex);
        });

        return newItems;
    });
  }, []);

  const addLayer = useCallback((newItem: MapLayer | LayerGroup, bringToTop: boolean = true) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if ('layers' in newItem) {
        newItem.layers.forEach(layer => map.addLayer(layer.olLayer));
    } else {
        map.addLayer(newItem.olLayer);
    }
    
    setLayers(prev => bringToTop ? [newItem, ...prev] : [...prev, newItem]);
  }, [mapRef, setLayers]);

  const removeLayers = useCallback((ids: string[]) => {
      setLayers(prev => {
          const toRemove = prev.filter(i => ids.includes(i.id));
          toRemove.forEach(item => {
              if('layers' in item) item.layers.forEach(l => mapRef.current?.removeLayer(l.olLayer));
              else mapRef.current?.removeLayer(item.olLayer);
          });
          setLastRemovedLayers(prevRemoved => [...prevRemoved, ...toRemove]);
          return prev.filter(i => !ids.includes(i.id));
      });
  }, [mapRef, setLayers]);

  const toggleLayerVisibility = useCallback((id: string, groupId?: string) => {
      setLayers(prev => prev.map(item => {
          if (item.id === id) {
              const currentItem = item as any;
              const newVis = !('layers' in item ? item.layers[0].visible : item.visible);
              if('layers' in item) item.layers.forEach(l => l.olLayer.setVisible(newVis));
              else item.olLayer.setVisible(newVis);
              return { ...item, visible: newVis };
          }
          return item;
      }));
  }, [setLayers]);

  const setLayerOpacity = useCallback((id: string, opacity: number) => {
    setLayers(prev => prev.map(item => {
        if (item.id === id) {
            if('layers' in item) item.layers.forEach(l => l.olLayer.setOpacity(opacity));
            else item.olLayer.setOpacity(opacity);
            return { ...item, opacity };
        }
        return item;
    }));
  }, [setLayers]);

  const zoomToLayerExtent = useCallback((id: string) => {
    const map = mapRef.current;
    if (!map) return;
    const layerItem = layers.flatMap(i => 'layers' in i ? i.layers : [i]).find(l => l.id === id);
    if (!layerItem) return;

    if (layerItem.olLayer instanceof VectorLayer) {
        const source = (layerItem.olLayer as VectorLayer<any>).getSource();
        if (source && source.getFeatures().length > 0) {
            map.getView().fit(source.getExtent(), { padding: [50, 50, 50, 50], duration: 1000 });
        }
    } else if (layerItem.olLayer instanceof TileLayer) {
        const bbox = layerItem.olLayer.get('bbox') as [number, number, number, number] | undefined;
        if (bbox) {
            const extent3857 = transformExtent(bbox, 'EPSG:4326', 'EPSG:3857');
            map.getView().fit(extent3857, { padding: [50, 50, 50, 50], duration: 1000 });
        }
    }
  }, [layers, mapRef]);

  const changeLayerStyle = useCallback((layerId: string, styleOptions: StyleOptions) => {
    setLayers(prev => prev.map(item => {
      if (item.id === layerId && !('layers' in item)) {
        const updatedLayer = { ...item, simpleStyle: styleOptions };
        if (updatedLayer.olLayer instanceof VectorLayer) {
           updatedLayer.olLayer.setStyle(createLayerStyle(updatedLayer));
        }
        return updatedLayer;
      }
      return item;
    }));
  }, [setLayers, createLayerStyle]);

  const applyGraduatedSymbology = useCallback((layerId: string, symbology: GraduatedSymbology) => {
    setLayers(prev => prev.map(item => {
      if (item.id === layerId && !('layers' in item) && item.olLayer instanceof VectorLayer) {
        const updatedLayer = { ...item, graduatedSymbology: symbology };
        updatedLayer.olLayer.setStyle(createLayerStyle(updatedLayer));
        return updatedLayer;
      }
      return item;
    }));
  }, [setLayers, createLayerStyle]);

  const applyCategorizedSymbology = useCallback((layerId: string, symbology: CategorizedSymbology) => {
    setLayers(prev => prev.map(item => {
      if (item.id === layerId && !('layers' in item) && item.olLayer instanceof VectorLayer) {
        const updatedLayer = { ...item, categorizedSymbology: symbology };
        updatedLayer.olLayer.setStyle(createLayerStyle(updatedLayer));
        return updatedLayer;
      }
      return item;
    }));
  }, [setLayers, createLayerStyle]);

  const onChangeLayerLabels = useCallback((id: string, options: LabelOptions) => {
    setLayers(prev => prev.map(item => {
        if (item.id === id && !('layers' in item) && item.olLayer instanceof VectorLayer) {
            const updatedLayer = { ...item, labelOptions: options };
            updatedLayer.olLayer.setStyle(createLayerStyle(updatedLayer));
            return updatedLayer;
        }
        return item;
    }));
  }, [setLayers, createLayerStyle]);

  const handleShowLayerTable = useCallback((id: string) => {
    const layer = layers.flatMap(i => 'layers' in i ? i.layers : [i]).find(l => l.id === id) as VectorMapLayer | undefined;
    if (layer && layer.olLayer instanceof VectorLayer) {
        const features = (layer.olLayer as VectorLayer<any>).getSource()?.getFeatures() || [];
        const plainData = features.map(f => ({ id: f.getId() as string, attributes: f.getProperties() }));
        onShowTableRequest(plainData, layer.name, layer.id);
    }
  }, [layers, onShowTableRequest]);

  const undoRemove = useCallback(() => {
    if (lastRemovedLayers.length > 0) {
        const restored = lastRemovedLayers[lastRemovedLayers.length - 1];
        addLayer(restored);
        setLastRemovedLayers(prev => prev.slice(0, -1));
    }
  }, [lastRemovedLayers, addLayer]);

  const addGeeLayerToMap = useCallback((tileUrl: string, name: string, params: any) => {
      const layerId = `gee-${nanoid()}`;
      const olLayer = new TileLayer({
          source: new XYZ({ url: tileUrl, crossOrigin: 'anonymous' }),
          properties: { id: layerId, name, type: 'gee', geeParams: params },
      });
      addLayer({ id: layerId, name, olLayer, visible: true, opacity: 1, type: 'gee', geeParams: params });
  }, [addLayer]);

  const handleAddHybridLayer = useCallback(async (name: string, title: string, url: string, bbox?: [number, number, number, number], style?: string) => {
      const layerId = `hybrid-${nanoid()}`;
      const wfsSource = new VectorSource({
          format: new GeoJSON(),
          url: (extent) => `/api/geoserver-proxy?url=${encodeURIComponent(`${url}/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${name}&outputFormat=application/json&srsname=EPSG:3857&bbox=${extent.join(',')},EPSG:3857`)}`,
          strategy: bboxStrategy,
      });

      const olLayer = new VectorLayer({
          source: wfsSource,
          properties: { id: layerId, name: title, type: 'wfs', bbox },
      });

      addLayer({ id: layerId, name: title, olLayer, visible: true, opacity: 1, type: 'wfs', url, layerName: name, styleName: style });
      return null;
  }, [addLayer]);

  return {
    layers,
    addLayer,
    removeLayer: (id: string) => removeLayers([id]),
    removeLayers,
    toggleLayerVisibility,
    setLayerOpacity,
    zoomToLayerExtent,
    handleShowLayerTable,
    renameLayer: (id: string, newName: string) => setLayers(prev => prev.map(i => i.id === id ? { ...i, name: newName } : i)),
    changeLayerStyle,
    applyGraduatedSymbology,
    applyCategorizedSymbology,
    isWfsLoading: false,
    lastRemovedLayers,
    undoRemove,
    onChangeLayerLabels,
    onApplyGeoTiffStyle: (id: string, style: GeoTiffStyle) => {},
    onToggleWmsStyle: (id: string) => {},
    handleAddHybridLayer,
    addGeeLayerToMap,
  };
};
