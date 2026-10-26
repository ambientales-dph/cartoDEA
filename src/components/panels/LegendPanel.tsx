
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DraggablePanel from './DraggablePanel';
import LayerList from '@/components/layer-manager/LayerList';
import FileUploadControl from '@/components/layer-manager/FileUploadControl';
import FeatureInteractionToolbar from '@/components/feature-inspection/FeatureInteractionToolbar';
import { Separator } from '@/components/ui/separator';
import type { MapLayer, GeoServerDiscoveredLayer, LabelOptions, GraduatedSymbology, CategorizedSymbology, GeoTiffStyle, LayerGroup } from '@/lib/types';
import { ListTree, Trash2, Database, Search, X as ClearIcon, RefreshCw, Loader2, Undo2, Target, Group, Folder, FolderOpen, Check, Plus, Minus, Layers } from 'lucide-react'; 
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

const deasOrgNames: { [key: string]: string } = {
  'ALH': 'Cuenca A° Las Hermanas',
  'ARR': 'Cuenca Rios Arrecifes y Baradero',
  'CHAS': 'Cuenca Arroyo Chasicó',
  'CM': 'Canales de Marea',
  'CRZ': 'Cuenca Arroyo de la Cruz',
  'CUE': 'Cuenca del A° de los Cueros',
  'DIO': 'Zona de Drenaje Indefinido Occidental Peripampeano',
  'DLP': 'Delta del Paraná',
  'ESP': 'Cuenca Arroyo Espinillo',
  'MAR': 'Cuenca Matanza-Riachuelo',
  'MCH': 'Cuenca Mar Chiquita',
  'MED': 'Cca Arroyo del Medio',
  'MVM': 'Cuenca Medrano-Vega-Maldonado',
  'PAR': 'Cuenca Causes Menores Vertiente Paraná',
  'QQG': 'Cuenca Quequén Grande',
  'QQS': 'Cuenca Quequén Salado',
  'RAM': 'Cuenca Ramallo',
  'RAR': 'Cuenca Río Areco',
  'RCO': 'Cuenca Rio Colorado',
  'RLU': 'Cuenca Río Lujan',
  'RNG': 'Cuenca del Rio Negro',
  'RPI': 'Vertiente Rio de la Plata Inferior',
  'RPM': 'Vertiente Rio de la Plata Intermedia',
  'RPS': 'Vertiente Rio de la Plata Superior',
  'RRQ': 'Cuenca Rio Reconquista',
  'RSA': 'Cuenca Río Salado',
  'RSAL': 'Cuenca Arroyo Saladillo',
  'RSB': 'Cuenca Samborombon',
  'SCH': 'Cuenca Río Sauce Chico',
  'SEC': 'Cuenca Arroyo Seco',
  'SN': 'Cuenca Sin Nombre',
  'VAE': 'Vertiente Atlantica Este',
  'VAS': 'Vertiente Atlantica Sur',
  'VASE': 'Vertiente Atlántica SE',
};

