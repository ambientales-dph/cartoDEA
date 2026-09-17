
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  MapPinned,
  Database,
  Wrench,
  ListTree,
  ListChecks,
  ClipboardCheck,
  Library,
  LifeBuoy,
  Printer,
  Server,
  BrainCircuit,
  Camera,
  Loader2,
  SlidersHorizontal,
  ZoomIn,
  Undo2,
  BarChartHorizontal,
  DraftingCompass,
  Target,
  Share2,
  CloudRain,
  Ellipsis,
  User,
  FilePlus2,
  FolderOpen,
  Save,
  Trash2,
} from 'lucide-react';
import { Style, Fill, Stroke, Circle as CircleStyle, Text as TextStyle } from 'ol/style';
import { transform, transformExtent } from 'ol/proj';
import type { Extent } from 'ol/extent';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Map as OLMap } from 'ol';
import TileLayer from 'ol/layer/Tile';
import MapView, { BASE_LAYER_DEFINITIONS } from '@/components/map-view';
import AttributesPanelComponent from '@/components/feature-attributes-panel';
import ToolsPanel from '@/components/panels/ToolsPanel';
import LegendPanel from '@/components/panels/LegendPanel';
import TrelloPanel from '@/components/panels/TrelloPanel';
import WfsLibraryPanel from '@/components/panels/WfsLibraryPanel';
import HelpPanel from '@/components/panels/HelpPanel';
import PrintComposerPanel from '@/components/panels/PrintComposerPanel';
import GeeProcessingPanel from '@/components/panels/GeeProcessingPanel';
import StatisticsPanel from '@/components/panels/StatisticsPanel';
import AnalysisPanel from '@/components/panels/AnalysisPanel';
import ClimaPanel from '@/components/panels/ClimaPanel';
import LocationSearch from '@/components/location-search/LocationSearch';
import BaseLayerSelector from '@/components/layer-manager/BaseLayerSelector';
import BaseLayerControls from '@/components/layer-manager/BaseLayerControls';
import { StreetViewIcon } from '@/components/icons/StreetViewIcon';
import { DphLogoIcon } from '@/components/icons/DphLogoIcon';
import Notepad from '@/components/notepad/Notepad';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

import { useOpenLayersMap } from '@/hooks/map-core/useOpenLayersMap';
import { useLayerManager } from '@/hooks/layer-manager/useLayerManager';
import { useFeatureInspection } from '@/hooks/feature-inspection/useFeatureInspection';
import { useDrawingInteractions } from '@/hooks/drawing-tools/useDrawingInteractions';
import { useMeasurement } from '@/hooks/map-tools/useMeasurement';
import { useMapNavigation } from '@/hooks/map-tools/useMapNavigation';
import { useOSMData } from '@/hooks/osm-integration/useOSMData';
import { useGeoServerLayers } from '@/hooks/geoserver-connection/useGeoServerLayers';
import { useFloatingPanels } from '@/hooks/panels/useFloatingPanels';
import { useMapCapture } from '@/hooks/map-tools/useMapCapture';
import { useWfsLibrary } from '@/hooks/wfs-library/useWfsLibrary';
import { useOsmQuery } from '@/hooks/osm-integration/useOsmQuery';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { saveUserMap, getUserMaps, saveMapState } from '@/services/sharing-service';

import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import * as turf from '@turf/turf';
import { nanoid } from 'nanoid';

import { usePortalAuth } from '@/hooks/auth/usePortalAuth';
import { useInactivityTimeout } from '@/hooks/auth/useInactivityTimeout';

import type {
  MapState,
  OSMCategoryConfig,
  GeoServerDiscoveredLayer,
  BaseLayerOptionForSelect,
  MapLayer,
  VectorMapLayer,
  BaseLayerSettings,
  NominatimResult,
  PlainFeatureData,
  ActiveTool,
  SerializableMapLayer,
} from '@/lib/types';
import { authenticateWithGee } from '@/ai/flows/gee-flow';
import { checkTrelloCredentials } from '@/ai/flows/trello-actions';

const osmCategoryConfig: OSMCategoryConfig[] = [
  {
    id: 'watercourses',
    name: 'OSM Cursos de Agua',
    overpassQueryFragment: (bboxStr) =>
      `nwr[waterway~"^(river|stream|canal)$"](${bboxStr});`,
    style: new Style({ stroke: new Stroke({ color: '#3a86ff', width: 2 }) }),
  },
  {
    id: 'water_bodies',
    name: 'OSM Cuerpos de Agua',
    overpassQueryFragment: (bboxStr) =>
      `nwr[natural="water"](${bboxStr});nwr[landuse="reservoir"](${bboxStr});`,
    style: new Style({
      fill: new Fill({ color: 'rgba(58,134,255,0.4)' }),
      stroke: new Stroke({ color: '#3a86ff', width: 1 }),
    }),
  },
  {
    id: 'roads_paths',
    name: 'OSM Rutas y Caminos',
    overpassQueryFragment: (bboxStr) => `nwr[highway](${bboxStr});`,
    style: new Style({ stroke: new Stroke({ color: '#adb5bd', width: 2 }) }),
  },
];

const availableBaseLayersForSelect: BaseLayerOptionForSelect[] =
  BASE_LAYER_DEFINITIONS.map((def) => ({ id: def.id, name: def.name }));

