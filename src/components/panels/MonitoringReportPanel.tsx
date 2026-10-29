"use client";

import React, { useState, useEffect, useMemo } from 'react';
import DraggablePanel from './DraggablePanel';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { MonitoringReportData } from '@/hooks/useDataBusMonitoring';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Activity, 
  MapPin, 
  Calendar, 
  User, 
  FolderKanban, 
  Droplets, 
  Camera, 
  Layers, 
  Download, 
  FileSpreadsheet,
  ExternalLink,
  Loader2,
  CheckCircle2,
  X,
  Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MonitoringReportPanelProps {
  panelRef: React.RefObject<HTMLDivElement>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClosePanel: () => void;
  onMouseDownHeader: (e: React.MouseEvent<HTMLDivElement>) => void;
  reportData: MonitoringReportData | null;
  style?: React.CSSProperties;
}

// Mapeo amigable de identificadores de planillas
const PLANILLA_NAMES: Record<string, { label: string; icon: any; color: string }> = {
  agua_superficial: { label: 'Agua Superficial (AS-001)', icon: Droplets, color: 'text-cyan-400' },
  agua_subterranea: { label: 'Freatímetros (FTA-001)', icon: Compass, color: 'text-blue-400' },
  calidad_aire: { label: 'Calidad de Aire (CA-001)', icon: Activity, color: 'text-amber-400' },
  suelo_edafologico: { label: 'Perfil Edafológico (PE-001)', icon: Layers, color: 'text-emerald-400' },
  suelo_geotecnia: { label: 'Mecánica de Suelos (MS-001)', icon: Layers, color: 'text-orange-400' },
  pgays_inspeccion: { label: 'Inspección (PGAyS-001)', icon: CheckCircle2, color: 'text-purple-400' },
  fotos: { label: 'Evidencia Visual', icon: Camera, color: 'text-rose-400' },
};

