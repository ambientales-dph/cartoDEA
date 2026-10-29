"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { getDatabusFirestore } from '@/firebase/databus-client';
import type { GeoServerDiscoveredLayer, MapLayer } from '@/lib/types';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke, Text as TextStyle } from 'ol/style';

export interface MonitoringReportData {
  reportId: string;
  reportOid: string;
  stationId: string;
  stationName: string;
  basinCode?: string;
  latitude: number;
  longitude: number;
  description?: string;
  projectCode: string;
  trelloCardName?: string;
  surveyId?: string;
  createdAt: Date;
  dateLabel: string;
  createdByEmail?: string;
  status?: string;
}

/**
 * Extrae el código de proyecto de una cadena (por ejemplo "(RSA063) Monitoreo" -> "RSA063")
 */
export function extractProjectCode(projectName?: string): string {
  if (!projectName) return 'GENERAL';
  const parensMatch = projectName.match(/\(([A-Za-z]{2,4}\d+)\)/);
  if (parensMatch) return parensMatch[1].toUpperCase();
  const codeMatch = projectName.match(/([A-Za-z]{2,4}\d{3,})/);
  if (codeMatch) return codeMatch[1].toUpperCase();
  return 'GENERAL';
}

/**
 * Hook para integrar las estaciones y reportes de campo de DEA Data Bus en CartoDEA.
 * Conecta con Firestore en tiempo real y provee las capas de monitoreo asociadas a cada proyecto.
 */
export function useDataBusMonitoring() {
  const defaultFirestore = useFirestore();
  const firestore = useMemo(() => getDatabusFirestore() || defaultFirestore, [defaultFirestore]);
  const [stations, setStations] = useState<Record<string, any>>({});
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Suscripción a estaciones en tiempo real
  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(collection(firestore, 'stations'), (snapshot) => {
      const stationMap: Record<string, any> = {};
      snapshot.docs.forEach((doc) => {
        stationMap[doc.id] = { id: doc.id, ...doc.data() };
      });
      setStations(stationMap);
    }, (err) => {
      console.warn('[useDataBusMonitoring] Error obteniendo stations:', err);
    });

    return () => unsub();
  }, [firestore]);

  // 2. Suscripción a reportes de monitoreo en tiempo real
  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(collection(firestore, 'reports'), (snapshot) => {
      const reportsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsList);
      setIsLoading(false);
    }, (err) => {
      console.warn('[useDataBusMonitoring] Error obteniendo reports:', err);
      setIsLoading(false);
    });

    return () => unsub();
  }, [firestore]);

  // 3. Conversión de reportes a capas descubiertas para el árbol de capas (LegendPanel)
  const monitoringDiscoveredLayers = useMemo<GeoServerDiscoveredLayer[]>(() => {
    return reports.map((report) => {
      const station = stations[report.stationId];
      const projectCode = extractProjectCode(report.trelloCardName || report.surveyId);

      const dateObj = report.createdAt?.toDate 
        ? report.createdAt.toDate() 
        : (report.createdAt ? new Date(report.createdAt) : new Date());

      const dateStr = dateObj.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const reportOid = report.oid || 'RM';
      const stationName = station?.name || 'Estación';

      // Nombre de la capa según requerimiento: Monitoreo (fecha)
      const layerTitle = `Monitoreo (${dateStr}) - ${stationName}`;

      const lat = station?.latitude || 0;
      const lon = station?.longitude || 0;

      return {
        name: `monitoring:${report.id}`,
        title: layerTitle,
        category: 'Monitoreo',
        projectCode: projectCode,
        isMonitoring: true,
        reportId: report.id,
        reportOid: reportOid,
        stationId: report.stationId,
        stationName: stationName,
        basinCode: station?.basinCode || '',
        latitude: lat,
        longitude: lon,
        description: station?.description || '',
        trelloCardName: report.trelloCardName,
        surveyId: report.surveyId,
        createdByEmail: report.createdByEmail,
        status: report.status,
        dateLabel: dateStr,
        createdAt: dateObj,
        wmsAddedToMap: false,
        wfsAddedToMap: false,
        geometryType: 'Point',
      };
    }).filter(l => l.latitude !== 0 && l.longitude !== 0);
  }, [reports, stations]);

  // 4. Creador de capa vectorial OpenLayers para una estación de monitoreo
  const createMonitoringVectorLayer = useCallback((layerInfo: GeoServerDiscoveredLayer): MapLayer => {
    const lat = layerInfo.latitude || 0;
    const lon = layerInfo.longitude || 0;

    const feature = new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
      id: `station-${layerInfo.stationId}`,
      isMonitoringStation: true,
      stationId: layerInfo.stationId,
      stationName: layerInfo.stationName,
      reportId: layerInfo.reportId,
      reportOid: layerInfo.reportOid,
      projectCode: layerInfo.projectCode,
      trelloCardName: layerInfo.trelloCardName,
      surveyId: layerInfo.surveyId,
      dateLabel: layerInfo.dateLabel,
      createdAt: layerInfo.createdAt,
      createdByEmail: layerInfo.createdByEmail,
      status: layerInfo.status,
      basinCode: layerInfo.basinCode,
      latitude: lat,
      longitude: lon,
    });

    const style = new Style({
      image: new CircleStyle({
        radius: 9,
        fill: new Fill({ color: '#327787' }), // Azul Petróleo Oficial DPH
        stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
      }),
      text: new TextStyle({
        text: layerInfo.stationName || 'EM',
        font: 'bold 11px sans-serif',
        offsetY: -16,
        fill: new Fill({ color: '#1a3a42' }),
        stroke: new Stroke({ color: '#ffffff', width: 3 }),
      }),
    });

    const source = new VectorSource({
      features: [feature],
    });

    const olLayer = new VectorLayer({
      source,
      style,
      properties: {
        id: `monitoring-${layerInfo.reportId}`,
        name: layerInfo.title,
        isMonitoringLayer: true,
        reportId: layerInfo.reportId,
        stationId: layerInfo.stationId,
      },
    });

    return {
      id: `monitoring-${layerInfo.reportId}`,
      name: layerInfo.title,
      olLayer,
      visible: true,
      opacity: 1,
      type: 'vector',
      isDeas: true,
      projectCode: layerInfo.projectCode,
      category: 'Monitoreo',
    };
  }, []);

  return {
    monitoringDiscoveredLayers,
    createMonitoringVectorLayer,
    isLoading,
  };
}
