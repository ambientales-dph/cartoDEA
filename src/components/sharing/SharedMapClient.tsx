"use client";

import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import type { MapState, SerializableMapLayer } from '@/lib/types';
import { BASE_LAYER_DEFINITIONS } from '../map-view';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { EyeOff, Layers as LayersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';


interface SharedMapClientProps {
  mapState: MapState;
}

// Combine layer data from mapState with a unique ID for the UI
interface UILayerState extends SerializableMapLayer {
  uiId: string;
  olLayer?: TileLayer<any> | VectorLayer<any>;
}

const SharedMapClient: React.FC<SharedMapClientProps> = ({ mapState }) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [uiLayers, setUiLayers] = useState<UILayerState[]>([]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return; // Initialize map only once
    }

    const baseLayerDef = BASE_LAYER_DEFINITIONS.find(def => def.id === mapState.baseLayerId) || BASE_LAYER_DEFINITIONS[1];
    const baseLayer = baseLayerDef.createLayer ? baseLayerDef.createLayer() : null;
    const initialLayersForMap: (TileLayer<any> | VectorLayer<any>)[] = baseLayer ? [baseLayer] : [];
    
    const allLayersForUI: UILayerState[] = [];

    // Process operational layers from mapState
    mapState.layers.forEach((layerData, index) => {
        const uiId = `layer-${index}`;
        let olLayer: TileLayer<any> | VectorLayer<any> | null = null;

        if (layerData.type === 'wms' && layerData.url && layerData.layerName) {
            olLayer = new TileLayer({
                source: new TileWMS({
                    url: `${layerData.url}/wms`,
                    params: {
                        'LAYERS': layerData.layerName, 'TILED': true, 'STYLES': layerData.styleName || '', 'VERSION': '1.1.1', 'TRANSPARENT': true,
                    },
                    serverType: 'geoserver',
                }),
                opacity: layerData.opacity,
                visible: layerData.visible,
            });
        } else if (layerData.type === 'wfs' && layerData.url && layerData.layerName) {
            olLayer = new VectorLayer({
                source: new VectorSource({
                    format: new GeoJSON(),
                    url: (extent) => `/api/geoserver-proxy?url=${encodeURIComponent(`${layerData.url}/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${layerData.layerName}&outputFormat=application/json&srsname=EPSG:3857&bbox=${extent.join(',')},EPSG:3857`)}`,
                    strategy: bboxStrategy,
                }),
                style: new Style({
                    stroke: new Stroke({ color: '#3399CC', width: 2 }),
                    fill: new Fill({ color: 'rgba(0, 153, 204, 0.2)' }),
                    image: new CircleStyle({
                        radius: 5,
                        fill: new Fill({ color: 'rgba(0, 153, 204, 0.2)' }),
                        stroke: new Stroke({ color: '#3399CC', width: 1.5 })
                    })
                }),
                opacity: layerData.opacity,
                visible: layerData.visible,
            });
        } else if (layerData.type === 'gee' && layerData.geeParams?.tileUrl) {
             olLayer = new TileLayer({
                source: new XYZ({ url: layerData.geeParams.tileUrl, crossOrigin: 'anonymous' }),
                opacity: layerData.opacity,
                visible: layerData.visible,
            });
        } else if (layerData.type === 'local' && layerData.data) {
            // Reconstruct inlined local layer
            try {
                const features = new GeoJSON().readFeatures(layerData.data, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                olLayer = new VectorLayer({
                    source: new VectorSource({ features }),
                    style: new Style({
                        stroke: new Stroke({ color: '#ffcc33', width: 2 }),
                        fill: new Fill({ color: 'rgba(255, 204, 51, 0.3)' }),
                        image: new CircleStyle({
                            radius: 5,
                            fill: new Fill({ color: '#ffcc33' }),
                            stroke: new Stroke({ color: '#ffffff', width: 1.5 })
                        })
                    }),
                    opacity: layerData.opacity,
                    visible: layerData.visible,
                });
            } catch (e) {
                console.error("Error reconstructing inlined layer:", layerData.name, e);
            }
        }

        if (olLayer) {
            initialLayersForMap.push(olLayer);
        }
        
        allLayersForUI.push({ ...layerData, uiId, olLayer: olLayer || undefined });
    });

    const map = new Map({
        target: mapElementRef.current,
        layers: initialLayersForMap,
        view: new View({
            center: fromLonLat(mapState.view.center),
            zoom: mapState.view.zoom,
            projection: 'EPSG:3857',
        }),
        controls: defaultControls({ attributionOptions: { collapsible: false } }),
    });

    mapRef.current = map;
    setUiLayers(allLayersForUI);

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, [mapState]);

  const handleVisibilityChange = (uiId: string, isVisible: boolean) => {
    setUiLayers(prev => prev.map(l => {
        if (l.uiId === uiId && l.olLayer) {
            l.olLayer.setVisible(isVisible);
            return { ...l, visible: isVisible };
        }
        return l;
    }));
  };

  const handleOpacityChange = (uiId: string, opacity: number) => {
      setUiLayers(prev => prev.map(l => {
        if (l.uiId === uiId && l.olLayer) {
            l.olLayer.setOpacity(opacity);
            return { ...l, opacity };
        }
        return l;
    }));
  };

  return (
    <div className="relative w-full h-full">
        <div ref={mapElementRef} className="w-full h-full" />
        <div className="absolute top-16 left-2 z-10 bg-gray-800/80 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg w-72 max-h-[calc(100%-8rem)] flex flex-col">
            <h3 className="text-sm font-semibold mb-2 border-b border-gray-600 pb-2 flex items-center gap-2">
                <LayersIcon className="h-4 w-4" /> Capas
            </h3>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <div className="space-y-4">
                {uiLayers.map(layer => (
                    <div key={layer.uiId} className="text-xs pb-2 border-b border-white/5 last:border-0">
                        {layer.type === 'local-placeholder' ? (
                             <div className="flex items-center space-x-2 p-1 bg-black/20 rounded-md border border-dashed border-gray-600">
                                <EyeOff className="h-4 w-4 text-gray-500 flex-shrink-0"/>
                                <Label className="flex-1 truncate text-gray-500 italic" title={`${layer.name} (excede los 50KB, no disponible en modo compartido)`}>
                                    {layer.name}
                                </Label>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`vis-${layer.uiId}`}
                                        checked={layer.visible}
                                        onCheckedChange={(checked) => handleVisibilityChange(layer.uiId, !!checked)}
                                        className="border-gray-400 data-[state=checked]:bg-primary"
                                    />
                                    <Label htmlFor={`vis-${layer.uiId}`} className={cn("flex-1 truncate cursor-pointer", !layer.visible && "text-gray-400")} title={layer.name}>
                                        {layer.name} {layer.type === 'local' && '(Inyectada)'}
                                    </Label>
                                </div>
                                <div className="mt-2 pl-1 flex items-center gap-2">
                                    <span className="text-[10px] text-gray-500 w-6">Op.</span>
                                    <Slider
                                        value={[layer.opacity * 100]}
                                        onValueChange={(value) => handleOpacityChange(layer.uiId, value[0] / 100)}
                                        className="flex-1 h-2"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default SharedMapClient;
