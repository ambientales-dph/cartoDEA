
"use client";

import { useState, useCallback, useEffect } from 'react';
import type { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { useToast } from "@/hooks/use-toast";
import type { MapLayer, GeoServerDiscoveredLayer } from '@/lib/types';
import { nanoid } from 'nanoid';
import { Style, Fill, Stroke } from 'ol/style';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';


interface UseGeoServerLayersProps {
  onLayerStateUpdate: (layerName: string, added: boolean, type: 'wms' | 'wfs') => void;
}

function getPortalBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:9003';
    }
  }
  return process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:9003';
}

export const useGeoServerLayers = ({
  onLayerStateUpdate,
}: UseGeoServerLayersProps) => {
  const { toast } = useToast();
  const [isFetching, setIsFetching] = useState(false);
  
  const handleFetchGeoServerLayers = useCallback(async (
    urlOverride?: string,
    projectCode: string = 'ALL'
  ): Promise<GeoServerDiscoveredLayer[] | null> => {
    setIsFetching(true);
    const portalBase = getPortalBaseUrl();

    try {
      // 1. Intentar cargar catálogo de metadatos desde Portal DEA / Firestore
      try {
        const portalApiUrl = (projectCode && projectCode.toUpperCase() !== 'ALL')
          ? `${portalBase}/api/gis/layers?projectCode=${encodeURIComponent(projectCode)}`
          : `${portalBase}/api/gis/layers`;

        const res = await fetch(portalApiUrl, {
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          const rawLayers: any[] = data.layers || [];

          if (rawLayers.length > 0) {
            const discoveredLayers: GeoServerDiscoveredLayer[] = rawLayers.map(l => {
              const layerProjectCode = (l.projectCode || projectCode || '').toUpperCase();
              const orgCode = layerProjectCode.match(/^([a-zA-Z]+)/)?.[1] || 'DEA';
              const qualifiedName = `${orgCode}:${l.name}`;
              
              let downloadUrl = l.downloadUrl || '';
              if (downloadUrl.startsWith('/')) {
                downloadUrl = `${portalBase}${downloadUrl}`;
              }

              return {
                name: qualifiedName,
                title: l.title || l.name,
                bbox: l.bbox,
                downloadUrl,
                storagePath: l.storagePath,
                category: l.category || 'shp',
                geometryType: l.geometryType,
                featureCount: l.featureCount,
                projectCode: layerProjectCode,
                wmsAddedToMap: false,
                wfsAddedToMap: false,
              };
            });

            toast({
              title: `Capas DEA`,
              description: `Se indexaron ${discoveredLayers.length} capas de ${new Set(discoveredLayers.map(d => d.projectCode)).size} proyectos.`,
            });

            return discoveredLayers;
          }
        }
      } catch (portalErr: any) {
        console.warn('[CartoDEA] No se pudo conectar con Portal DEA:', portalErr.message);
      }

      // 2. Fallback a GeoServer tradicional si se especificó una URL activa válida distinta de minfra
      if (urlOverride && !urlOverride.includes('minfra.gba.gob.ar')) {
        let urlToUse = urlOverride.trim().replace(/\/wms\/?$/, '').replace(/\/wfs\/?$/, '');
        const getCapabilitiesUrl = `${urlToUse}/wms?service=WMS&version=1.3.0&request=GetCapabilities`;
        const proxyUrl = `/api/geoserver-proxy?url=${encodeURIComponent(getCapabilitiesUrl)}&cacheBust=${Date.now()}`;

        try {
          const response = await fetch(proxyUrl);
          const text = await response.text();

          if (response.ok) {
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'application/xml');
            const layerNodes = Array.from(xml.querySelectorAll('Layer[queryable="1"]'));

            const discoveredLayers: GeoServerDiscoveredLayer[] = layerNodes.map(node => {
              const name = node.querySelector('Name')?.textContent ?? '';
              const title = node.querySelector('Title')?.textContent ?? name;
              let bbox: [number, number, number, number] | undefined = undefined;

              const bboxNode = node.querySelector('BoundingBox[CRS="CRS:84"]') || node.querySelector('BoundingBox[CRS="EPSG:4326"]');
              if (bboxNode) {
                const minx = parseFloat(bboxNode.getAttribute('minx') || '0');
                const miny = parseFloat(bboxNode.getAttribute('miny') || '0');
                const maxx = parseFloat(bboxNode.getAttribute('maxx') || '0');
                const maxy = parseFloat(bboxNode.getAttribute('maxy') || '0');
                if (!isNaN(minx) && !isNaN(miny) && !isNaN(maxx) && !isNaN(maxy)) {
                  bbox = [minx, miny, maxx, maxy];
                }
              }

              return { name, title, bbox, wmsAddedToMap: false, wfsAddedToMap: false };
            }).filter(l => l.name);

            return discoveredLayers;
          }
        } catch (geoErr: any) {
          console.error('[CartoDEA] Error fetching GeoServer fallback:', geoErr);
        }
      }

      toast({
        title: 'Aviso de Capas DEA',
        description: `Portal DEA no respondió en ${portalBase}. Asegúrese de que portal_dea esté corriendo en el puerto 9003.`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  const handleSyncDeasLayers = useCallback(async (projectCode: string = 'RSA063'): Promise<GeoServerDiscoveredLayer[] | null> => {
    setIsFetching(true);
    const portalBase = getPortalBaseUrl();
    try {
      toast({
        title: 'Sincronizando con Drive...',
        description: `Procesando capas para ${projectCode}`,
      });
      const syncUrl = `${portalBase}/api/gis/sync?projectCode=${encodeURIComponent(projectCode)}`;
      await fetch(syncUrl, { method: 'POST' });
      return await handleFetchGeoServerLayers(undefined, projectCode);
    } catch (err: any) {
      toast({
        title: 'Error de Sincronización',
        description: err.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [handleFetchGeoServerLayers, toast]);

  return {
    handleFetchGeoServerLayers,
    handleSyncDeasLayers,
    isFetching,
  };
};
