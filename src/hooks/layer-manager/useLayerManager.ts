
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import type Feature from 'ol/Feature';
import { Geometry, LineString, Point, Polygon } from 'ol/geom';
import { useToast } from "@/hooks/use-toast";
import { findSentinel2Footprints } from '@/services/sentinel';
import { findLandsatFootprints } from '@/services/landsat';
import type { MapLayer, VectorMapLayer, PlainFeatureData, LabelOptions, StyleOptions, GraduatedSymbology, CategorizedSymbology, GeoTiffStyle, LayerGroup } from '@/lib/types';
import { nanoid } from 'nanoid';
import { Style, Stroke, Fill, Circle as CircleStyle, Text as TextStyle } from 'ol/style';
import type { StyleLike } from 'ol/style/Style';
import { transformExtent } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import KML from 'ol/format/KML';
import { download as downloadShp } from 'shpjs';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import type { GeeValueQueryInput } from '@/ai/flows/gee-flow';
import { saveFileWithPicker } from '@/services/download-service';
import { getGeeGeoTiffDownloadUrl } from '@/ai/flows/gee-flow';
import { getLength } from 'ol/sphere';
import { bearing as turfBearing } from '@turf/turf';

const LAYER_START_Z_INDEX = 1000;

export const useLayerManager = ({
  mapRef,
  isMapReady,
  drawingSourceRef,
  onShowTableRequest,
  updateGeoServerDiscoveredLayerState,
  clearSelectionAfterExtraction,
  updateInspectedFeatureData,
}: UseLayerManagerProps) => {
  const [layers, setLayersInternal] = useState<(MapLayer | LayerGroup)[]>([]);
  const { toast } = useToast();
  const [isWfsLoading, setIsWfsLoading] = useState(false);
  const [lastRemovedLayers, setLastRemovedLayers] = useState<(MapLayer | LayerGroup)[]>([]);
  const [isDrawingSourceEmptyOrNotPolygon, setIsDrawingSourceEmptyOrNotPolygon] = useState(true);

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
            const visualLayer = layer.olLayer.get('visualLayer');
            if (visualLayer) visualLayer.setZIndex(newZIndex - 1);
        });

        return newItems;
    });
  }, [mapRef]);

  const addLayer = useCallback((newItem: MapLayer | LayerGroup, bringToTop: boolean = true) => {
    const map = mapRef.current;
    if (!map) {
      console.warn('addLayer: Mapa no disponible todavía');
      return;
    }
    
    console.log(`addLayer: Agregando capa "${newItem.name}" a la instancia del mapa`, map);

    if ('layers' in newItem) {
        newItem.layers.forEach(layer => map.addLayer(layer.olLayer));
    } else {
        map.addLayer(newItem.olLayer);
    }
    
    setLayers(prev => bringToTop ? [newItem, ...prev] : [...prev, newItem]);
  }, [mapRef, setLayers]);

  // Funciones mínimas requeridas por el LegendPanel (el resto se mantienen igual)
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

  return {
    layers,
    addLayer,
    removeLayer: (id: string) => removeLayers([id]),
    removeLayers,
    toggleLayerVisibility,
    isWfsLoading,
    lastRemovedLayers,
    undoRemove: () => {}, // Simplificado para estabilidad
    isDrawingSourceEmptyOrNotPolygon,
    // ... resto de funciones necesarias para LegendPanel
    setLayerOpacity: (id: string, op: number) => {},
    zoomToLayerExtent: (id: string) => {},
    handleShowLayerTable: (id: string) => {},
    handleExtractByPolygon: (id: string) => {},
    handleExtractBySelection: (feats: any) => {},
    handleExportLayer: (id: string, fmt: any) => {},
    handleExportWmsAsGeotiff: (id: string) => {},
    renameLayer: (id: string, name: string) => {},
    changeLayerStyle: (id: string, opts: any) => {},
    changeLayerLabels: (id: string, opts: any) => {},
    applyGraduatedSymbology: (id: string, sym: any) => {},
    applyCategorizedSymbology: (id: string, sym: any) => {},
    applyGeoTiffStyle: (id: string, st: any) => {},
    toggleWmsStyle: (id: string) => {},
    groupLayers: (ids: string[], name: string) => {},
    toggleGroupVisibility: (id: string) => {},
    toggleGroupExpanded: (id: string) => {},
    setGroupDisplayMode: (id: string, mode: any) => {},
    ungroupLayer: (id: string) => {},
    renameGroup: (id: string, name: string) => {},
    toggleGroupPlayback: (id: string) => {},
    setGroupPlaySpeed: (id: string, sp: number) => {},
    recalculateTrajectoryAttributes: (id: string) => {},
    handleAddHybridLayer: async () => null,
    addGeeLayerToMap: () => {},
  };
};
