"use client";

import React, { useEffect, useState } from 'react';
import type { SyncProgressState } from '@/lib/types';
import { RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncProgressHUDProps {
  progress: SyncProgressState;
  onDismiss?: () => void;
}

export const SyncProgressHUD: React.FC<SyncProgressHUDProps> = ({ progress, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (progress.active) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [progress.active]);

  if (!visible && !progress.active) return null;

  const isCompleted = progress.status === 'completed';
  const isError = progress.status === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "absolute bottom-6 left-1/2 -translate-x-1/2 z-[1200]",
        "w-[90%] max-w-[420px] rounded-2xl p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out",
        "border",
        isCompleted
          ? "bg-slate-900/95 border-emerald-500/50 shadow-emerald-950/40"
          : isError
          ? "bg-slate-900/95 border-rose-500/50 shadow-rose-950/40"
          : "bg-slate-900/95 border-sky-500/40 shadow-sky-950/40",
        progress.active
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-3 scale-95 pointer-events-none"
      )}
    >
      {/* Header del HUD */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
              isCompleted
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : isError
                ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                : "bg-sky-500/15 border-sky-500/30 text-sky-400"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : isError ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <RefreshCw className="h-4 w-4 animate-spin" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-wide text-white">
                {isCompleted
                  ? "Sincronización finalizada"
                  : isError
                  ? "Error de sincronización"
                  : `Sincronizando ${progress.projectCode || 'Proyecto'}`}
              </span>
              {progress.projectCode && !isCompleted && !isError && (
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Drive
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">
              {progress.message || (isCompleted ? "Capas actualizadas en el mapa" : "Procesando capas...")}
            </p>
          </div>
        </div>

        {/* Porcentaje y botón de cerrar */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "text-xs font-mono font-bold px-2 py-0.5 rounded-md border",
              isCompleted
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : isError
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-sky-500/20 text-sky-300 border-sky-500/40"
            )}
          >
            {progress.percent}%
          </span>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              title="Cerrar notificación"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="mt-2.5 w-full bg-slate-800/90 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            isCompleted
              ? "bg-emerald-400"
              : isError
              ? "bg-rose-400"
              : "bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500"
          )}
          style={{ width: `${Math.min(Math.max(progress.percent, 0), 100)}%` }}
        />
      </div>

      {/* Subtexto descriptivo de capa actual */}
      {progress.total > 0 && !isCompleted && !isError && (
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-0.5 font-mono">
          <span className="truncate max-w-[240px]">
            {progress.layerName ? `Capa: ${progress.layerName}` : 'Preparando geometrías...'}
          </span>
          <span>
            {progress.current} / {progress.total}
          </span>
        </div>
      )}
    </div>
  );
};

export default SyncProgressHUD;