const projectFormalNames: { [key: string]: string } = {
  // Proyectos Estandarizados Activos
  'MAR013': 'Prueba CC',
  'RSA003': 'Salado Tramo IV - Etapa IV (Archivo)',
  'RSA013': 'General Villegas (descarga Laguna del Parque)',
  'RSA014': 'Desagües Pluviales Barrio 17 de Octubre y Sector Suroeste - Alberti',
  'RSA016': 'Canales Cuartel IV al A° Las Garzas - Navarro',
  'RSA024': 'Salado Tramo V',
  'RSA026': 'Desagües Pluviales General La Madrid Cuenca C',
  'RSA036': 'Ampliación Capacidad Río Salado Superior - Tramo IV, Etapas 3 y 4',
  'RSA040': 'Desagües pluviales sector norte Bolívar',
  'RSA041': 'Desagües pluviales Mechita (Alberti)',
  'RSA042': 'Desagües pluviales Sector Sur (Chacabuco)',
  'RSA050': 'Salado Tramo 4 - Etapa 2',
  'RSA057': 'Desagües pluviales en Gral. Las Heras',
  'RSA059': 'Limpieza canal Acceso a Zapiola - RN 205',
  'RSA060': 'Restitución del terraplén de defensa de la localidad de Carhué-Adolfo Alsina',
  'RSA061': 'Saneamiento hidráulico Bonifacio, Casbas y Garré - Guaminí',
  'RSA062': 'Coronel Suárez (nombre a definir)',
  'RSA063': 'Saneamiento Loteo Chacra 196 - Gral. La Madrid',
  'RSA069': 'Entubamiento Canal Llambías - Trenque Lauquen',

  // Proyectos Relevados en Drive (Cuencas EIAS Ambientales)
  'CM004': 'qwwq',
  'MAR011': 'Prueba Gestión proyectos',
  'MAR012': 'Prueba Z',
  'RAR001': 'Adecuación Río Areco',
  'RAR005': 'Prueba BBB',
  'RLU004': 'Adecuación del cauce del Tramo Medio Río Luján - Etapa II (Luján y Olivera)',
  'RLU006': 'Puente en Calle Cogna',
  'RLU007': 'Puentes sobre el rio Lujan - Lote 2',
  'RLU010': 'Entubamiento A° Cuzco (Malvinas Argentinas)',
  'RLU011': 'Desagües Pluviales - Etapa I (Malvinas Argentinas)',
  'RLU015': 'Desagües Pluviales en la Localidad de Derqui',
  'RLU016': 'Adecuación del río Luján, Etapa 3 - Mercedes',
  'RPS010': 'Arroyo San Juan',
  'RRQ006': 'Evaluación del comportamiento hidráulico de la cuenca del Zanjón Madero, diseño de la estación de bombeo y obras complementarias',
  'RRQ023': 'Desagües Pluviales San Martin, calles Lange y San Andres',
  'RRQ024': 'Probando',
  'RRQ025': 'Desagües Pluviales Cuenca Vergara - Hurlingham',
  'RSA048': 'Puentes sobre Río Salado Ferroviario Salado 4.1b LOTE A - VidelaDorna/Gorch',
  'RSA065': 'Limpieza del Desvío Arroyo Pigüé',
  'RSA071': 'Reacondicionamiento Terraplén de Defensa y Estación de Bombeo de Guaminí',
  'RSA072': 'Puentes sobre Río Salado Ferroviario Salado 4.1b LOTE B - Salvador María-Roque Perez',
};

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
      initialSize={{ width: 350, height: "80vh" }}
      minSize={{ width: 300, height: 300 }}
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
                        const totalOrgLayers = Object.values(projects).reduce(
                          (sum, cats) => sum + Object.values(cats).reduce((cSum, lList) => cSum + lList.length, 0),
                          0
                        );
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
                              <span className="text-xs font-semibold truncate group-hover:text-white">
                                {orgName} ({totalOrgLayers})
                              </span>
                            </div>

                            {/* Nivel 2: Proyectos */}
                            {isOrgOpen && (
                              <div className="ml-3 pl-2.5 border-l border-slate-700/60 space-y-1 mt-0.5">
                                {Object.entries(projects).sort(([projA], [projB]) => projA.localeCompare(projB)).map(([projectName, categories]) => {
                                  const totalProjLayers = Object.values(categories).reduce(
                                    (sum, lList) => sum + lList.length,
                                    0
                                  );
                                  const projKey = `${orgName}/${projectName}`;
                                  const isProjOpen = isNodeExpanded(projKey);
                                  const formalName = projectFormalNames[projectName.toUpperCase()] || projectName;

                                  return (
                                    <div key={projectName}>
                                      <div 
                                        className="flex items-center gap-1.5 py-1 px-1 rounded hover:bg-white/5 cursor-pointer text-slate-200 group"
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
                                        <TooltipProvider delayDuration={150}>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span 
                                                className="text-xs font-medium truncate group-hover:text-white underline decoration-dotted decoration-slate-500/60 underline-offset-2"
                                              >
                                                {projectName} ({totalProjLayers})
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent 
                                              side="right" 
                                              align="center" 
                                              className="bg-slate-900/95 backdrop-blur border border-slate-700 text-white max-w-xs shadow-xl p-2 z-[9999]"
                                            >
                                              <p className="text-[11px] font-semibold text-sky-400">{projectName}</p>
                                              <p className="text-xs text-slate-200 mt-0.5 leading-snug">{formalName}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        {/* Botón manual de sincronización por proyecto */}
                                        {onSyncProject && (
                                          <button
                                            type="button"
                                            className={cn(
                                              "h-4 w-4 shrink-0 flex items-center justify-center rounded p-0 text-white/30 hover:text-sky-300 hover:bg-white/10 transition-colors ml-auto mr-1",
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
                                                  className="flex items-center gap-1.5 py-1 px-1 rounded hover:bg-white/5 cursor-pointer text-amber-300/90 group"
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
                                                    <FolderOpen className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                                  ) : (
                                                    <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                                  )}
                                                  <span className="text-[11px] font-medium truncate group-hover:text-amber-200">
                                                    {categoryName.toUpperCase()} ({projectLayers.length})
                                                  </span>
                                                </div>

                                                {/* Nivel 4: Capas individuales dentro de la subcarpeta */}
                                                {isCatOpen && (
                                                  <div className="ml-3 pl-2.5 border-l border-slate-700/40 space-y-1 mt-0.5">
                                                    {projectLayers.sort((a,b) => a.title.localeCompare(b.title)).map(layer => {
                                                      const added = isLayerAdded(layer);
                                                      return (
                                                        <div 
                                                          key={layer.name} 
                                                          className="flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/5 group cursor-pointer"
                                                          onClick={() => {
                                                            if (!added) onAddDeasLayer(layer);
                                                          }}
                                                          title={added ? "Capa agregada (quitar desde la lista de capas)" : "Cargar capa en el mapa"}
                                                        >
                                                          <button 
                                                            type="button" 
                                                            className={cn(
                                                              "p-0.5 rounded transition-colors flex-shrink-0 flex items-center justify-center bg-transparent border-0",
                                                              added
                                                                ? "text-emerald-400 cursor-default"
                                                                : "text-sky-400 group-hover:text-sky-300"
                                                            )}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              if (!added) onAddDeasLayer(layer);
                                                            }}
                                                            disabled={added}
                                                          >
                                                            {added ? (
                                                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                                            ) : (
                                                              <Layers className="h-3.5 w-3.5" />
                                                            )}
                                                          </button>
                                                          <span
                                                            className={cn(
                                                              "text-xs font-normal flex-1 truncate transition-colors",
                                                              added ? "text-emerald-300 font-medium" : "text-white/80 group-hover:text-white"
                                                            )}
                                                          >
                                                            {layer.title}
                                                          </span>
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
                      <p className="p-4 text-center text-xs text-gray-400">
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