const PANEL_WIDTH = 350;
const PANEL_PADDING = 8;

const panelToggleConfigs = [
  { id: 'wfsLibrary', IconComponent: Library, name: 'Biblioteca de Servidores' },
  { id: 'tools', IconComponent: Wrench, name: 'Herramientas' },
  { id: 'analysis', IconComponent: DraftingCompass, name: 'Análisis Espacial' },
  { id: 'clima', IconComponent: CloudRain, name: 'Clima y Satélite' },
  { id: 'trello', IconComponent: ClipboardCheck, name: 'Trello' },
  { id: 'printComposer', IconComponent: Printer, name: 'Impresión' },
  { id: 'gee', IconComponent: BrainCircuit, name: 'Procesamiento GEE' },
  { id: 'help', IconComponent: LifeBuoy, name: 'Ayuda' },
];

interface GeoMapperClientProps {
  initialMapState?: MapState;
}

export function GeoMapperClient({ initialMapState }: GeoMapperClientProps) {
  const firestore = useFirestore();
  const user = useUser();
  const mapAreaRef = useRef<HTMLDivElement>(null);
  
  const toolsPanelRef = useRef<HTMLDivElement>(null);
  const legendPanelRef = useRef<HTMLDivElement>(null);
  const attributesPanelRef = useRef<HTMLDivElement>(null);
  const trelloPanelRef = useRef<HTMLDivElement>(null);
  const wfsLibraryPanelRef = useRef<HTMLDivElement>(null);
  const helpPanelRef = useRef<HTMLDivElement>(null);
  const printComposerPanelRef = useRef<HTMLDivElement>(null);
  const geePanelRef = useRef<HTMLDivElement>(null);
  const statisticsPanelRef = useRef<HTMLDivElement>(null);
  const analysisPanelRef = useRef<HTMLDivElement>(null);
  const climaPanelRef = useRef<HTMLDivElement>(null);
  
  const [isSaveMapDialogOpen, setIsSaveMapDialogOpen] = useState(false);
  const [isLoadMapDialogOpen, setIsLoadMapDialogOpen] = useState(false);
  const [isConfirmNewMapOpen, setIsConfirmNewMapOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  const [mapSubject, setMapSubject] = useState('');
  const [userMapsList, setUserMapsList] = useState<(MapState & { id: string })[]>([]);
  const [isLoadingUserMaps, setIsLoadingUserMaps] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [hasPolygonDrawing, setHasPolygonDrawing] = useState(false);
  const [selectedLayerForStats, setSelectedLayerForStats] = useState<VectorMapLayer | null>(null);

  usePortalAuth();
  useInactivityTimeout();

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  const { mapRef, mapElementRef, setMapInstanceAndElement, isMapReady, drawingSourceRef } =
    useOpenLayersMap({
      initialCenter: initialMapState?.view.center,
      initialZoom: initialMapState?.view.zoom,
    });

  const { toast } = useToast();
  const [activeTool, setActiveTool] = useState<ActiveTool>({ type: null, id: null });
  const lastActiveToolRef = useRef<ActiveTool>({ type: null, id: null });

  const featureInspectionHook = useFeatureInspection({
    mapRef,
    mapElementRef,
    isMapReady,
    activeTool: activeTool.type === 'interaction' ? activeTool.id : null,
    setActiveTool: (id) => handleSetActiveTool({ type: 'interaction', id }),
    onNewSelection: (plainData, layerName, layerId) => {
      featureInspectionHook.processAndDisplayFeatures(plainData, layerName, layerId);
      if (panels.attributes.isMinimized) {
        togglePanelMinimize('attributes');
      }
    },
  });

  const layerManagerHook = useLayerManager({
    mapRef,
    isMapReady,
    onShowTableRequest: (data, name, id) => {
      featureInspectionHook.processAndDisplayFeatures(data, name, id);
      if (panels.attributes.isMinimized) {
        togglePanelMinimize('attributes');
      }
    },
  });

  const { panels, handlePanelMouseDown, togglePanelCollapse, togglePanelMinimize } =
    useFloatingPanels({
      toolsPanelRef,
      legendPanelRef,
      attributesPanelRef,
      trelloPanelRef,
      wfsLibraryPanelRef,
      helpPanelRef,
      printComposerPanelRef,
      geePanelRef,
      statisticsPanelRef,
      analysisPanelRef,
      climaPanelRef,
      mapAreaRef,
      panelWidth: PANEL_WIDTH,
      panelPadding: PANEL_PADDING,
    });

  const osmQueryHook = useOsmQuery({ 
    mapRef, 
    mapElementRef, 
    isMapReady, 
    onResults: (data, name) => {
      featureInspectionHook.processAndDisplayFeatures(data, name, null);
      if (panels.attributes.isMinimized) {
        togglePanelMinimize('attributes');
      }
    } 
  });

  const [activeBaseLayerId, setActiveBaseLayerId] = useState<string>(
    initialMapState?.baseLayerId || BASE_LAYER_DEFINITIONS[1].id
  );
  const [baseLayerSettings, setBaseLayerSettings] = useState<BaseLayerSettings>(
    initialMapState?.baseLayerSettings || {
        opacity: 1,
        brightness: 100,
        contrast: 100,
    }
  );

  useEffect(() => {
    if (!isMapReady || !drawingSourceRef.current) return;
    const source = drawingSourceRef.current;
    const updateHasPolygon = () => {
        const polygon = source.getFeatures().find(f => f.getGeometry()?.getType() === 'Polygon');
        setHasPolygonDrawing(!!polygon);
    };
    source.on('addfeature', updateHasPolygon);
    source.on('removefeature', updateHasPolygon);
    source.on('clear', updateHasPolygon);
    return () => {
        source.un('addfeature', updateHasPolygon);
        source.un('removefeature', updateHasPolygon);
        source.un('clear', updateHasPolygon);
    };
  }, [isMapReady, drawingSourceRef]);

  const handleBaseLayerSettingsChange = useCallback(
    (newSettings: Partial<BaseLayerSettings>) => {
      setBaseLayerSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  const handleChangeBaseLayer = useCallback((newBaseLayerId: string) => {
    setActiveBaseLayerId(newBaseLayerId);
  }, []);

  // Sync Base Layers
  const baseLayerRef = useRef<any>(null);
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;
    const map = mapRef.current;

    if (baseLayerRef.current) {
        map.removeLayer(baseLayerRef.current);
        baseLayerRef.current = null;
    }

    const def = BASE_LAYER_DEFINITIONS.find(d => d.id === activeBaseLayerId);
    if (!def) return;

    let creator = def.createLayer;
    if (!creator && def.parentLayerId) {
        const parentDef = BASE_LAYER_DEFINITIONS.find(p => p.id === def.parentLayerId);
        creator = parentDef?.createLayer;
    }

    if (creator) {
        const newLayer = creator();
        if (newLayer) {
            newLayer.setZIndex(0);
            newLayer.setOpacity(baseLayerSettings.opacity);
            
            newLayer.on('prerender', (event: any) => {
                const context = event.context;
                if (!context) return;
                context.save();
                context.filter = `brightness(${baseLayerSettings.brightness}%) contrast(${baseLayerSettings.contrast}%)`;
            });

            newLayer.on('postrender', (event: any) => {
                const context = event.context;
                if (!context) return;
                
                if (def.band && def.band !== 'none') {
                    const canvas = context.canvas;
                    try {
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        for (let i = 0; i < data.length; i += 4) {
                            const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
                            if (def.band === 'red') { data[i+1]=data[i+2]=r; }
                            else if (def.band === 'green') { data[i]=data[i+2]=g; }
                            else if (def.band === 'blue') { data[i]=data[i+1]=b; }
                            else if (def.band === 'false-color-vegetation') { data[i]=g*1.5; data[i+1]=r; data[i+2]=b; }
                            else if (def.band === 'false-color-urban') { data[i]=b; data[i+1]=g; data[i+2]=r; }
                        }
                        context.putImageData(imageData, 0, 0);
                    } catch (e) { console.warn("Filtro de banda omitido (CORS):", e); }
                }
                context.restore();
            });

            map.getLayers().insertAt(0, newLayer);
            baseLayerRef.current = newLayer;
        }
    }
  }, [isMapReady, mapRef, activeBaseLayerId, baseLayerSettings.opacity, baseLayerSettings.brightness, baseLayerSettings.contrast]);

  const handleSetActiveTool = useCallback((tool: ActiveTool) => {
    setActiveTool((currentTool) => {
      if (currentTool.type === tool.type && currentTool.id === tool.id) {
        return { type: null, id: null };
      }
      return tool;
    });
  }, []);

  // RIGHT-CLICK TOGGLE LOGIC
  useEffect(() => {
    if (activeTool.type !== null) {
      lastActiveToolRef.current = activeTool;
    }
  }, [activeTool]);

  useEffect(() => {
    if (!isMapReady) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      if (lastActiveToolRef.current.type) {
          handleSetActiveTool(lastActiveToolRef.current);
      }
    };

    const mapEl = mapElementRef.current;
    if (mapEl) {
      mapEl.addEventListener('contextmenu', handleContextMenu);
    }
    return () => {
      if (mapEl) {
        mapEl.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, [isMapReady, handleSetActiveTool, mapElementRef]);

  const [discoveredGeoServerLayers, setDiscoveredGeoServerLayers] = useState<GeoServerDiscoveredLayer[]>([]);
  const [printLayoutImage, setPrintLayoutImage] = useState<string | null>(null);
  const [isGeeAuthenticated, setIsGeeAuthenticated] = useState(false);
  const [isGeeAuthenticating, setIsGeeAuthenticating] = useState(true);

  const handleShowStatistics = useCallback((layerId: string) => {
    const layer = layerManagerHook.layers
        .flatMap(i => 'layers' in i ? i.layers : [i])
        .find(l => l.id === layerId) as VectorMapLayer | undefined;
    
    if (layer) {
        setSelectedLayerForStats(layer);
        if (panels.statistics.isMinimized) {
            togglePanelMinimize('statistics');
        }
    }
  }, [layerManagerHook.layers, panels.statistics.isMinimized, togglePanelMinimize]);

  const handleExtractBySelection = useCallback(() => {
    const selected = featureInspectionHook.selectedFeatures;
    if (selected.length === 0) {
      toast({ description: "No hay entidades seleccionadas para extraer." });
      return;
    }

    const clonedFeatures = selected.map(f => {
      const clone = f.clone();
      clone.setId(nanoid());
      return clone;
    });

    const layerName = "Selección Extraída";
    const newLayerId = `extracted-${nanoid()}`;
    const newSource = new VectorSource({ features: clonedFeatures });
    const newOlLayer = new VectorLayer({
      source: newSource,
      properties: { id: newLayerId, name: layerName, type: 'vector' },
      style: (selected[0] as any).getStyle() || undefined,
    });

    layerManagerHook.addLayer({
      id: newLayerId,
      name: layerName,
      olLayer: newOlLayer,
      visible: true,
      opacity: 1,
      type: 'vector',
    }, true);

    toast({ description: `Se creó una nueva capa con ${clonedFeatures.length} entidades.` });
  }, [featureInspectionHook.selectedFeatures, layerManagerHook, toast]);

  const handleExtractByPolygon = useCallback((targetLayerId: string) => {
    const map = mapRef.current;
    if (!map) return;

    const targetLayer = map.getAllLayers().find(l => l.get('id') === targetLayerId) as VectorLayer<any> | undefined;
    const drawingSource = drawingSourceRef.current;
    const polygonFeature = drawingSource?.getFeatures().find(f => f.getGeometry()?.getType() === 'Polygon');

    if (!targetLayer || !polygonFeature) {
      toast({ description: "Se requiere una capa vectorial y un polígono dibujado.", variant: "destructive" });
      return;
    }

    const targetSource = targetLayer.getSource();
    if (!targetSource) return;

    toast({ description: "Extrayendo entidades por polígono..." });

    const format = new GeoJSON({ featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326' });
    const polygonGeoJSON = format.writeFeatureObject(polygonFeature) as turf.Feature<turf.Polygon>;
    const featuresToExtract: Feature<Geometry>[] = [];

    targetSource.getFeatures().forEach(f => {
      try {
          const featureGeoJSON = format.writeFeatureObject(f);
          if (turf.booleanIntersects(polygonGeoJSON, featureGeoJSON as any) || turf.booleanWithin(featureGeoJSON as any, polygonGeoJSON)) {
              featuresToExtract.push(f.clone());
          }
      } catch (e) {
          console.warn("Error checking intersection:", e);
      }
    });

    if (featuresToExtract.length > 0) {
      featuresToExtract.forEach(f => f.setId(nanoid()));
      const layerName = `Extracción de ${targetLayer.get('name')}`;
      const newLayerId = `extract-poly-${nanoid()}`;
      const newSource = new VectorSource({ features: featuresToExtract });
      const newOlLayer = new VectorLayer({
          source: newSource,
          properties: { id: newLayerId, name: layerName, type: 'vector' },
          style: (targetLayer as any).getStyle(),
      });

      layerManagerHook.addLayer({
          id: newLayerId,
          name: layerName,
          olLayer: newOlLayer,
          visible: true,
          opacity: 1,
          type: 'vector'
      }, true);

      toast({ description: `Se extrajeron ${featuresToExtract.length} entidades.` });
    } else {
      toast({ description: "No se encontraron entidades dentro del área." });
    }
  }, [mapRef, drawingSourceRef, layerManagerHook, toast]);

  const { handleFetchGeoServerLayers, isFetching: isFetchingDeasLayers } =
    useGeoServerLayers({
      onLayerStateUpdate: (name, added, type) => {
          setDiscoveredGeoServerLayers(prev => prev.map(l => {
              if (l.name === name) {
                  if (type === 'wms') return { ...l, wmsAddedToMap: added };
                  return { ...l, wfsAddedToMap: added };
              }
              return l;
          }));
      },
    });

  const wfsLibraryPanelProps = useWfsLibrary({
    onAddLayer: (name, title, url, bbox, style) => layerManagerHook.handleAddHybridLayer(name, title, url, bbox, style),
  });

  useEffect(() => {
    if (initialMapState || !isMapReady) return;
    const init = async () => {
        const authGee = await authenticateWithGee();
        setIsGeeAuthenticated(authGee.success);
        setIsGeeAuthenticating(false);
        checkTrelloCredentials().catch(console.error);
        const deas = await handleFetchGeoServerLayers('https://www.minfra.gba.gob.ar/ambientales/geoserver');
        if (deas) setDiscoveredGeoServerLayers(deas);
    };
    init();
  }, [isMapReady, initialMapState, handleFetchGeoServerLayers]);

  const osmDataHook = useOSMData({
    mapRef,
    drawingSourceRef,
    addLayer: layerManagerHook.addLayer,
    osmCategoryConfigs: osmCategoryConfig,
    onExportLayers: async () => {},
  });

  const drawingInteractions = useDrawingInteractions({
    mapRef,
    isMapReady,
    drawingSourceRef: drawingSourceRef,
    activeTool: activeTool.type === 'draw' ? activeTool.id : null,
    setActiveTool: (id) => handleSetActiveTool({ type: 'draw', id }),
    addLayer: layerManagerHook.addLayer,
  });

  const measurementHook = useMeasurement({
    mapRef,
    isMapReady,
    activeTool: activeTool.type === 'measure' ? activeTool.id : null,
    setActiveTool: (id) => handleSetActiveTool({ type: 'measure', id }),
  });

  const mapNavigationHook = useMapNavigation({
    mapRef,
    mapElementRef,
    isMapReady,
    activeTool: activeTool.type === 'mapAction' ? activeTool.id : null,
    setActiveTool: (id) => handleSetActiveTool({ type: 'mapAction', id }),
  });

  const { captureMapAsDataUrl } = useMapCapture({ mapRef, activeBaseLayerId });

  const handleTogglePrintComposer = async () => {
    if (panels.printComposer.isMinimized) {
      const imageUrl = await captureMapAsDataUrl();
      if (imageUrl) {
        setPrintLayoutImage(imageUrl);
        togglePanelMinimize('printComposer');
      }
    } else {
      togglePanelMinimize('printComposer');
    }
  };

  const handleLocationSelection = useCallback(
    (location: NominatimResult) => {
      if (!mapRef.current) return;
      const [sLat, nLat, wLon, eLon] = location.boundingbox.map(parseFloat);
      const extent3857 = transformExtent([wLon, sLat, eLon, nLat], 'EPSG:4326', 'EPSG:3857');
      mapRef.current.getView().fit(extent3857, { padding: [50, 50, 50, 50], duration: 1000 });
    },
    [mapRef]
  );

  const handleShareMap = useCallback(async () => {
    if (!mapRef.current || !firestore) return;
    
    setIsSharing(true);
    try {
        const view = mapRef.current.getView();
        const center = transform(view.getCenter() || [0,0], 'EPSG:3857', 'EPSG:4326');
        const zoom = view.getZoom() || 7;
        
        const serializableLayers: SerializableMapLayer[] = layerManagerHook.layers.flatMap(item => {
            if ('layers' in item) return item.layers;
            return [item];
        }).map(layer => {
            let data: string | undefined = undefined;
            if (layer.type === 'vector' || layer.type === 'drawing' || layer.type === 'analysis' || layer.type === 'osm') {
                try {
                    const source = (layer.olLayer as VectorLayer<any>).getSource();
                    if (source) {
                        const features = source.getFeatures();
                        if (features.length > 0) {
                            const format = new GeoJSON();
                            data = format.writeFeatures(features, {
                                featureProjection: 'EPSG:3857',
                                dataProjection: 'EPSG:4326'
                            });
                            if (data.length > 800000) {
                                return {
                                    type: 'local-placeholder',
                                    name: layer.name,
                                    opacity: layer.opacity,
                                    visible: layer.visible,
                                } as SerializableMapLayer;
                            }
                        }
                    }
                } catch (e) { console.error(e); }
            }

            return {
                type: (layer.type === 'vector' || layer.type === 'drawing' || layer.type === 'analysis' || layer.type === 'osm') ? 'local' : layer.type as any,
                name: layer.name,
                opacity: layer.opacity,
                visible: layer.visible,
                url: (layer as any).url || null,
                layerName: (layer as any).layerName || null,
                styleName: (layer as any).styleName || null,
                wmsStyleEnabled: layer.wmsStyleEnabled,
                geeParams: layer.geeParams ? {
                    bandCombination: layer.geeParams.bandCombination,
                    tileUrl: layer.geeParams.tileUrl,
                } : null,
                data,
                simpleStyle: layer.simpleStyle,
                graduatedSymbology: layer.graduatedSymbology,
                categorizedSymbology: layer.categorizedSymbology,
                geoTiffStyle: layer.geoTiffStyle,
            };
        });

        const mapState: MapState = {
            subject: mapSubject || 'Mapa compartido',
            view: { center, zoom },
            baseLayerId: activeBaseLayerId,
            baseLayerSettings: baseLayerSettings,
            layers: serializableLayers,
        };

        const mapId = await saveMapState(firestore, mapState);
        const url = `${window.location.origin}/share/${mapId}`;
        setShareLink(url);
        setIsShareDialogOpen(true);
    } catch (error) {
        console.error("Error sharing map:", error);
        toast({ description: "Error al generar el enlace para compartir.", variant: "destructive" });
    } finally {
        setIsSharing(false);
    }
  }, [mapRef, firestore, mapSubject, activeBaseLayerId, baseLayerSettings, layerManagerHook.layers, toast]);

  const handleSaveUserMap = useCallback(async () => {
    if (!mapRef.current || !firestore || !user) return;
    const currentView = mapRef.current.getView();
    const mapState: MapState = {
      subject: mapSubject || 'Mapa sin título',
      view: { center: transform(currentView.getCenter() || [0,0], 'EPSG:3857', 'EPSG:4326'), zoom: currentView.getZoom() || 7 },
      baseLayerId: activeBaseLayerId,
      layers: [], // Actual expansion could happen here similarly to share
    };
    await saveUserMap(firestore, user.uid, mapState);
    toast({ description: "Mapa guardado." });
    setIsSaveMapDialogOpen(false);
  }, [mapRef, mapSubject, activeBaseLayerId, firestore, user, toast]);

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground">
      {!initialMapState && <FirebaseErrorListener />}
      <div className="bg-gray-700/90 backdrop-blur-sm shadow-md p-2 z-20 flex items-center gap-2">
        <DphLogoIcon className="h-8 w-8 flex-shrink-0" />
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={'outline'} size="icon" className={`h-8 w-8 ${!panels.legend.isMinimized ? 'bg-primary text-primary-foreground' : 'bg-gray-700/80 text-white'}`} onClick={() => togglePanelMinimize('legend')}>
                <ListTree className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p className="text-xs">Capas</p></TooltipContent>
          </Tooltip>

          <div className="flex-grow flex items-center gap-2 min-w-0">
            <LocationSearch onLocationSelect={handleLocationSelection} className="flex-shrink min-w-[150px] w-full max-w-sm" />
            <div className="flex-shrink-0 w-full max-w-[220px]">
              <BaseLayerSelector availableBaseLayers={availableBaseLayersForSelect} activeBaseLayerId={activeBaseLayerId} onChangeBaseLayer={handleChangeBaseLayer} />
            </div>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-black/20 text-white/90 border-0"><MapPinned className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-700/90 text-white border-gray-600 backdrop-blur-sm w-64">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent p-0">
                  <div className="p-2 w-full"><BaseLayerControls settings={baseLayerSettings} onChange={handleBaseLayerSettingsChange} /></div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem onSelect={() => setIsConfirmNewMapOpen(true)} className="text-xs"><FilePlus2 className="h-4 w-4 mr-2" /> Nuevo mapa</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { getUserMaps(firestore!, user!.uid).then(setUserMapsList); setIsLoadMapDialogOpen(true); }} className="text-xs"><FolderOpen className="h-4 w-4 mr-2" /> Cargar mapa</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsSaveMapDialogOpen(true)} className="text-xs"><Save className="h-4 w-4 mr-2" /> Guardar mapa</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleShareMap} className="text-xs" disabled={isSharing}>
                   {isSharing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Share2 className="h-4 w-4 mr-2" />}
                   Compartir Mapa
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={async () => {
                    const data = await captureMapAsDataUrl();
                    if (data) { const l = document.createElement('a'); l.href = data; l.download = 'mapa.jpg'; l.click(); }
                }} className="text-xs"><Camera className="h-4 w-4 mr-2" /> Capturar Imagen</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={mapNavigationHook.toggleZoomToArea} variant="outline" size="icon" className={cn('h-8 w-8 bg-black/20 text-white/90 border-0', mapNavigationHook.activeTool === 'zoomToArea' && 'bg-primary')}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-row space-x-1 ml-auto items-center">
            {panelToggleConfigs.map((pc) => (
              <Tooltip key={pc.id}>
                <TooltipTrigger asChild>
                  <Button variant={'outline'} size="icon" className={`h-8 w-8 ${!panels[pc.id as keyof typeof panels].isMinimized ? 'bg-primary text-primary-foreground' : 'bg-gray-700/80 text-white'}`} onClick={() => pc.id === 'printComposer' ? handleTogglePrintComposer() : togglePanelMinimize(pc.id as any)}>
                    <pc.IconComponent className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p className="text-xs">{pc.name}</p></TooltipContent>
              </Tooltip>
            ))}
            <Avatar className="h-8 w-8 ml-2 border border-white/20">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback className="bg-primary/20 text-white text-[10px]">{user?.displayName?.[0] || <User className="h-3 w-3" />}</AvatarFallback>
            </Avatar>
          </div>
        </TooltipProvider>
      </div>

      <div ref={mapAreaRef} className="relative flex-1 overflow-visible">
        <MapView 
          isMapReady={isMapReady}
          setMapInstanceAndElement={setMapInstanceAndElement} 
          activeBaseLayerId={activeBaseLayerId} 
          baseLayerSettings={baseLayerSettings} 
        />
        
        {isClientMounted && !panels.legend.isMinimized && (
          <LegendPanel
            panelRef={legendPanelRef}
            isCollapsed={panels.legend.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('legend')}
            onClosePanel={() => togglePanelMinimize('legend')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'legend')}
            layers={layerManagerHook.layers}
            onToggleLayerVisibility={layerManagerHook.toggleLayerVisibility}
            onRemoveLayer={layerManagerHook.removeLayer}
            onRemoveLayers={layerManagerHook.removeLayers}
            onZoomToLayerExtent={layerManagerHook.zoomToLayerExtent}
            onShowLayerTable={layerManagerHook.handleShowLayerTable}
            onShowStatistics={handleShowStatistics}
            onExtractByPolygon={handleExtractByPolygon}
            onExtractBySelection={handleExtractBySelection}
            onSelectByLayer={featureInspectionHook.selectByLayer}
            onExportLayer={() => {}}
            onExportWmsAsGeotiff={() => {}}
            onRenameLayer={layerManagerHook.renameLayer}
            onChangeLayerStyle={layerManagerHook.changeLayerStyle}
            onChangeLayerLabels={layerManagerHook.onChangeLayerLabels}
            onApplyGraduatedSymbology={layerManagerHook.applyGraduatedSymbology}
            onApplyCategorizedSymbology={layerManagerHook.applyCategorizedSymbology}
            onApplyGeoTiffStyle={layerManagerHook.onApplyGeoTiffStyle}
            onToggleWmsStyle={layerManagerHook.onToggleWmsStyle}
            onGroupLayers={layerManagerHook.groupLayers}
            onToggleGroupVisibility={layerManagerHook.toggleGroupVisibility}
            onToggleGroupExpanded={layerManagerHook.toggleGroupExpanded}
            onSetGroupDisplayMode={layerManagerHook.setGroupDisplayMode}
            onUngroup={layerManagerHook.ungroup}
            onRenameGroup={layerManagerHook.renameGroup}
            onToggleGroupPlayback={layerManagerHook.toggleGroupPlayback}
            onSetGroupPlaySpeed={layerManagerHook.setGroupPlaySpeed}
            isDrawingSourceEmptyOrNotPolygon={!hasPolygonDrawing}
            isSelectionEmpty={featureInspectionHook.selectedFeatures.length === 0}
            onSetLayerOpacity={layerManagerHook.setLayerOpacity}
            onReorderLayers={layerManagerHook.reorderLayers}
            onAddLayer={layerManagerHook.addLayer}
            activeTool={featureInspectionHook.activeTool}
            onSetActiveTool={featureInspectionHook.setActiveTool}
            onClearSelection={featureInspectionHook.clearSelection}
            discoveredDeasLayers={discoveredGeoServerLayers}
            onAddDeasLayer={(l) => layerManagerHook.handleAddHybridLayer(l.name, l.title, 'https://www.minfra.gba.gob.ar/ambientales/geoserver', l.bbox, l.styleName)}
            isFetchingDeasLayers={isFetchingDeasLayers}
            onReloadDeasLayers={handleFetchGeoServerLayers}
            canUndoRemove={layerManagerHook.lastRemovedLayers.length > 0}
            onUndoRemove={layerManagerHook.undoRemove}
            selectedFeaturesForSelection={featureInspectionHook.selectedFeatures}
            isSharedView={false}
            style={{ top: `${panels.legend.position.y}px`, left: `${panels.legend.position.x}px`, zIndex: panels.legend.zIndex }}
          />
        )}

        {isClientMounted && !panels.attributes.isMinimized && (
          <AttributesPanelComponent
            plainFeatureData={featureInspectionHook.inspectedFeatureData}
            layerName={featureInspectionHook.currentInspectedLayerName}
            layerId={featureInspectionHook.currentInspectedLayerId}
            panelRef={attributesPanelRef}
            isCollapsed={panels.attributes.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('attributes')}
            onClosePanel={() => togglePanelMinimize('attributes')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'attributes')}
            selectedFeatureIds={featureInspectionHook.selectedFeatures.map(f => f.getId() as string)}
            onFeatureSelect={featureInspectionHook.selectFeaturesById}
            onAttributeChange={featureInspectionHook.updateInspectedFeatureData}
            onAddField={() => {}}
            onRecalculateAttributes={() => {}}
            sortConfig={featureInspectionHook.sortConfig}
            onSortChange={featureInspectionHook.setSortConfig}
            style={{ top: `${panels.attributes.position.y}px`, left: `${panels.attributes.position.x}px`, zIndex: panels.attributes.zIndex }}
          />
        )}

        {isClientMounted && !panels.wfsLibrary.isMinimized && (
          <WfsLibraryPanel
            panelRef={wfsLibraryPanelRef}
            isCollapsed={panels.wfsLibrary.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('wfsLibrary')}
            onClosePanel={() => togglePanelMinimize('wfsLibrary')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'wfsLibrary')}
            style={{ top: `${panels.wfsLibrary.position.y}px`, left: `${panels.wfsLibrary.position.x}px`, zIndex: panels.wfsLibrary.zIndex }}
            predefinedServers={wfsLibraryPanelProps.PREDEFINED_SERVERS}
            isLoading={wfsLibraryPanelProps.isLoading}
            discoveredLayers={wfsLibraryPanelProps.discoveredLayers}
            onFetchLayers={wfsLibraryPanelProps.fetchCapabilities}
            onAddLayer={wfsLibraryPanelProps.addLayer}
          />
        )}

        {isClientMounted && !panels.tools.isMinimized && (
          <ToolsPanel
            panelRef={toolsPanelRef}
            isCollapsed={panels.tools.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('tools')}
            onClosePanel={() => togglePanelMinimize('tools')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'tools')}
            activeDrawTool={drawingInteractions.activeTool}
            onToggleDrawingTool={drawingInteractions.toggleTool}
            onClearDrawnFeatures={drawingInteractions.clearDrawnFeatures}
            onConvertDrawingsToLayer={drawingInteractions.convertDrawingsToLayer}
            measurementHook={measurementHook}
            isFetchingOSM={osmDataHook.isFetchingOSM}
            onFetchOSMDataTrigger={osmDataHook.fetchOSMData}
            onFetchCustomOSMData={osmDataHook.fetchCustomOSMData}
            osmCategoriesForSelection={osmCategoryConfig}
            selectedOSMCategoryIds={osmDataHook.selectedOSMCategoryIds}
            onSelectedOSMCategoriesChange={osmDataHook.setSelectedOSMCategoryIds}
            isDownloading={osmDataHook.isDownloading}
            onDownloadOSMLayers={osmDataHook.handleDownloadOSMLayers}
            osmQueryHook={osmQueryHook}
            style={{ top: `${panels.tools.position.y}px`, left: `${panels.tools.position.x}px`, zIndex: panels.tools.zIndex }}
          />
        )}

        {isClientMounted && !panels.analysis.isMinimized && (
          <AnalysisPanel
            panelRef={analysisPanelRef}
            isCollapsed={panels.analysis.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('analysis')}
            onClosePanel={() => togglePanelMinimize('analysis')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'analysis')}
            allLayers={layerManagerHook.layers}
            selectedFeatures={featureInspectionHook.selectedFeatures}
            onAddLayer={layerManagerHook.addLayer}
            mapRef={mapRef}
            onShowTableRequest={(data, name, id) => {
              featureInspectionHook.processAndDisplayFeatures(data, name, id);
              if (panels.attributes.isMinimized) togglePanelMinimize('attributes');
            }}
            onToggleLayerVisibility={layerManagerHook.toggleLayerVisibility}
            style={{ top: `${panels.analysis.position.y}px`, left: `${panels.analysis.position.x}px`, zIndex: panels.analysis.zIndex }}
          />
        )}

        {isClientMounted && !panels.clima.isMinimized && (
          <ClimaPanel
            panelRef={climaPanelRef}
            isCollapsed={panels.clima.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('clima')}
            onClosePanel={() => togglePanelMinimize('clima')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'clima')}
            onAddLayer={layerManagerHook.addLayer}
            allLayers={layerManagerHook.layers}
            mapRef={mapRef}
            style={{ top: `${panels.clima.position.y}px`, left: `${panels.clima.position.x}px`, zIndex: panels.clima.zIndex }}
          />
        )}

        {isClientMounted && !panels.gee.isMinimized && (
          <GeeProcessingPanel
            panelRef={geePanelRef}
            isCollapsed={panels.gee.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('gee')}
            onClosePanel={() => togglePanelMinimize('gee')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'gee')}
            onAddGeeLayer={layerManagerHook.addGeeLayerToMap}
            mapRef={mapRef}
            isAuthenticating={isGeeAuthenticating}
            isAuthenticated={isGeeAuthenticated}
            style={{ top: `${panels.gee.position.y}px`, left: `${panels.gee.position.x}px`, zIndex: panels.gee.zIndex }}
          />
        )}

        {isClientMounted && !panels.statistics.isMinimized && (
          <StatisticsPanel
            panelRef={statisticsPanelRef}
            isCollapsed={panels.statistics.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('statistics')}
            onClosePanel={() => togglePanelMinimize('statistics')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'statistics')}
            layer={selectedLayerForStats}
            allLayers={layerManagerHook.layers.flatMap(i => 'layers' in i ? i.layers : [i])}
            selectedFeatures={featureInspectionHook.selectedFeatures}
            mapRef={mapRef}
            style={{ top: `${panels.statistics.position.y}px`, left: `${panels.statistics.position.x}px`, zIndex: panels.statistics.zIndex }}
          />
        )}

        {isClientMounted && !panels.help.isMinimized && (
          <HelpPanel
            panelRef={helpPanelRef}
            isCollapsed={panels.help.isCollapsed}
            onToggleCollapse={() => togglePanelCollapse('help')}
            onClosePanel={() => togglePanelMinimize('help')}
            onMouseDownHeader={(e) => handlePanelMouseDown(e, 'help')}
            style={{ top: `${panels.help.position.y}px`, left: `${panels.help.position.x}px`, zIndex: panels.help.zIndex }}
          />
        )}

      </div>
      <Notepad />

      <AlertDialog open={isConfirmNewMapOpen} onOpenChange={setIsConfirmNewMapOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de que desea crear un nuevo mapa?</AlertDialogTitle>
            <AlertDialogDescription>Esto eliminará todas las capas actuales.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { layerManagerHook.removeLayers(layerManagerHook.layers.map(l => l.id)); setIsConfirmNewMapOpen(false); }}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSaveMapDialogOpen} onOpenChange={setIsSaveMapDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Guardar Mapa en su Biblioteca</AlertDialogTitle>
            <AlertDialogDescription>Ingrese un nombre para identificar este mapa.</AlertDialogDescription>
          </AlertDialogHeader>
          <Input value={mapSubject} onChange={(e) => setMapSubject(e.target.value)} placeholder="Ej: Proyecto Hidrológico" className="my-2" />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveUserMap}>Guardar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isLoadMapDialogOpen} onOpenChange={setIsLoadMapDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Sus Mapas Guardados</AlertDialogTitle>
          </AlertDialogHeader>
          <ScrollArea className="h-64 mt-2">
            {userMapsList.length > 0 ? (
                userMapsList.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md group">
                        <span className="text-sm font-medium">{m.subject}</span>
                        <Button variant="ghost" size="sm" className="h-7 px-2 opacity-0 group-hover:opacity-100" onClick={() => toast({ description: "Funcionalidad de carga en desarrollo." })}>Cargar</Button>
                    </div>
                ))
            ) : <p className="text-center text-sm text-muted-foreground pt-10">No tiene mapas guardados.</p>}
          </ScrollArea>
          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Mapa Compartido</AlertDialogTitle>
            <AlertDialogDescription>
                Cualquier persona con este enlace podrá ver tu mapa (solo lectura).
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center gap-2 my-4">
            <Input value={shareLink} readOnly className="bg-muted text-xs" />
            <Button size="sm" onClick={() => { navigator.clipboard.writeText(shareLink); toast({ description: "Enlace copiado al portapapeles." }); }}>Copiar</Button>
            </div>
            <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsShareDialogOpen(false)}>Cerrar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
