
'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Map, View } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions, DragPan } from 'ol/interaction';
import type { MapBrowserEvent } from 'ol';

const defaultDrawingStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: '#ffcc33',
    width: 2,
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: '#ffcc33',
    }),
  }),
});

interface UseOpenLayersMapOptions {
  initialCenter?: number[]; // [lon, lat]
  initialZoom?: number;
}

export const useOpenLayersMap = (options: UseOpenLayersMapOptions = {}) => {
  const mapRef = useRef<Map | null>(null);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const drawingSourceRef = useRef<VectorSource>(new VectorSource());
  const drawingLayerRef = useRef<VectorLayer<VectorSource>>(
    new VectorLayer({
      source: drawingSourceRef.current,
      style: defaultDrawingStyle,
      properties: {
        id: 'drawing-layer',
        name: 'Dibujos del Usuario',
        isDrawingLayer: true,
      },
      zIndex: 2000, // Siempre arriba
    })
  );

  useEffect(() => {
    if (!mapRef.current) {
      console.log('useOpenLayersMap: Inicializando instancia única del mapa');
      
      const center = options.initialCenter 
        ? fromLonLat(options.initialCenter, 'EPSG:3857') 
        : fromLonLat([-60.0, -36.5], 'EPSG:3857');
      
      const zoom = options.initialZoom ?? 7;

      const map = new Map({
        layers: [drawingLayerRef.current],
        view: new View({
          center: center,
          zoom: zoom,
          projection: 'EPSG:3857',
          constrainResolution: true,
        }),
        interactions: defaultInteractions().extend([
          new DragPan({
            condition: (event: MapBrowserEvent<any>) => {
              return event.originalEvent.button === 1; // Botón central para arrastrar siempre
            },
          }),
        ]),
        controls: defaultControls({
          attributionOptions: { collapsible: false },
          zoom: true,
          rotate: false,
        }),
      });
      
      mapRef.current = map;

      if (mapElementRef.current) {
        map.setTarget(mapElementRef.current);
        map.updateSize();
        console.log('useOpenLayersMap: Mapa conectado al DOM en inicialización');
      }

      setIsMapReady(true);
    }

    return () => {
      if (mapRef.current) {
        console.log('useOpenLayersMap: Desmontando mapa');
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  const setMapInstanceAndElement = useCallback((_map: Map, element: HTMLDivElement | null) => {
    if (element) {
      mapElementRef.current = element;
      if (mapRef.current) {
        if (mapRef.current.getTarget() !== element) {
          mapRef.current.setTarget(element);
        }
        mapRef.current.updateSize();
        console.log('useOpenLayersMap: Mapa conectado al DOM');
      }
    }
  }, []);

  return {
    mapRef,
    mapElementRef,
    drawingSourceRef,
    drawingLayerRef,
    setMapInstanceAndElement,
    isMapReady,
  };
};
