"use client";

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Palette, Check, Sparkles, Filter } from 'lucide-react';
import { DEA_SLD_STYLES, SldStyleItem, findMatchingSldStyle } from '@/lib/sld-styles';
import { cn } from '@/lib/utils';

interface SldStylePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  layerName: string;
  layerTitle?: string;
  projectCode?: string;
  currentStyleId?: string;
  currentGeomType?: string;
  onApplyStyle: (styleItem: SldStyleItem, persist: boolean) => void;
}

export const SldStylePickerDialog: React.FC<SldStylePickerDialogProps> = ({
  isOpen,
  onClose,
  layerName,
  layerTitle,
  projectCode,
  currentStyleId,
  currentGeomType,
  onApplyStyle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [geomFilter, setGeomFilter] = useState<'all' | 'Polygon' | 'LineString' | 'Point'>('all');
  const [selectedStyleId, setSelectedStyleId] = useState<string>(currentStyleId || '');

  // Sugerencia automática según nombre de la capa
  const suggestedStyle = useMemo(() => {
    return findMatchingSldStyle(layerName, layerTitle, currentGeomType);
  }, [layerName, layerTitle, currentGeomType]);

  // Si no hay seleccionado, pre-seleccionar la sugerencia o el actual
  React.useEffect(() => {
    if (isOpen) {
      if (currentStyleId) {
        setSelectedStyleId(currentStyleId);
      } else if (suggestedStyle) {
        setSelectedStyleId(suggestedStyle.id);
      }
    }
  }, [isOpen, currentStyleId, suggestedStyle]);

  const filteredStyles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return DEA_SLD_STYLES.filter((item) => {
      if (geomFilter !== 'all' && item.geomType !== geomFilter) {
        return false;
      }
      if (!term) return true;
      return (
        item.title.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term) ||
        item.geomType.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, geomFilter]);

  const selectedItem = useMemo(() => {
    return DEA_SLD_STYLES.find((s) => s.id === selectedStyleId) || null;
  }, [selectedStyleId]);

  const handleApply = (persist: boolean) => {
    if (selectedItem) {
      onApplyStyle(selectedItem, persist);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="p-4 pb-2 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-sky-400" />
            <DialogTitle className="text-base font-semibold text-white">
              Catálogo de Estilos DEA (.sld)
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-400">
            Asignar estilo a la capa <span className="font-semibold text-sky-300">"{layerTitle || layerName}"</span>
            {projectCode ? ` (Proyecto ${projectCode})` : ''}
          </DialogDescription>
        </DialogHeader>

        {/* Barra de búsqueda y filtros */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/80 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar estilo por nombre (ej. cursos, conductos, cuencas, barrios)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-9 pr-3 text-xs bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3 w-3 text-slate-400" />
              <span className="text-[11px] text-slate-400">Geometría:</span>
              <button
                type="button"
                onClick={() => setGeomFilter('all')}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] transition-colors',
                  geomFilter === 'all'
                    ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Todos ({DEA_SLD_STYLES.length})
              </button>
              <button
                type="button"
                onClick={() => setGeomFilter('Polygon')}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] transition-colors',
                  geomFilter === 'Polygon'
                    ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Polígonos
              </button>
              <button
                type="button"
                onClick={() => setGeomFilter('LineString')}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] transition-colors',
                  geomFilter === 'LineString'
                    ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Líneas
              </button>
              <button
                type="button"
                onClick={() => setGeomFilter('Point')}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] transition-colors',
                  geomFilter === 'Point'
                    ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Puntos
              </button>
            </div>

            {suggestedStyle && (
              <button
                type="button"
                onClick={() => setSelectedStyleId(suggestedStyle.id)}
                className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 underline underline-offset-2"
                title={`Sugerido automáticamente: ${suggestedStyle.title}`}
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
                Sugerencia ({suggestedStyle.title})
              </button>
            )}
          </div>
        </div>

        {/* Lista de estilos */}
        <div className="flex-1 min-h-[280px] p-2 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 gap-1.5 p-1">
              {filteredStyles.map((item) => {
                const isSelected = item.id === selectedStyleId;
                const isSuggested = suggestedStyle?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedStyleId(item.id)}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-md border text-left cursor-pointer transition-all',
                      isSelected
                        ? 'bg-sky-950/60 border-sky-500 shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600',
                      isSuggested && !isSelected && 'border-amber-500/40 bg-amber-950/20'
                    )}
                  >
                    {/* Visual Preview Swatch */}
                    <div className="h-8 w-8 rounded shrink-0 flex items-center justify-center border border-white/20 bg-slate-950/80 overflow-hidden relative">
                      {item.geomType === 'Polygon' ? (
                        <div
                          className="h-5 w-5 rounded-[2px]"
                          style={{
                            backgroundColor: item.fillColor || 'transparent',
                            borderWidth: `${Math.min(item.strokeWidth, 3)}px`,
                            borderColor: item.strokeColor || '#000',
                            borderStyle: item.lineStyle || 'solid',
                          }}
                        />
                      ) : item.geomType === 'LineString' ? (
                        <div
                          className="w-6 h-0.5"
                          style={{
                            backgroundColor: item.strokeColor || '#3388ff',
                            borderTop: `${Math.min(item.strokeWidth, 3)}px ${item.lineStyle || 'solid'} ${item.strokeColor || '#3388ff'}`,
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-full"
                          style={{
                            width: `${Math.min(item.pointSize + 4, 16)}px`,
                            height: `${Math.min(item.pointSize + 4, 16)}px`,
                            backgroundColor: item.fillColor || item.strokeColor || '#3388ff',
                            border: `1.5px solid ${item.strokeColor || '#000'}`,
                          }}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-slate-100 truncate block">
                          {item.title}
                        </span>
                        {isSuggested && (
                          <Badge variant="outline" className="text-[9px] py-0 px-1 border-amber-400 text-amber-300">
                            Auto
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span className="uppercase text-[9px] font-semibold text-slate-500">
                          {item.geomType === 'Polygon' ? 'Polígono' : item.geomType === 'LineString' ? 'Línea' : 'Punto'}
                        </span>
                        {item.rulesCount > 1 && (
                          <span className="text-amber-400 text-[9px]">({item.rulesCount} reglas)</span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-sky-400 shrink-0 ml-1" />
                    )}
                  </div>
                );
              })}
            </div>
            {filteredStyles.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No se encontraron estilos para "{searchTerm}".
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Vista previa y acciones */}
        <DialogFooter className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between sm:justify-between gap-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {selectedItem ? (
              <span>
                Seleccionado: <strong className="text-sky-300">{selectedItem.title}</strong>
              </span>
            ) : (
              <span>Seleccione un estilo del catálogo</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-8 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!selectedItem}
              onClick={() => handleApply(false)}
              className="text-xs h-8 bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              Aplicar en vista actual
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={!selectedItem}
              onClick={() => handleApply(true)}
              className="text-xs h-8 bg-sky-600 hover:bg-sky-500 text-white font-medium shadow"
            >
              Guardar como predeterminado
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SldStylePickerDialog;

