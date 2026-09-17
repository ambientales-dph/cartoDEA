
"use client";

import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map as OLMap } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import type { Layer } from 'ol/layer';
import type { BaseLayerSettings } from '@/lib/types';

interface MapViewProps {
  setMapInstanceAndElement: (map: OLMap, element: HTMLDivElement | null) => void;
  onMapClick?: (event: any) => void; 
  activeBaseLayerId?: string; 
  baseLayerSettings: BaseLayerSettings;
  isMapReady?: boolean;
}

export type Band = 'red' | 'green' | 'blue' | 'false-color-vegetation' | 'false-color-urban' | 'none';

type BaseLayerDefinition = {
  id: string;
  name: string;
  band?: Band;
  parentLayerId?: string;
  createLayer?: () => TileLayer<XYZ | OSM> | null;
}

export const BASE_LAYER_DEFINITIONS: readonly BaseLayerDefinition[] = [
  { id: 'none', name: 'Sin capa base', createLayer: () => null },
  {
    id: 'osm-standard',
    name: 'OpenStreetMap',
    createLayer: () => new TileLayer({
      source: new OSM(),
      properties: { baseLayerId: 'osm-standard', isBaseLayer: true, name: 'OSMBaseLayer' },
      zIndex: 0,
    }),
  },
  {
    id: 'carto-light',
    name: 'OSM Gris (Carto)',
    createLayer: () => new TileLayer({
      source: new XYZ({ 
        url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attributions: '&copy; Carto',
        maxZoom: 20,
        crossOrigin: 'Anonymous'
      }),
      properties: { baseLayerId: 'carto-light', isBaseLayer: true, name: 'CartoGrayscaleBaseLayer' },
      zIndex: 0,
    }),
  },
  {
    id: 'carto-labels',
    name: 'OSM Etiquetas (Carto)',
    createLayer: () => new TileLayer({
      source: new XYZ({ 
        url: 'https://{a-d}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
        maxZoom: 20,
        crossOrigin: 'Anonymous'
      }),
      properties: { baseLayerId: 'carto-labels', isBaseLayer: true, name: 'CartoLabelsBaseLayer' },
      zIndex: 500,
    }),
  },
  {
    id: 'esri-satellite',
    name: 'ESRI Satelital (Color Natural)',
    createLayer: () => new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles &copy; Esri',
        maxZoom: 19,
        crossOrigin: 'Anonymous'
      }),
      properties: { baseLayerId: 'esri-satellite', isBaseLayer: true, name: 'ESRISatelliteBaseLayer' },
      zIndex: 0,
    }),
  },
  { id: 'esri-false-color-vegetation', name: 'Satelital Falso Color (Vegetación)', band: 'false-color-vegetation', parentLayerId: 'esri-satellite' },
  { id: 'esri-false-color-urban', name: 'Satelital Falso Color (Urbano)', band: 'false-color-urban', parentLayerId: 'esri-satellite' },
  { id: 'esri-red', name: 'ESRI - Banda Roja', band: 'red', parentLayerId: 'esri-satellite' },
  { id: 'esri-green', name: 'ESRI - Banda Verde', band: 'green', parentLayerId: 'esri-satellite' },
  { id: 'esri-blue', name: 'ESRI - Banda Azul', band: 'blue', parentLayerId: 'esri-satellite' },
] as const;

const MapView: React.FC<MapViewProps> = ({ setMapInstanceAndElement, activeBaseLayerId, baseLayerSettings, isMapReady }) => {
  const mapElementRef = useRef<HTMLDivElement | null>(null);

  // Callback ref para asegurar que el elemento DOM se asigne inmediatamente en el render
  const setContainerRef = (element: HTMLDivElement | null) => {
    mapElementRef.current = element;
    if (element) {
      const dummyMap = new OLMap({});
      setMapInstanceAndElement(dummyMap, element);
    }
  };

  // Efecto de respaldo cuando isMapReady cambia o el componente se monta
  useEffect(() => {
    if (!mapElementRef.current) return;
    const dummyMap = new OLMap({}); 
    setMapInstanceAndElement(dummyMap, mapElementRef.current);
  }, [setMapInstanceAndElement, isMapReady]);

  // ResizeObserver para asegurar que OpenLayers recalcule dimensiones cuando el contenedor flex termine de renderizar
  useEffect(() => {
    const el = mapElementRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      window.dispatchEvent(new Event('resize'));
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={setContainerRef} className="w-full h-full bg-gray-200" />;
};

export default MapView;
