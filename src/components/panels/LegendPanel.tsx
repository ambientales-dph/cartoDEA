
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DraggablePanel from './DraggablePanel';
import LayerList from '@/components/layer-manager/LayerList';
import FileUploadControl from '@/components/layer-manager/FileUploadControl';
import FeatureInteractionToolbar from '@/components/feature-inspection/FeatureInteractionToolbar';
import { Separator } from '@/components/ui/separator';
import type { MapLayer, GeoServerDiscoveredLayer, LabelOptions, GraduatedSymbology, CategorizedSymbology, GeoTiffStyle, LayerGroup } from '@/lib/types';
import { ListTree, Trash2, Database, Search, X as ClearIcon, RefreshCw, Loader2, Undo2, Target, Group, Folder, FolderOpen, Check, Plus, Minus, Layers, Image as ImageIcon, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import type { StyleOptions } from '../layer-manager/StyleEditorDialog';
import type { InteractionToolId } from '@/lib/types';
import type Feature from 'ol/Feature';
import type { Geometry } from 'ol/geom';


interface LegendPanelProps {
  panelRef: React.RefObject<HTMLDivElement>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClosePanel: () => void;
  onMouseDownHeader: (e: React.MouseEvent<HTMLDivElement>) => void;

  layers: (MapLayer | LayerGroup)[];
  onToggleLayerVisibility: (layerId: string, groupId?: string) => void;
  onRemoveLayer: (layerId: string) => void;
  onRemoveLayers: (layerIds: string[]) => void;
  onZoomToLayerExtent: (layerId: string) => void;
  onShowLayerTable: (layerId: string) => void;
  onShowStatistics: (layerId: string) => void;
  onExtractByPolygon: (layerId: string, onSuccess?: () => void) => void;
  onExtractBySelection: () => void;
  onSelectByLayer: (targetLayerId: string, selectorLayerId: string) => void;
  onExportLayer: (layerId: string, format: 'geojson' | 'kml' | 'shp') => void;
  onExportWmsAsGeotiff: (layerId: string) => void;
  isDrawingSourceEmptyOrNotPolygon: boolean;
  isSelectionEmpty: boolean;
  onSetLayerOpacity: (layerId: string, opacity: number) => void; 
  onReorderLayers: (draggedIds: string[], targetId: string | null) => void;
  onRenameLayer: (layerId: string, newName: string) => void;
  onChangeLayerStyle: (layerId: string, styleOptions: StyleOptions) => void;
  onChangeLayerLabels: (layerId: string, labelOptions: LabelOptions) => void;
  onApplyGraduatedSymbology: (layerId: string, symbology: GraduatedSymbology) => void;
  onApplyCategorizedSymbology: (layerId: string, symbology: CategorizedSymbology) => void;
  onApplyGeoTiffStyle: (layerId: string, style: GeoTiffStyle) => void;
  onToggleWmsStyle: (layerId: string) => void;
  onGroupLayers: (layerIds: string[], groupName: string) => void;
  onToggleGroupVisibility: (groupId: string) => void;
  onToggleGroupExpanded: (groupId: string) => void;
  onSetGroupDisplayMode: (groupId: string, mode: 'single' | 'multiple') => void;
  onUngroup: (groupId: string) => void;
  onRenameGroup: (groupId: string, newName: string) => void;
  onToggleGroupPlayback: (groupId: string) => void;
  onSetGroupPlaySpeed: (groupId: string, speed: number) => void;

  onAddLayer: (layer: MapLayer) => void;

  activeTool: InteractionToolId | null;
  onSetActiveTool: (tool: InteractionToolId | null) => void;
  onClearSelection: () => void;

  // DEAS props
  discoveredDeasLayers: GeoServerDiscoveredLayer[];
  onAddDeasLayer: (layer: GeoServerDiscoveredLayer) => void;
  isFetchingDeasLayers: boolean;
  onReloadDeasLayers: () => void;
  onSyncProject?: (projectCode: string) => void;
  onPassiveCheckProject?: (projectCode: string) => void;
  syncingProjectCode?: string;
  initialActiveProject?: string;
  
  // Undo props
  canUndoRemove: boolean;
  onUndoRemove: () => void;
  
  // Selection props
  selectedFeaturesForSelection: Feature<Geometry>[];

  isSharedView: boolean;

  style?: React.CSSProperties;
}

import { deasOrgNames, projectFormalNames } from '@/lib/project-names';

// Type definitions for the hierarchical structure (Org -> Project -> Category -> Layers)
type DeasCategoryNode = { [categoryName: string]: GeoServerDiscoveredLayer[] };
type DeasProjectNode = { [projectName: string]: DeasCategoryNode };
type DeasOrgNode = { [orgName: string]: DeasProjectNode };


const LegendPanel: React.FC<LegendPanelProps> = ({
  panelRef, isCollapsed, onToggleCollapse, onClosePanel, onMouseDownHeader,
  layers, onToggleLayerVisibility, onRemoveLayer, onRemoveLayers, onZoomToLayerExtent, onShowLayerTable, onShowStatistics,
  onExtractByPolygon, onExtractBySelection, onSelectByLayer, onExportLayer, onExportWmsAsGeotiff, isDrawingSourceEmptyOrNotPolygon, isSelectionEmpty, onSetLayerOpacity, onReorderLayers, onRenameLayer,
  onChangeLayerStyle, onChangeLayerLabels, onApplyGraduatedSymbology, onApplyCategorizedSymbology, onApplyGeoTiffStyle, onToggleWmsStyle, onGroupLayers, onToggleGroupVisibility, onToggleGroupExpanded, onSetGroupDisplayMode, onUngroup, onRenameGroup, onToggleGroupPlayback, onSetGroupPlaySpeed,
  onAddLayer, 
  activeTool, onSetActiveTool, onClearSelection,
  discoveredDeasLayers = [], onAddDeasLayer, isFetchingDeasLayers, onReloadDeasLayers,
  onSyncProject, onPassiveCheckProject, syncingProjectCode, initialActiveProject,
  canUndoRemove, onUndoRemove,
  selectedFeaturesForSelection,
  isSharedView,
  style,
}) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [deasSearchTerm, setDeasSearchTerm] = useState('');
  
  const allLayersForSelection = useMemo(() => {
    return layers.flatMap(item => 'layers' in item ? item.layers : item);
  }, [layers]);


  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Auto-expandir el proyecto activo si viene seleccionado desde Portal DEA
  useEffect(() => {
    if (initialActiveProject && discoveredDeasLayers.length > 0) {
      const target = initialActiveProject.toUpperCase().trim();
      const matchingLayers = discoveredDeasLayers.filter(l => (l.projectCode || '').toUpperCase() === target);
      if (matchingLayers.length > 0) {
        setExpandedNodes(prev => {
          const next = { ...prev };
          matchingLayers.forEach(l => {
            const orgCode = l.projectCode?.match(/^([a-zA-Z]+)/)?.[1] || 'DEA';
            const projCode = l.projectCode || '';
            const cat = l.category || 'shp';
            next[orgCode] = true;
            next[`${orgCode}/${projCode}`] = true;
            next[`${orgCode}/${projCode}/${cat}`] = true;
          });
          return next;
        });
      }
    }
  }, [initialActiveProject, discoveredDeasLayers]);

  const isNodeExpanded = useCallback((pathKey: string) => {
    // Si hay un término de búsqueda activo, expandir automáticamente para revelar coincidencias
    if (deasSearchTerm.trim().length > 0) {
      return expandedNodes[pathKey] !== undefined ? expandedNodes[pathKey] : true;
    }
    // De inicio y por defecto: todo colapsado
    return expandedNodes[pathKey] !== undefined ? expandedNodes[pathKey] : false;
  }, [expandedNodes, deasSearchTerm]);

  const toggleNodeExpanded = useCallback((pathKey: string) => {
    setExpandedNodes(prev => {
      const isSearching = deasSearchTerm.trim().length > 0;
      const defaultState = isSearching ? true : false;
      const current = prev[pathKey] !== undefined ? prev[pathKey] : defaultState;
      return { ...prev, [pathKey]: !current };
    });
  }, [deasSearchTerm]);

  const isLayerAdded = useCallback((discoveredLayer: GeoServerDiscoveredLayer) => {
    const discName = (discoveredLayer.name || '').toLowerCase();
    const discTitle = (discoveredLayer.title || '').toLowerCase();
    const discClean = discName.includes(':') ? discName.split(':')[1] : discName;

    return layers.some(l => {
      if ('layers' in l) {
        return l.layers.some(subL => {
          const sName = (subL.layerName || '').toLowerCase();
          const sTitle = (subL.name || '').toLowerCase();
          return sName === discName || sName === discClean || sTitle === discTitle || sTitle === discClean;
        });
      }
      const lName = (l.layerName || '').toLowerCase();
      const lTitle = (l.name || '').toLowerCase();
      return lName === discName || lName === discClean || lTitle === discTitle || lTitle === discClean;
    });
  }, [layers]);

  const hierarchicalDeasLayers = useMemo(() => {
    // Normalizador insensible a acentos/diacríticos y mayúsculas
    const normalizeText = (str: string): string => {
      return (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    };

    const searchTokens = normalizeText(deasSearchTerm).split(/\s+/).filter(Boolean);
    
    // Verificación defensiva para discoveredDeasLayers
    const layersToFilter = discoveredDeasLayers || [];

    const filteredLayers = layersToFilter.filter(layer => {
        if (searchTokens.length === 0) return true;
        const [workspace = '', layerNameOnly = ''] = layer.name.split(':');
        const orgFullName = deasOrgNames[workspace.toUpperCase()] || '';
        const projectFormal = projectFormalNames[(layer.projectCode || '').toUpperCase()] || '';

        const searchableText = [
          layer.title,
          layer.name,
          layerNameOnly,
          workspace,
          orgFullName,
          layer.projectCode || '',
          projectFormal,
          layer.category || '',
        ].map(normalizeText).join(' ');

        // Todos los términos ingresados deben coincidir con algún campo
        return searchTokens.every(token => searchableText.includes(token));
    });

    return filteredLayers.reduce<DeasOrgNode>((orgs, layer) => {
        let projectCode = (layer.projectCode || '').toUpperCase();
        let orgCode = '';

        if (!projectCode) {
            const [workspace, layerNameOnly = ''] = layer.name.split(':');
            const match = (layerNameOnly || '').match(/^([a-zA-Z]+)(\d{3,})(_.*)?$/);
            if (match) {
                orgCode = match[1].toUpperCase();
                projectCode = `${orgCode}${match[2]}`;
            } else {
                orgCode = (workspace || 'OTROS').toUpperCase();
                projectCode = 'General';
            }
        } else {
            const match = projectCode.match(/^([a-zA-Z]+)/);
            orgCode = match ? match[1].toUpperCase() : 'OTROS';
        }

        const orgFullName = deasOrgNames[orgCode] || (orgCode ? `Cuenca ${orgCode}` : 'Otras Cuencas');
        const categoryName = (layer.category || 'shp').toUpperCase();

        if (!orgs[orgFullName]) orgs[orgFullName] = {};
        if (!orgs[orgFullName][projectCode]) orgs[orgFullName][projectCode] = {};
        if (!orgs[orgFullName][projectCode][categoryName]) orgs[orgFullName][projectCode][categoryName] = [];
        
        orgs[orgFullName][projectCode][categoryName].push(layer);
        
        return orgs;
    }, {});
  }, [discoveredDeasLayers, deasSearchTerm]);


  const handleItemClick = (clickedId: string, itemType: 'layer' | 'group', event: React.MouseEvent<HTMLLIElement>) => {
    const clickedIndex = layers.findIndex(l => l.id === clickedId);
    
    if (event.ctrlKey || event.metaKey) {
      setSelectedItemIds(prev =>
        prev.includes(clickedId)
          ? prev.filter(id => id !== clickedId)
          : [...prev, clickedId]
      );
    } else if (event.shiftKey && lastClickedIndex !== null) {
      const start = Math.min(lastClickedIndex, clickedIndex);
      const end = Math.max(lastClickedIndex, clickedIndex);
      const rangeIds = layers.slice(start, end + 1).map(l => l.id);
      setSelectedItemIds(rangeIds);
    } else {
      setSelectedItemIds([clickedId]);
    }
    setLastClickedIndex(clickedIndex);
  };
  
  const handleDeleteSelected = () => {
    if (selectedItemIds.length > 0) {
      onRemoveLayers(selectedItemIds);
      setSelectedItemIds([]);
      setLastClickedIndex(null);
    }
  };

  const handleGroupSelected = () => {
    const layerIdsToGroup = selectedItemIds.filter(id => layers.find(l => l.id === id && !('layers' in l)));
    if (layerIdsToGroup.length > 1) {
        onGroupLayers(layerIdsToGroup, "Nuevo Grupo");
        setSelectedItemIds([]);
        setLastClickedIndex(null);
    }
  };


  const handleClearSelection = () => {
    setSelectedItemIds([]);
    setLastClickedIndex(null);
    onClearSelection();
  };

  const handleToggleEditing = (tool: InteractionToolId) => {
    onSetActiveTool(activeTool === tool ? null : tool);
  };


  return (
    <DraggablePanel
      title="Capas"
      icon={ListTree} 
      panelRef={panelRef}
      initialPosition={{ x: 0, y: 0 }} 
      onMouseDownHeader={onMouseDownHeader}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      onClose={onClosePanel}
      showCloseButton={true}
      style={style} 
      zIndex={style?.zIndex as number | undefined}
      initialSize={{ width: 420, height: "80vh" }}
      minSize={{ width: 320, height: 300 }}
    >
      <div className="flex flex-col h-full">
        {!isSharedView && (
          <div className="flex-shrink-0 space-y-2 mb-2"> 
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-md"> 
              <FileUploadControl onAddLayer={onAddLayer} uniqueIdPrefix="legendpanel-upload" />
              <TooltipProvider delayDuration={300}>
                   <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-black/20 hover:bg-white/10 border border-white/30 text-white/90 disabled:opacity-50"
                            onClick={handleGroupSelected}
                            disabled={selectedItemIds.filter(id => !layers.find(l => l.id === id && 'layers' in l)).length < 2}
                          >
                            <Group className="h-4 w-4" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                       <TooltipContent side="bottom" className="bg-gray-700 text-white border-gray-600">
                        <p className="text-xs">Agrupar Seleccionadas</p>
                      </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-black/20 hover:bg-white/10 border border-white/30 text-white/90 disabled:opacity-50"
                            onClick={onUndoRemove}
                            disabled={!canUndoRemove}
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-gray-700 text-white border-gray-600">
                        <p className="text-xs">Deshacer Eliminación</p>
                      </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-red-700/30 hover:bg-red-600/50 border border-red-500/50 text-white/90 disabled:opacity-50"
                          onClick={handleDeleteSelected}
                          disabled={selectedItemIds.length === 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-gray-700 text-white border-gray-600">
                      <p className="text-xs">Eliminar seleccionadas</p>
                    </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
              <FeatureInteractionToolbar
                activeTool={activeTool}
                onSetActiveTool={onSetActiveTool}
                onClearSelection={handleClearSelection}
              />
            </div>
          </div>
        )}

        <div className="flex-grow flex flex-col min-h-0">
            <div className={`flex-grow flex flex-col ${isSharedView ? 'basis-full' : 'basis-2/3'}`}>
                <ScrollArea className="flex-grow">
                    <div className="pr-3">
                        <LayerList
                            layers={layers}
                            onToggleVisibility={onToggleLayerVisibility}
                            onZoomToExtent={onZoomToLayerExtent}
                            onShowLayerTable={onShowLayerTable}
                            onShowStatistics={onShowStatistics}
                            onRemoveLayer={onRemoveLayer}
                            onRemoveLayers={onRemoveLayers}
                            onExtractByPolygon={onExtractByPolygon}
                            onExtractBySelection={onExtractBySelection}
                            onSelectByLayer={onSelectByLayer}
                            onExportLayer={onExportLayer}
                            onExportWmsAsGeotiff={onExportWmsAsGeotiff}
                            onRenameLayer={onRenameLayer}
                            onChangeLayerStyle={onChangeLayerStyle}
                            onChangeLayerLabels={onChangeLayerLabels}
                            onApplyGraduatedSymbology={onApplyGraduatedSymbology}
                            onApplyCategorizedSymbology={onApplyCategorizedSymbology}
                            onApplyGeoTiffStyle={onApplyGeoTiffStyle}
                            onToggleWmsStyle={onToggleWmsStyle}
                            isDrawingSourceEmptyOrNotPolygon={isDrawingSourceEmptyOrNotPolygon}
                            isSelectionEmpty={isSelectionEmpty}
                            onSetLayerOpacity={onSetLayerOpacity}
                            onReorderLayers={onReorderLayers}
                            selectedItemIds={selectedItemIds}
                            onItemClick={handleItemClick}
                            activeTool={activeTool}
                            onToggleEditing={handleToggleEditing}
                            isSharedView={isSharedView}
                            onToggleGroupVisibility={onToggleGroupVisibility}
                            onToggleGroupExpanded={onToggleGroupExpanded}
                            onSetGroupDisplayMode={onSetGroupDisplayMode}
                            onUngroup={onUngroup}
                            onRenameGroup={onRenameGroup}
                            onToggleGroupPlayback={onToggleGroupPlayback}
                            onSetGroupPlaySpeed={onSetGroupPlaySpeed}
                            allLayersForSelection={allLayersForSelection}
                            selectedFeaturesForSelection={selectedFeaturesForSelection}
                        />
                    </div>
                </ScrollArea>
            </div>
            
            {!isSharedView && (
              <div className="flex flex-col pt-2 basis-1/3">
                  <Separator className="bg-white/10 mb-2" />
                  <div className="flex items-center justify-between px-2 pb-2 flex-shrink-0">
                    <h3 className="text-sm font-semibold text-white">Capas Predefinidas (DEAS)</h3>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
                                  onClick={onReloadDeasLayers}
                                  disabled={isFetchingDeasLayers}
                              >
                                  {isFetchingDeasLayers ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                      <RefreshCw className="h-3.5 w-3.5" />
                                  )}
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-700 text-white border-gray-600">
                             <p className="text-xs">Recargar capas</p>
                          </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                   <div className="relative mb-2 px-2">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                          placeholder="Buscar capa, proyecto u org..."
                          value={deasSearchTerm}
                          onChange={(e) => setDeasSearchTerm(e.target.value)}
                          className="text-xs h-8 border-white/30 bg-black/20 text-white/90 focus:ring-primary pl-8 pr-8"
                      />
                      {deasSearchTerm && (
                          <button
                              onClick={() => setDeasSearchTerm('')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400/80 hover:text-white"
                          >
                              <ClearIcon className="h-3.5 w-3.5" />
                          </button>
                      )}
                  </div>
                  <ScrollArea className="flex-grow min-h-0 border-t border-gray-700/50">
                  <div className="pr-2 space-y-1 py-1">
                    {Object.keys(hierarchicalDeasLayers).length > 0 ? (
                      Object.entries(hierarchicalDeasLayers).sort(([orgA], [orgB]) => orgA.localeCompare(orgB)).map(([orgName, projects]) => {
                        const isOrgOpen = isNodeExpanded(orgName);

                        return (
                          <div key={orgName} className="select-none">
                            {/* Nivel 1: Cuenca */}
                            <div 
                              className="flex items-center gap-1.5 p-1.5 rounded hover:bg-white/5 cursor-pointer text-white/90 group"
                              onClick={() => toggleNodeExpanded(orgName)}
                            >
                              <button
                                type="button"
                                className="h-4 w-4 shrink-0 flex items-center justify-center rounded-[3px] border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNodeExpanded(orgName);
                                }}
                                title={isOrgOpen ? "Colapsar cuenca" : "Expandir cuenca"}
                              >
                                {isOrgOpen ? <Minus className="h-2.5 w-2.5 stroke-[2.5]" /> : <Plus className="h-2.5 w-2.5 stroke-[2.5]" />}
                              </button>
                              <span className="text-[10px] font-semibold truncate group-hover:text-white">
                                {orgName}
                              </span>
                            </div>

                            {/* Nivel 2: Proyectos */}
                            {isOrgOpen && (
                              <div className="ml-3 pl-2.5 border-l border-slate-700/60 space-y-1 mt-0.5">
                                {Object.entries(projects).sort(([projA], [projB]) => projA.localeCompare(projB)).map(([projectName, categories]) => {
                                  const projKey = `${orgName}/${projectName}`;
                                  const isProjOpen = isNodeExpanded(projKey);
                                  const formalName = projectFormalNames[projectName.toUpperCase()];

                                  return (
                                    <div key={projectName}>
                                      <div 
                                        className="flex items-center gap-1.5 py-1 px-1 rounded hover:bg-white/5 cursor-pointer text-slate-200 group w-full min-w-0 overflow-hidden"
                                        onClick={() => {
                                          const willOpen = !isProjOpen;
                                          toggleNodeExpanded(projKey);
                                          if (willOpen && onPassiveCheckProject) {
                                            onPassiveCheckProject(projectName);
                                          }
                                        }}
                                      >
                                        <button
                                          type="button"
                                          className="h-4 w-4 shrink-0 flex items-center justify-center rounded-[3px] border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const willOpen = !isProjOpen;
                                            toggleNodeExpanded(projKey);
                                            if (willOpen && onPassiveCheckProject) {
                                              onPassiveCheckProject(projectName);
                                            }
                                          }}
                                          title={isProjOpen ? "Colapsar proyecto" : "Expandir proyecto"}
                                        >
                                          {isProjOpen ? <Minus className="h-2.5 w-2.5 stroke-[2.5]" /> : <Plus className="h-2.5 w-2.5 stroke-[2.5]" />}
                                        </button>

                                        {/* Botón manual de sincronización activa circular (SIEMPRE VISIBLE junto al botón expandir) */}
                                        {onSyncProject && (
                                          <button
                                            type="button"
                                            className={cn(
                                              "h-4 w-4 shrink-0 flex items-center justify-center rounded p-0 text-white/40 hover:text-sky-300 hover:bg-white/10 transition-colors",
                                              syncingProjectCode === projectName && "text-sky-400"
                                            )}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onSyncProject(projectName);
                                            }}
                                            title={`Sincronizar ${projectName} con Drive ahora`}
                                          >
                                            <RefreshCw
                                              className={cn(
                                                "h-2.5 w-2.5",
                                                syncingProjectCode === projectName && "animate-spin text-sky-400"
                                              )}
                                            />
                                          </button>
                                        )}

                                        <TooltipProvider delayDuration={150}>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span 
                                                className="min-w-0 flex-1 truncate text-[10px] font-medium group-hover:text-white underline decoration-dotted decoration-slate-500/60 underline-offset-2 block"
                                              >
                                                <span className="font-semibold text-slate-100">{projectName}</span>
                                                {formalName ? (
                                                  <span className="text-slate-300 font-normal"> - {formalName}</span>
                                                ) : null}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent 
                                              side="right" 
                                              align="center" 
                                              className="bg-slate-900/95 backdrop-blur border border-slate-700 text-white max-w-xs shadow-xl p-2 z-[9999]"
                                            >
                                              <p className="text-[10px] font-semibold text-sky-400">{projectName}</p>
                                              <p className="text-[10px] text-slate-200 mt-0.5 leading-snug">{formalName || projectName}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>

                                      {/* Nivel 3: Subcarpetas de GIS (justificadas a la izquierda) */}
                                      {isProjOpen && (
                                        <div className="ml-3 pl-2.5 border-l border-slate-700/60 space-y-1 mt-0.5">
                                          {Object.entries(categories).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([categoryName, projectLayers]) => {
                                            const catKey = `${orgName}/${projectName}/${categoryName}`;
                                            const isCatOpen = isNodeExpanded(catKey);

                                            return (
                                              <div key={categoryName}>
                                                <div 
                                                  className="flex items-center gap-1.5 py-1 px-1 rounded hover:bg-white/5 cursor-pointer text-amber-300/90 group min-w-0"
                                                  onClick={() => toggleNodeExpanded(catKey)}
                                                >
                                                  <button
                                                    type="button"
                                                    className="h-4 w-4 shrink-0 flex items-center justify-center rounded-[3px] border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleNodeExpanded(catKey);
                                                    }}
                                                    title={isCatOpen ? "Colapsar carpeta" : "Expandir carpeta"}
                                                  >
                                                    {isCatOpen ? <Minus className="h-2.5 w-2.5 stroke-[2.5]" /> : <Plus className="h-2.5 w-2.5 stroke-[2.5]" />}
                                                  </button>
                                                  {isCatOpen ? (
                                                    <FolderOpen className="h-3 w-3 text-amber-400 shrink-0" />
                                                  ) : (
                                                    <Folder className="h-3 w-3 text-amber-400 shrink-0" />
                                                  )}
                                                  <span className="text-[9px] font-medium truncate group-hover:text-amber-200">
                                                    {categoryName.toUpperCase()}
                                                  </span>
                                                </div>

                                                {/* Nivel 4: Capas individuales dentro de la subcarpeta */}
                                                {isCatOpen && (
                                                  <div className="ml-3 pl-2.5 border-l border-slate-700/40 space-y-1 mt-0.5">
                                                    {projectLayers.sort((a,b) => a.title.localeCompare(b.title)).map(layer => {
                                                      const isRaster = Boolean(layer.isDownloadOnly || layer.category === 'img' || layer.category === 'dem');
                                                      const added = isLayerAdded(layer);
                                                      const sizeMB = layer.sizeBytes ? (layer.sizeBytes / (1024 * 1024)).toFixed(1) : null;
                                                      const sizeLabel = sizeMB ? ` (${sizeMB} MB)` : '';

                                                      const handleLayerClick = () => {
                                                        if (isRaster && layer.downloadUrl) {
                                                          window.open(layer.downloadUrl, '_blank');
                                                        }
                                                        if (!added) onAddDeasLayer(layer);
                                                      };

                                                      return (
                                                        <div 
                                                          key={layer.name} 
                                                          className={cn(
                                                            "flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/5 group cursor-pointer min-w-0",
                                                            isRaster && "hover:bg-amber-500/10"
                                                          )}
                                                          onClick={handleLayerClick}
                                                          title={
                                                            isRaster
                                                              ? `Ráster: ${layer.title}${sizeLabel}\n• Clic para descargar archivo desde Google Drive\n• Añade el área de cobertura al mapa`
                                                              : added
                                                                ? "Capa agregada (quitar desde la lista de capas)"
                                                                : "Cargar capa en el mapa"
                                                          }
                                                        >
                                                          <button 
                                                            type="button" 
                                                            className={cn(
                                                              "p-0.5 rounded transition-colors flex-shrink-0 flex items-center justify-center bg-transparent border-0",
                                                              added
                                                                ? "text-emerald-400 cursor-default"
                                                                : isRaster
                                                                  ? "text-amber-400 group-hover:text-amber-300"
                                                                  : "text-sky-400 group-hover:text-sky-300"
                                                            )}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleLayerClick();
                                                            }}
                                                            disabled={added && !isRaster}
                                                          >
                                                            {added ? (
                                                              <Check className="h-3 w-3 stroke-[2.5]" />
                                                            ) : isRaster ? (
                                                              <ImageIcon className="h-3 w-3" />
                                                            ) : (
                                                              <Layers className="h-3 w-3" />
                                                            )}
                                                          </button>
                                                          <span
                                                            className={cn(
                                                              "text-[10px] font-normal flex-1 truncate transition-colors",
                                                              added
                                                                ? "text-emerald-300 font-medium"
                                                                : isRaster
                                                                  ? "text-amber-200/90 group-hover:text-amber-100"
                                                                  : "text-white/80 group-hover:text-white"
                                                            )}
                                                          >
                                                            {layer.title}
                                                          </span>
                                                          {isRaster && sizeMB && (
                                                            <span className="text-[8px] font-mono text-amber-300/80 bg-amber-400/10 px-1 py-0.2 rounded shrink-0">
                                                              {sizeMB} MB
                                                            </span>
                                                          )}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="p-4 text-center text-[10px] text-gray-400">
                        {isFetchingDeasLayers ? "Cargando capas..." : "No se encontraron resultados."}
                      </p>
                    )}
                  </div>
                  </ScrollArea>
              </div>
            )}
        </div>
      </div>
    </DraggablePanel>
  );
};

export default LegendPanel;
