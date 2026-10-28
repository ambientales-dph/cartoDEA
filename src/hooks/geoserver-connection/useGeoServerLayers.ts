
"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { useToast } from "@/hooks/use-toast";
import type { MapLayer, GeoServerDiscoveredLayer, SyncProgressState } from '@/lib/types';
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
  const [syncProgress, setSyncProgress] = useState<SyncProgressState>({
    active: false,
    projectCode: '',
    current: 0,
    total: 0,
    layerName: '',
    percent: 0,
    status: 'idle',
  });

  // Cooldown de 15 minutos en memoria por proyecto para evitar saturación de red
  const lastCheckedProjectsRef = useRef<Record<string, number>>({});
  const CHECK_COOLDOWN_MS = 15 * 60 * 1000;
  
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
                isDownloadOnly: l.isDownloadOnly ?? (l.category === 'img' || l.category === 'dem'),
                sizeBytes: l.sizeBytes,
                driveFileId: l.driveFileId,
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

      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      toast({
        title: 'Aviso de Capas DEA',
        description: isLocal
          ? `Portal DEA no respondió en ${portalBase}. Asegúrese de que portal_dea esté corriendo en el puerto 9003.`
          : `Portal DEA no respondió en ${portalBase}. Por favor, intente nuevamente en unos instantes.`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  const dismissSyncProgress = useCallback(() => {
    setSyncProgress(prev => ({ ...prev, active: false }));
  }, []);

  /**
   * Sincroniza un proyecto contra Google Drive recibiendo el progreso en tiempo real
   * mediante Server-Sent Events (SSE).
   */
  const handleStreamSync = useCallback(async (projectCode: string): Promise<GeoServerDiscoveredLayer[] | null> => {
    const portalBase = getPortalBaseUrl();
    setSyncProgress({
      active: true,
      projectCode,
      current: 0,
      total: 0,
      layerName: 'Iniciando conexión...',
      percent: 0,
      status: 'starting',
      message: `Conectando con Google Drive para ${projectCode}...`,
    });

    try {
      const syncUrl = `${portalBase}/api/gis/sync-stream?projectCode=${encodeURIComponent(projectCode)}`;
      const res = await fetch(syncUrl);

      if (!res.ok) {
        throw new Error(`Error en servidor: ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error('No se pudo abrir el stream de sincronización');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            try {
              const payload = JSON.parse(trimmed.replace(/^data:\s*/, ''));
              setSyncProgress(prev => ({
                ...prev,
                active: true,
                projectCode,
                current: payload.current || prev.current,
                total: payload.total || prev.total,
                layerName: payload.layerName || prev.layerName,
                percent: payload.percent !== undefined ? payload.percent : prev.percent,
                status: payload.status || 'syncing',
                message: payload.message || prev.message,
              }));
            } catch (jsonErr) {
              console.warn('[Sync Stream] Error parseando chunk SSE:', jsonErr);
            }
          }
        }
      }

      // Marcar cooldown para este proyecto
      lastCheckedProjectsRef.current[projectCode] = Date.now();

      // Recargar catálogo general de capas para reflejar las nuevas
      const updatedLayers = await handleFetchGeoServerLayers(undefined, 'ALL');

      // Desvanecer el HUD a los 3.5 segundos tras completarse
      setTimeout(() => {
        setSyncProgress(prev => (prev.projectCode === projectCode ? { ...prev, active: false } : prev));
      }, 3500);

      return updatedLayers;
    } catch (err: any) {
      console.error(`[GIS Stream Sync] Error sincronizando ${projectCode}:`, err);
      setSyncProgress(prev => ({
        ...prev,
        status: 'error',
        message: err.message || 'Error durante la sincronización',
      }));
      setTimeout(() => {
        setSyncProgress(prev => (prev.projectCode === projectCode ? { ...prev, active: false } : prev));
      }, 4000);
      return null;
    }
  }, [handleFetchGeoServerLayers]);

  /**
   * Verificación pasiva al expandir un proyecto:
   * Respeta el cooldown de 15 minutos. Si hay cambios en Drive, dispara handleStreamSync automáticamente.
   */
  const handlePassiveProjectCheck = useCallback(async (projectCode: string) => {
    const pCode = (projectCode || '').toUpperCase();
    if (!pCode || pCode === 'GENERAL' || pCode === 'ALL') return;

    const now = Date.now();
    const lastCheck = lastCheckedProjectsRef.current[pCode] || 0;

    // Si ya fue chequeado en los últimos 15 minutos, ignorar completamente
    if (now - lastCheck < CHECK_COOLDOWN_MS) {
      return;
    }

    // Registrar chequeo
    lastCheckedProjectsRef.current[pCode] = now;
    const portalBase = getPortalBaseUrl();

    try {
      const checkUrl = `${portalBase}/api/gis/check-update?projectCode=${encodeURIComponent(pCode)}`;
      const res = await fetch(checkUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.hasUpdates) {
          console.log(`[Passive Sync] Se detectaron modificaciones en Drive para ${pCode}. Sincronizando en segundo plano...`);
          // Disparar sincronización con progreso visible en el HUD
          await handleStreamSync(pCode);
        }
      }
    } catch (err: any) {
      console.warn(`[Passive Sync] No se pudo comprobar actualizaciones para ${pCode}:`, err.message);
    }
  }, [handleStreamSync]);

  const handleSyncDeasLayers = useCallback(async (projectCode: string = 'RSA063'): Promise<GeoServerDiscoveredLayer[] | null> => {
    return await handleStreamSync(projectCode);
  }, [handleStreamSync]);

  return {
    handleFetchGeoServerLayers,
    handleSyncDeasLayers,
    handleStreamSync,
    handlePassiveProjectCheck,
    syncProgress,
    dismissSyncProgress,
    isFetching,
  };
};