export default function MonitoringReportPanel({
  panelRef,
  isCollapsed,
  onToggleCollapse,
  onClosePanel,
  onMouseDownHeader,
  reportData,
  style,
}: MonitoringReportPanelProps) {
  const firestore = useFirestore();
  const [samples, setSamples] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePlanillaId, setActivePlanillaId] = useState<string>('');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);

  // Consulta en tiempo real de las muestras/planillas del reporte
  useEffect(() => {
    if (!firestore || !reportData?.reportId) {
      setSamples([]);
      return;
    }

    setIsLoading(true);
    const q = query(
      collection(firestore, 'samples'),
      where('reportId', '==', reportData.reportId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSamples(data);
      setIsLoading(false);
    }, (err) => {
      console.warn('[MonitoringReportPanel] Error cargando samples:', err);
      setIsLoading(false);
    });

    return () => unsub();
  }, [firestore, reportData?.reportId]);

  // Agrupamiento de muestras por Planilla
  const planillas = useMemo(() => {
    const groups: Record<string, { id: string; label: string; icon: any; color: string; items: any[]; photos: any[] }> = {};

    samples.forEach((sample) => {
      const isPhoto = sample.parameterType === 'Fotografía' || sample.value?.toString().startsWith('http');
      
      let pId = sample.formId || sample.medium || 'general';
      if (pId.startsWith('custom_')) pId = 'personalizada';

      if (!groups[pId]) {
        const meta = PLANILLA_NAMES[pId] || { 
          label: sample.medium ? sample.medium.replace(/_/g, ' ').toUpperCase() : `Planilla ${pId}`, 
          icon: Activity, 
          color: 'text-teal-400' 
        };
        groups[pId] = {
          id: pId,
          label: meta.label,
          icon: meta.icon,
          color: meta.color,
          items: [],
          photos: [],
        };
      }

      if (isPhoto) {
        groups[pId].photos.push(sample);
      } else {
        groups[pId].items.push(sample);
      }
    });

    return Object.values(groups);
  }, [samples]);

  // Seleccionar la primera planilla por defecto si cambia el reporte
  useEffect(() => {
    if (planillas.length > 0 && (!activePlanillaId || !planillas.some(p => p.id === activePlanillaId))) {
      setActivePlanillaId(planillas[0].id);
    }
  }, [planillas, activePlanillaId]);

  const currentPlanilla = useMemo(() => {
    return planillas.find(p => p.id === activePlanillaId) || planillas[0] || null;
  }, [planillas, activePlanillaId]);

  // Exportar planilla activa a CSV
  const handleExportCsv = () => {
    if (!currentPlanilla || currentPlanilla.items.length === 0) return;
    const headers = ['Estación', 'Reporte', 'Categoría', 'Analito', 'Valor', 'Unidad', 'Fecha'];
    const rows = currentPlanilla.items.map(s => [
      reportData?.stationName || '',
      reportData?.reportOid || '',
      s.parameterType || '',
      `"${s.analyte || ''}"`,
      `"${s.value || ''}"`,
      `"${s.unit || ''}"`,
      s.timestamp?.toDate ? s.timestamp.toDate().toLocaleString('es-AR') : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportData?.stationName}_${reportData?.reportOid}_${currentPlanilla.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!reportData) return null;

  return (
    <>
      <DraggablePanel
        panelRef={panelRef}
        title={`Reporte ${reportData.reportOid} - ${reportData.stationName}`}
        initialPosition={{ x: 100, y: 100 }}
        initialSize={{ width: 560, height: 600 }}
        minSize={{ width: 420, height: 350 }}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        onClose={onClosePanel}
        onMouseDownHeader={onMouseDownHeader}
        style={style}
        icon={Activity}
        headerActions={
          <div className="flex items-center gap-1.5 mr-2">
            <Badge variant="outline" className="text-[10px] h-5 bg-teal-500/10 text-teal-300 border-teal-500/40 uppercase">
              {reportData.basinCode ? `Cuenca ${reportData.basinCode}` : 'Campo'}
            </Badge>
          </div>
        }
      >
        <div className="flex flex-col h-full bg-neutral-900/95 text-white select-text">
          {/* Header Resumen Técnico */}
          <div className="p-3 bg-neutral-800/80 border-b border-neutral-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="h-3.5 w-3.5 text-teal-400" />
                <span className="font-semibold text-white">{reportData.stationName}</span>
                <span className="text-[11px] text-neutral-400">
                  ({reportData.latitude.toFixed(5)}, {reportData.longitude.toFixed(5)})
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>{reportData.dateLabel}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <FolderKanban className="h-3.5 w-3.5 text-blue-400" />
                <span className="truncate max-w-[280px]" title={reportData.trelloCardName}>
                  {reportData.trelloCardName || 'Sin proyecto asignado'}
                </span>
              </div>
              {reportData.createdByEmail && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[140px]">{reportData.createdByEmail.split('@')[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Selector de Planillas (Tabs/Pills) */}
          <div className="p-2 bg-neutral-850 border-b border-neutral-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Planillas Relevadas ({planillas.length})
              </span>
              {currentPlanilla && currentPlanilla.items.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleExportCsv}
                  className="h-6 px-2 text-[10px] text-neutral-300 hover:text-white hover:bg-neutral-700/60 flex items-center gap-1"
                  title="Exportar planilla activa a CSV"
                >
                  <Download className="h-3 w-3" /> Exportar CSV
                </Button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {isLoading ? (
                <div className="flex items-center gap-2 py-1 text-xs text-neutral-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando planillas...
                </div>
              ) : planillas.length === 0 ? (
                <span className="text-xs text-neutral-500 py-1">Sin datos de planillas registradas.</span>
              ) : (
                planillas.map((p) => {
                  const Icon = p.icon;
                  const isActive = p.id === activePlanillaId;
                  const count = p.items.length + p.photos.length;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActivePlanillaId(p.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all whitespace-nowrap",
                        isActive
                          ? "bg-teal-600/30 border-teal-500 text-teal-200 font-medium shadow-sm"
                          : "bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:bg-neutral-700/60 hover:text-neutral-200"
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5", p.color)} />
                      <span>{p.label}</span>
                      <span className="text-[10px] opacity-70 bg-black/30 px-1 rounded-full">{count}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Cuerpo: Parámetros y Fotos de la Planilla Activa */}
          <ScrollArea className="flex-1 p-3">
            {currentPlanilla ? (
              <div className="space-y-4">
                {/* Tabla de Analitos / Parámetros */}
                {currentPlanilla.items.length > 0 ? (
                  <div className="rounded-md border border-neutral-700/80 overflow-hidden bg-neutral-900/60">
                    <Table>
                      <TableHeader className="bg-neutral-800/90">
                        <TableRow className="border-neutral-700/80 hover:bg-transparent">
                          <TableHead className="text-[11px] text-neutral-300 h-8">Categoría</TableHead>
                          <TableHead className="text-[11px] text-neutral-300 h-8">Parámetro / Analito</TableHead>
                          <TableHead className="text-[11px] text-neutral-300 h-8 text-right">Valor</TableHead>
                          <TableHead className="text-[11px] text-neutral-300 h-8">Unidad</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPlanilla.items.map((item) => (
                          <TableRow key={item.id} className="border-neutral-800 hover:bg-neutral-800/50 text-xs">
                            <TableCell className="py-2 text-[11px] text-neutral-400 font-normal">
                              {item.parameterType || 'Campo'}
                            </TableCell>
                            <TableCell className="py-2 font-medium text-white">
                              {item.analyte || '---'}
                            </TableCell>
                            <TableCell className="py-2 text-right font-mono text-teal-300 font-semibold">
                              {item.value ?? '---'}
                            </TableCell>
                            <TableCell className="py-2 text-[11px] text-neutral-400">
                              {item.unit || ''}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-neutral-500">
                    No se registraron parámetros tabulares en esta sección.
                  </div>
                )}

                {/* Galería de Fotografías con Metadatos */}
                {currentPlanilla.photos.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                      <Camera className="h-3.5 w-3.5 text-rose-400" />
                      <span>Evidencia Fotográfica de Campo ({currentPlanilla.photos.length})</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {currentPlanilla.photos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => setSelectedPhotoUrl(photo.value)}
                          className="group relative aspect-video rounded-md overflow-hidden bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-teal-500 transition-all shadow-sm"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.value}
                            alt={photo.analyte || 'Foto de campo'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] text-white truncate">{photo.analyte || 'Evidencia'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-neutral-500 text-xs">
                <Activity className="h-8 w-8 mb-2 opacity-30" />
                <p>Seleccione un reporte para visualizar sus planillas.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DraggablePanel>

      {/* Modal Lightbox de Fotografía en Alta Resolución */}
      <Dialog open={!!selectedPhotoUrl} onOpenChange={(open) => !open && setSelectedPhotoUrl(null)}>
        <DialogContent className="max-w-3xl bg-neutral-950 border-neutral-800 text-white p-3">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-800">
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <Camera className="h-4 w-4 text-teal-400" /> Evidencia Fotográfica con Estampa EXIF
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video max-h-[70vh] flex items-center justify-center bg-black/50 rounded overflow-hidden">
            {selectedPhotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedPhotoUrl}
                alt="Evidencia fotográfica completa"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
