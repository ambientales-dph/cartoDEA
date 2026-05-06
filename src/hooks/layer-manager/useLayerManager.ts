
"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  const playbackIntervalsRef = useRef<Record<string, NodeJS.Timeout>>({});

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
            placement: options.placement === 'parallel' ? 'line' : 'point',
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

        // Inverse Z-index logic: Top item in list gets highest Z-index
        operationalLayers.forEach((layer, index) => {
            const newZIndex = LAYER_START_Z_INDEX + (operationalLayers.length - 1 - index);
            layer.olLayer.setZIndex(newZIndex);
        });

        return newItems;
    });
  }, []);

  const reorderLayers = useCallback((draggedIds: string[], targetId: string | null) => {
    setLayers(prev => {
        const itemsToMove = prev.filter(item => draggedIds.includes(item.id));
        const remainingItems = prev.filter(item => !draggedIds.includes(item.id));
        
        if (targetId === null) {
            return [...remainingItems, ...itemsToMove];
        }
        
        const targetIndex = remainingItems.findIndex(item => item.id === targetId);
        if (targetIndex === -1) return prev;
        
        const result = [...remainingItems];
        result.splice(targetIndex, 0, ...itemsToMove);
        return result;
    });
  }, [setLayers]);

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
              if('layers' in item) {
                  item.layers.forEach(l => mapRef.current?.removeLayer(l.olLayer));
                  if (playbackIntervalsRef.current[item.id]) {
                      clearInterval(playbackIntervalsRef.current[item.id]);
                      delete playbackIntervalsRef.current[item.id];
                  }
              }
              else mapRef.current?.removeLayer(item.olLayer);
          });
          setLastRemovedLayers(prevRemoved => [...prevRemoved, ...toRemove]);
          return prev.filter(i => !ids.includes(i.id));
      });
  }, [mapRef, setLayers]);

  const toggleLayerVisibility = useCallback((id: string, groupId?: string) => {
      setLayers(prev => prev.map(item => {
          if (item.id === id) {
              const currentItem = item as MapLayer;
              const newVis = !currentItem.visible;
              currentItem.olLayer.setVisible(newVis);
              return { ...item, visible: newVis };
          }
          
          if (groupId && 'layers' in item && item.id === groupId) {
              if (item.displayMode === 'single') {
                  // Radio button logic
                  const updatedLayers = item.layers.map(l => {
                      const isTarget = l.id === id;
                      l.olLayer.setVisible(isTarget);
                      return { ...l, visible: isTarget };
                  });
                  return { ...item, layers: updatedLayers };
              } else {
                  // Checkbox logic
                  const updatedLayers = item.layers.map(l => {
                      if (l.id === id) {
                          const newVis = !l.visible;
                          l.olLayer.setVisible(newVis);
                          return { ...l, visible: newVis };
                      }
                      return l;
                  });
                  return { ...item, layers: updatedLayers };
              }
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
        // Search inside groups
        if ('layers' in item) {
            const hasLayer = item.layers.some(l => l.id === id);
            if (hasLayer) {
                const updatedLayers = item.layers.map(l => {
                    if (l.id === id) {
                        l.olLayer.setOpacity(opacity);
                        return { ...l, opacity };
                    }
                    return l;
                });
                return { ...item, layers: updatedLayers };
            }
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
      // Find layer at root or inside group
      if (!('layers' in item)) {
        if (item.id === layerId) {
            const updatedLayer = { ...item, simpleStyle: styleOptions };
            if (updatedLayer.olLayer instanceof VectorLayer) {
               updatedLayer.olLayer.setStyle(createLayerStyle(updatedLayer));
            }
            return updatedLayer;
        }
        return item;
      } else {
        const updatedLayers = item.layers.map(l => {
            if (l.id === layerId) {
                const updated = { ...l, simpleStyle: styleOptions };
                if (updated.olLayer instanceof VectorLayer) {
                   updated.olLayer.setStyle(createLayerStyle(updated));
                }
                return updated;
            }
            return l;
        });
        return { ...item, layers: updatedLayers };
      }
    }));
  }, [setLayers, createLayerStyle]);

  const applyGraduatedSymbology = useCallback((layerId: string, symbology: GraduatedSymbology) => {
    setLayers(prev => prev.map(item => {
        const updateLayer = (l: MapLayer) => {
            if (l.id === layerId && l.olLayer instanceof VectorLayer) {
                const updated = { ...l, graduatedSymbology: symbology };
                l.olLayer.setStyle(createLayerStyle(updated));
                return updated;
            }
            return l;
        };
        
        if (!('layers' in item)) return updateLayer(item);
        return { ...item, layers: item.layers.map(updateLayer) };
    }));
  }, [setLayers, createLayerStyle]);

  const applyCategorizedSymbology = useCallback((layerId: string, symbology: CategorizedSymbology) => {
    setLayers(prev => prev.map(item => {
        const updateLayer = (l: MapLayer) => {
            if (l.id === layerId && l.olLayer instanceof VectorLayer) {
                const updated = { ...l, categorizedSymbology: symbology };
                l.olLayer.setStyle(createLayerStyle(updated));
                return updated;
            }
            return l;
        };
        
        if (!('layers' in item)) return updateLayer(item);
        return { ...item, layers: item.layers.map(updateLayer) };
    }));
  }, [setLayers, createLayerStyle]);

  const onChangeLayerLabels = useCallback((id: string, options: LabelOptions) => {
    setLayers(prev => prev.map(item => {
        const updateLayer = (l: MapLayer) => {
            if (l.id === id && l.olLayer instanceof VectorLayer) {
                const updated = { ...l, labelOptions: options };
                l.olLayer.setStyle(createLayerStyle(updated));
                return updated;
            }
            return l;
        };
        if (!('layers' in item)) return updateLayer(item);
        return { ...item, layers: item.layers.map(updateLayer) };
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

  const groupLayers = useCallback((layerIds: string[], groupName: string) => {
    setLayers(prev => {
        const itemsToGroup = prev.filter(i => layerIds.includes(i.id) && !('layers' in i)) as MapLayer[];
        if (itemsToGroup.length < 2) return prev;

        const groupId = `group-${nanoid()}`;
        const newGroup: LayerGroup = {
            id: groupId,
            name: groupName,
            layers: itemsToGroup.map(l => ({ ...l, groupId })),
            isExpanded: true,
            displayMode: 'multiple'
        };

        const firstIndex = prev.findIndex(i => layerIds.includes(i.id));
        const result = prev.filter(i => !layerIds.includes(i.id));
        result.splice(firstIndex, 0, newGroup);
        return result;
    });
  }, [setLayers]);

  const toggleGroupVisibility = useCallback((groupId: string) => {
    setLayers(prev => prev.map(item => {
        if ('layers' in item && item.id === groupId) {
            const isAnyVisible = item.layers.some(l => l.visible);
            const newVis = !isAnyVisible;
            item.layers.forEach(l => {
                l.visible = newVis;
                l.olLayer.setVisible(newVis);
            });
            return { ...item };
        }
        return item;
    }));
  }, [setLayers]);

  const toggleGroupExpanded = useCallback((groupId: string) => {
    setLayers(prev => prev.map(item => {
        if ('layers' in item && item.id === groupId) {
            return { ...item, isExpanded: !item.isExpanded };
        }
        return item;
    }));
  }, [setLayers]);

  const setGroupDisplayMode = useCallback((groupId: string, mode: 'single' | 'multiple') => {
    setLayers(prev => prev.map(item => {
        if ('layers' in item && item.id === groupId) {
            if (mode === 'single') {
                // Ensure only one is visible
                item.layers.forEach((l, idx) => {
                    const vis = idx === 0;
                    l.visible = vis;
                    l.olLayer.setVisible(vis);
                });
            }
            return { ...item, displayMode: mode };
        }
        return item;
    }));
  }, [setLayers]);

  const ungroup = useCallback((groupId: string) => {
      setLayers(prev => {
          const groupIndex = prev.findIndex(i => i.id === groupId);
          if (groupIndex === -1) return prev;
          
          const item = prev[groupIndex] as LayerGroup;
          const layers = item.layers.map(l => {
              const { groupId, ...rest } = l;
              return rest as MapLayer;
          });
          
          const result = [...prev];
          result.splice(groupIndex, 1, ...layers);
          return result;
      });
  }, [setLayers]);

  const toggleGroupPlayback = useCallback((groupId: string) => {
    setLayers(prev => prev.map(item => {
        if ('layers' in item && item.id === groupId) {
            const isPlaying = !item.isPlaying;
            
            if (playbackIntervalsRef.current[groupId]) {
                clearInterval(playbackIntervalsRef.current[groupId]);
                delete playbackIntervalsRef.current[groupId];
            }

            if (isPlaying && item.layers.length > 1) {
                const speed = item.playSpeed || 1000;
                playbackIntervalsRef.current[groupId] = setInterval(() => {
                    setLayers(pLayers => pLayers.map(pItem => {
                        if ('layers' in pItem && pItem.id === groupId) {
                            const currentIndex = pItem.layers.findIndex(l => l.visible);
                            const nextIndex = (currentIndex + 1) % pItem.layers.length;
                            
                            pItem.layers.forEach((l, idx) => {
                                const vis = idx === nextIndex;
                                l.visible = vis;
                                l.olLayer.setVisible(vis);
                            });
                        }
                        return pItem;
                    }));
                }, speed);
            }
            
            return { ...item, isPlaying };
        }
        return item;
    }));
  }, [setLayers]);

  const setGroupPlaySpeed = useCallback((groupId: string, speed: number) => {
    setLayers(prev => prev.map(item => {
        if ('layers' in item && item.id === groupId) {
            const wasPlaying = item.isPlaying;
            if (wasPlaying) {
                // Restart interval with new speed
                if (playbackIntervalsRef.current[groupId]) clearInterval(playbackIntervalsRef.current[groupId]);
                playbackIntervalsRef.current[groupId] = setInterval(() => {
                    setLayers(pLayers => pLayers.map(pItem => {
                        if ('layers' in pItem && pItem.id === groupId) {
                            const currentIndex = pItem.layers.findIndex(l => l.visible);
                            const nextIndex = (currentIndex + 1) % pItem.layers.length;
                            pItem.layers.forEach((l, idx) => {
                                const vis = idx === nextIndex;
                                l.visible = vis;
                                l.olLayer.setVisible(vis);
                            });
                        }
                        return pItem;
                    }));
                }, speed);
            }
            return { ...item, playSpeed: speed };
        }
        return item;
    }));
  }, [setLayers]);

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

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
        Object.values(playbackIntervalsRef.current).forEach(clearInterval);
    };
  }, []);

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
    reorderLayers,
    groupLayers,
    toggleGroupVisibility,
    toggleGroupExpanded,
    setGroupDisplayMode,
    ungroup,
    renameGroup: (id: string, name: string) => setLayers(prev => prev.map(i => i.id === id ? { ...i, name } : i)),
    toggleGroupPlayback,
    setGroupPlaySpeed,
  };
};
