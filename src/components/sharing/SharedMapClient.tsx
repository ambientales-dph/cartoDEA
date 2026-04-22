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
import type { MapState, SerializableMapLayer, GraduatedSymbology, CategorizedSymbology, StyleOptions, BaseLayerSettings } from '@/lib/types';
import { BASE_LAYER_DEFINITIONS } from '../map-view';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { EyeOff, Layers as LayersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type Layer from 'ol/layer/Layer';

interface SharedMapClientProps {
  mapState: MapState;
}

interface UILayerState extends SerializableMapLayer {
  uiId: string;
  olLayer?: TileLayer<any> | VectorLayer<any>;
}

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

const applyBaseLayerEffects = (layer: Layer, settings: BaseLayerSettings) => {
    layer.setOpacity(settings.opacity);
    layer.on('prerender', (event: any) => {
        const context = event.context;
        if (!context) return;
        context.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`;
    });
    layer.on('postrender', (event: any) => {
        const context = event.context;
        if (!context) return;
        context.filter = 'none';
    });
};

const createSharedStyleFunction = (
  simpleStyle: StyleOptions | undefined,
  graduatedSymbology: GraduatedSymbology | undefined,
  categorizedSymbology: CategorizedSymbology | undefined
) => {
  return (feature: any) => {
    let fillColor = 'rgba(51, 153, 204, 0.2)';
    let strokeColor = '#3399CC';
    let strokeWidth = 2;
    let radius = 5;

    if (graduatedSymbology) {
        const value = feature.get(graduatedSymbology.field);
        fillColor = 'rgba(128,128,128,0.5)';
        if (typeof value === 'number') {
            fillColor = graduatedSymbology.colors[graduatedSymbology.colors.length - 1];
            for (let i = 0; i < graduatedSymbology.breaks.length; i++) {
                if (value <= graduatedSymbology.breaks[i]) {
                    fillColor = graduatedSymbology.colors[i];
                    break;
                }
            }
        }
        strokeColor = colorMap[graduatedSymbology.strokeColor] || (isValidHex(graduatedSymbology.strokeColor) ? graduatedSymbology.strokeColor : 'rgba(0,0,0,0.5)');
        strokeWidth = graduatedSymbology.strokeWidth ?? 1;
    } else if (categorizedSymbology) {
        const value = feature.get(categorizedSymbology.field);
        const category = categorizedSymbology.categories.find(c => c.value === value);
        fillColor = category ? category.color : 'rgba(128,128,128,0.5)';
        strokeColor = colorMap[categorizedSymbology.strokeColor] || (isValidHex(categorizedSymbology.strokeColor) ? categorizedSymbology.strokeColor : 'rgba(0,0,0,0.5)');
        strokeWidth = categorizedSymbology.strokeWidth ?? 1;
    } else if (simpleStyle) {
        strokeColor = colorMap[simpleStyle.strokeColor] || (isValidHex(simpleStyle.strokeColor) ? simpleStyle.strokeColor : strokeColor);
        fillColor = colorMap[simpleStyle.fillColor] || (isValidHex(simpleStyle.fillColor) ? simpleStyle.fillColor : fillColor);
        strokeWidth = simpleStyle.lineWidth;
        radius = simpleStyle.pointSize || 5;
    }

    return new Style({
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
        image: new CircleStyle({
            radius: radius,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: strokeColor, width: 1 }),
        }),
    });
  };
};

const SharedMapClient: React.FC<SharedMapClientProps> = ({ mapState }) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [uiLayers, setUiLayers] = useState<UILayerState[]>([]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return;
    }

    const baseLayerDef = BASE_LAYER_DEFINITIONS.find(def => def.id === mapState.baseLayerId) || BASE_LAYER_DEFINITIONS[1];
    const baseLayer = baseLayerDef.createLayer ? baseLayerDef.createLayer() : null;
    
    if (baseLayer && mapState.baseLayerSettings) {
        applyBaseLayerEffects(baseLayer, mapState.baseLayerSettings);
    }
    
    const initialLayersForMap: (TileLayer<any> | VectorLayer<any>)[] = baseLayer ? [baseLayer] : [];
    const allLayersForUI: UILayerState[] = [];

    mapState.layers.forEach((layerData, index) => {
        const uiId = `layer-${index}`;
        let olLayer: TileLayer<any> | VectorLayer<any> | null = null;

        const sharedStyle = createSharedStyleFunction(layerData.simpleStyle, layerData.graduatedSymbology, layerData.categorizedSymbology);

        if (layerData.type === 'wms' && layerData.url && layerData.layerName) {
            olLayer = new TileLayer({
                source: new TileWMS({
                    url: `${layerData.url}/wms`,
                    params: {
                        'LAYERS': layerData.layerName, 'TILED': true, 'STYLES': layerData.styleName || '', 'VERSION': '1.1.1', 'TRANSPARENT': true,
                    },
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous',
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
                style: layerData.wmsStyleEnabled ? new Style() : sharedStyle,
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
            try {
                const features = new GeoJSON().readFeatures(layerData.data, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                olLayer = new VectorLayer({
                    source: new VectorSource({ features }),
                    style: sharedStyle,
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
        <div className="absolute top-14 left-2 z-10 bg-gray-800/90 backdrop-blur-sm text-white p-2 rounded-md shadow-2xl w-60 max-h-[calc(100%-6rem)] flex flex-col border border-gray-700/50">
            <h3 className="text-[11px] font-bold mb-2 border-b border-gray-600/50 pb-1.5 flex items-center gap-2 px-1 text-gray-200">
                <LayersIcon className="h-3.5 w-3.5 text-primary" /> CAPAS ACTIVAS
            </h3>
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="space-y-2">
                {uiLayers.map(layer => (
                    <div key={layer.uiId} className="text-[10px] pb-1.5 border-b border-white/5 last:border-0 last:pb-0">
                        {layer.type === 'local-placeholder' ? (
                             <div className="flex items-center space-x-2 p-1 bg-black/30 rounded border border-dashed border-gray-600/50 opacity-60">
                                <EyeOff className="h-3 w-3 text-gray-500 flex-shrink-0"/>
                                <Label className="flex-1 truncate text-[10px] text-gray-400 italic" title={`${layer.name} (excede el límite de peso)`}>
                                    {layer.name}
                                </Label>
                            </div>
                        ) : (
                            <div className="px-1">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`vis-${layer.uiId}`}
                                        checked={layer.visible}
                                        onCheckedChange={(checked) => handleVisibilityChange(layer.uiId, !!checked)}
                                        className="h-3 w-3 border-gray-500 data-[state=checked]:bg-primary rounded-sm"
                                    />
                                    <Label htmlFor={`vis-${layer.uiId}`} className={cn("flex-1 truncate cursor-pointer leading-tight text-[10px]", !layer.visible && "text-gray-500")} title={layer.name}>
                                        {layer.name}
                                    </Label>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <Slider
                                        value={[layer.opacity * 100]}
                                        onValueChange={(value) => handleOpacityChange(layer.uiId, value[0] / 100)}
                                        className="flex-1 h-1"
                                    />
                                </div>
                            </div>
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
