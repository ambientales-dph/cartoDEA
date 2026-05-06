
"use client";

import React, { useState, useCallback } from 'react';
import type { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import type Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { useToast } from "@/hooks/use-toast";
import type { MapLayer, VectorMapLayer, StyleOptions, GraduatedSymbology, CategorizedSymbology, LayerGroup, PlainFeatureData } from '@/lib/types';
import { nanoid } from 'nanoid';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';

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

  const setLayers = useCallback((updater: React.SetStateAction<(MapLayer | LayerGroup)[]>) => {
    setLayersInternal(prevItems => {
        const newItems = typeof updater === 'function' ? updater(prevItems) : updater(prevItems);
        const map = mapRef.current;
        if (!map) return newItems;

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
  }, [mapRef]);

  const addLayer = useCallback((newItem: MapLayer | LayerGroup, bringToTop: boolean = true) => {
    const map = mapRef.current;
    if (!map) return;

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
          setLastRemovedLayers(toRemove);
          return prev.filter(i => !ids.includes(i.id));
      });
  }, [mapRef, setLayers]);

  const toggleLayerVisibility = useCallback((id: string) => {
      setLayers(prev => prev.map(item => {
          if (item.id === id) {
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
    if (layerItem && layerItem.olLayer instanceof VectorLayer) {
        const source = (layerItem.olLayer as VectorLayer<any>).getSource();
        if (source && source.getFeatures().length > 0) {
            map.getView().fit(source.getExtent(), { padding: [50, 50, 50, 50], duration: 1000 });
        }
    }
  }, [layers, mapRef]);

  const changeLayerStyle = useCallback((layerId: string, styleOptions: StyleOptions) => {
    setLayers(prev => prev.map(item => {
      if (item.id === layerId && !('layers' in item)) {
        const olLayer = item.olLayer;
        if (olLayer instanceof VectorLayer) {
           const strokeColor = colorMap[styleOptions.strokeColor] || styleOptions.strokeColor;
           const fillColor = colorMap[styleOptions.fillColor] || styleOptions.fillColor;
           
           const newStyle = new Style({
             stroke: new Stroke({
               color: strokeColor,
               width: styleOptions.lineWidth,
               lineDash: styleOptions.lineStyle === 'dashed' ? [10, 10] : styleOptions.lineStyle === 'dotted' ? [2, 5] : undefined,
             }),
             fill: new Fill({
               color: fillColor
             }),
             image: new CircleStyle({
               radius: styleOptions.pointSize || 5,
               fill: new Fill({ color: fillColor }),
               stroke: new Stroke({ color: strokeColor, width: 1.5 })
             })
           });
           (olLayer as VectorLayer<any>).setStyle(newStyle);
           return { ...item, simpleStyle: styleOptions };
        }
      }
      return item;
    }));
  }, [setLayers]);

  const applyGraduatedSymbology = useCallback((layerId: string, symbology: GraduatedSymbology) => {
    setLayers(prev => prev.map(item => {
      if (item.id === layerId && !('layers' in item) && item.olLayer instanceof VectorLayer) {
        const olLayer = item.olLayer as VectorLayer<any>;
        const strokeColor = colorMap[symbology.strokeColor] || (isValidHex(symbology.strokeColor) ? symbology.strokeColor : '#000000');

        olLayer.setStyle((feature: any) => {
            const value = feature.get(symbology.field);
            let fillColor = 'rgba(128,128,128,0.5)';
            if (typeof value === 'number') {
                fillColor = symbology.colors[symbology.colors.length - 1];
                for (let i = 0; i < symbology.breaks.length; i++) {
                    if (value <= symbology.breaks[i]) {
                        fillColor = symbology.colors[i];
                        break;
                    }
                }
            }
            return new Style({
                fill: new Fill({ color: fillColor }),
                stroke: new Stroke({ color: strokeColor, width: symbology.strokeWidth }),
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({ color: fillColor }),
                    stroke: new Stroke({ color: strokeColor, width: 1 })
                })
            });
        });
        return { ...item, graduatedSymbology: symbology, categorizedSymbology: undefined };
      }
      return item;
    }));
  }, [setLayers]);

  const applyCategorizedSymbology = useCallback((layerId: string, symbology: CategorizedSymbology) => {
    setLayers(prev => prev.map(item => {
      if (item.id === layerId && !('layers' in item) && item.olLayer instanceof VectorLayer) {
        const olLayer = item.olLayer as VectorLayer<any>;
        const strokeColor = colorMap[symbology.strokeColor] || (isValidHex(symbology.strokeColor) ? symbology.strokeColor : '#000000');

        olLayer.setStyle((feature: any) => {
            const value = feature.get(symbology.field);
            const category = symbology.categories.find(c => c.value === value);
            const fillColor = category ? category.color : 'rgba(128,128,128,0.5)';
            return new Style({
                fill: new Fill({ color: fillColor }),
                stroke: new Stroke({ color: strokeColor, width: symbology.strokeWidth }),
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({ color: fillColor }),
                    stroke: new Stroke({ color: strokeColor, width: 1 })
                })
            });
        });
        return { ...item, categorizedSymbology: symbology, graduatedSymbology: undefined };
      }
      return item;
    }));
  }, [setLayers]);

  const renameLayer = useCallback((id: string, newName: string) => {
    setLayers(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  }, [setLayers]);

  const handleShowLayerTable = useCallback((id: string) => {
    const layer = layers.flatMap(i => 'layers' in i ? i.layers : [i]).find(l => l.id === id) as VectorMapLayer | undefined;
    if (layer && layer.olLayer instanceof VectorLayer) {
        const features = (layer.olLayer as VectorLayer<any>).getSource()?.getFeatures() || [];
        const plainData = features.map(f => ({ id: f.getId() as string, attributes: f.getProperties() }));
        onShowTableRequest(plainData, layer.name, layer.id);
    }
  }, [layers, onShowTableRequest]);

  return {
    layers,
    addLayer,
    removeLayer: (id: string) => removeLayers([id]),
    removeLayers,
    toggleLayerVisibility,
    setLayerOpacity,
    zoomToLayerExtent,
    handleShowLayerTable,
    renameLayer,
    changeLayerStyle,
    applyGraduatedSymbology,
    applyCategorizedSymbology,
    isWfsLoading: false,
    lastRemovedLayers,
    undoRemove: () => {
        if (lastRemovedLayers.length > 0) {
            const restored = lastRemovedLayers[lastRemovedLayers.length - 1];
            addLayer(restored);
            setLastRemovedLayers(prev => prev.slice(0, -1));
            toast({ description: `Capa "${restored.name}" restaurada.` });
        }
    },
    handleExtractByPolygon: () => {},
    handleExtractBySelection: () => {},
    handleExportLayer: () => {},
    handleExportWmsAsGeotiff: () => {},
    onChangeLayerLabels: () => {},
    onApplyGeoTiffStyle: () => {},
    onToggleWmsStyle: () => {},
    groupLayers: () => {},
    toggleGroupVisibility: () => {},
    toggleGroupExpanded: () => {},
    setGroupDisplayMode: () => {},
    ungroupLayer: () => {},
    renameGroup: () => {},
    toggleGroupPlayback: () => {},
    setGroupPlaySpeed: () => {},
    recalculateTrajectoryAttributes: () => {},
    handleAddHybridLayer: async () => null,
    addGeeLayerToMap: () => {},
    isDrawingSourceEmptyOrNotPolygon: true,
  };
};
