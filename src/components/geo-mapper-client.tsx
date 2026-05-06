
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
} from './ui/alert-dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import type Layer from 'ol/layer/Layer';
import type { Source as TileSource } from 'ol/source';
import type Feature from 'ol/Feature';
import { Geometry, LineString as OlLineString } from 'ol/geom';
import { getLength as olGetLength } from 'ol/sphere';
import * as turf from '@turf/turf';

import MapView, { BASE_LAYER_DEFINITIONS } from '@/components/map-view';
import AttributesPanelComponent from '@/components/feature-attributes-panel';
import ToolsPanel from '@/components/panels/ToolsPanel';
import LegendPanel from '@/components/panels/LegendPanel';
import AIPanel from '@/components/panels/AIPanel';
import TrelloPanel from '@/components/panels/TrelloPanel';
import WfsLibraryPanel from '@/components/panels/WfsLibraryPanel';
import HelpPanel from '@/components/panels/HelpPanel';
import PrintComposerPanel from '@/components/panels/PrintComposerPanel';
import GeeProcessingPanel from '@/components/panels/GeeProcessingPanel';
import StatisticsPanel from '@/components/panels/StatisticsPanel';
import AnalysisPanel from '@/components/panels/AnalysisPanel';
import ClimaPanel from '@/components/panels/ClimaPanel';
import WfsLoadingIndicator from '@/components/feedback/WfsLoadingIndicator';
import LocationSearch from '@/components/location-search/LocationSearch';
import BaseLayerSelector from '@/components/layer-manager/BaseLayerSelector';
import BaseLayerControls from '@/components/layer-manager/BaseLayerControls';
import { StreetViewIcon } from '@/components/icons/StreetViewIcon';
import TrelloCardNotification from '@/components/trello-integration/TrelloCardNotification';
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
import { saveMapState, saveUserMap, getUserMaps, deleteUserMap } from '@/services/sharing-service';

import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { nanoid } from 'nanoid';

import { usePortalAuth } from '@/hooks/auth/usePortalAuth';
import { useInactivityTimeout } from '@/hooks/auth/useInactivityTimeout';

import type {
  MapState,
  OSMCategoryConfig,
  GeoServerDiscoveredLayer,
  BaseLayerOptionForSelect,
  MapLayer,
  ChatMessage,
  BaseLayerSettings,
  NominatimResult,
  PlainFeatureData,
  ActiveTool,
  TrelloCardInfo,
  GraduatedSymbology,
  VectorMapLayer,
  CategorizedSymbology,
  SerializableMapLayer,
} from '@/lib/types';
import {
  chatWithMapAssistant,
  type MapAssistantOutput,
} from '@/ai/flows/find-layer-flow';
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
  {
    id: 'bridges',
    name: 'OSM Puentes',
    overpassQueryFragment: (bboxStr) => `nwr[man_made="bridge"](${bboxStr});`,
    style: new Style({ stroke: new Stroke({ color: '#6c757d', width: 4 }) }),
  },
  {
    id: 'admin_boundaries',
    name: 'OSM Límites Admin.',
    overpassQueryFragment: (bboxStr) => `nwr[boundary="administrative"](${bboxStr});`,
    style: new Style({
      stroke: new Stroke({ color: '#ff006e', width: 2, lineDash: [4, 8] }),
    }),
  },
  {
    id: 'green_areas',
    name: 'OSM Áreas Verdes',
    overpassQueryFragment: (bboxStr) =>
      `nwr[leisure~"^(park|garden)$"](${bboxStr});nwr[landuse~"^(forest|meadow|village_green)$"](${bboxStr});nwr[natural="wood"](${bboxStr});`,
    style: new Style({
      fill: new Fill({ color: 'rgba(13,166,75,0.4)' }),
      stroke: new Stroke({ color: '#0da64b', width: 1 }),
    }),
  },
  {
    id: 'health_centers',
    name: 'OSM Centros de Salud',
    overpassQueryFragment: (bboxStr) => `nwr[healthcare](${bboxStr});`,
    style: new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#d90429' }),
        stroke: new Stroke({ color: 'white', width: 1.5 }),
      }),
    }),
  },
  {
    id: 'educational',
    name: 'OSM Educacionales',
    overpassQueryFragment: (bboxStr) =>
      `nwr[amenity~"^(school|university|college|kindergarten)$"](${bboxStr});`,
    style: new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#8338ec' }),
        stroke: new Stroke({ color: 'white', width: 1.5 }),
      }),
    }),
  },
  {
    id: 'social_institutions',
    name: 'OSM Instituciones Sociales',
    overpassQueryFragment: (bboxStr) => `nwr[amenity="community_centre"](${bboxStr});`,
    style: new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#ff6b6b' }),
        stroke: new Stroke({ color: 'white', width: 1.5 }),
      }),
    }),
  },
  {
    id: 'cultural_heritage',
    name: 'OSM Patrimonio Cultural',
    overpassQueryFragment: (bboxStr) =>
      `nwr[historic](${bboxStr});nwr[heritage](${bboxStr});`,
    style: new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#8d6e63' }),
        stroke: new Stroke({ color: 'white', width: 1.5 }),
      }),
    }),
  },
];

const osmCategoriesForSelection = osmCategoryConfig.map(({ id, name }) => ({
  id,
  name,
}));
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
  const trelloPopupRef = useRef<Window | null>(null);
  
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSaveMapDialogOpen, setIsSaveMapDialogOpen] = useState(false);
  const [isLoadMapDialogOpen, setIsLoadMapDialogOpen] = useState(false);
  const [isConfirmCloseProjectOpen, setIsConfirmCloseProjectOpen] = useState(false);
  const [isConfirmNewMapOpen, setIsConfirmNewMapOpen] = useState(false);
  
  const [mapSubject, setMapSubject] = useState('');
  const [projectLayerIds, setProjectLayerIds] = useState<string[]>([]);
  const [userMapsList, setUserMapsList] = useState<(MapState & { id: string })[]>([]);
  const [isLoadingUserMaps, setIsLoadingUserMaps] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);

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
  const lastActiveToolRef = useRef<ActiveTool>({
    type: 'interaction',
    id: 'inspect',
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

  const handleBaseLayerSettingsChange = useCallback(
    (newSettings: Partial<BaseLayerSettings>) => {
      setBaseLayerSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  const handleChangeBaseLayer = useCallback((newBaseLayerId: string) => {
    setActiveBaseLayerId(newBaseLayerId);
  }, []);

  // --- Sincronización de Capas Base con OpenLayers (FILTROS DE BANDA Y FALSO COLOR) ---
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
      if (tool.type !== null) {
        lastActiveToolRef.current = tool;
      }
      if (currentTool.type === tool.type && currentTool.id === tool.id) {
        return { type: null, id: null };
      }
      return tool;
    });
  }, []);

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

  const [discoveredGeoServerLayers, setDiscoveredGeoServerLayers] = useState<
    GeoServerDiscoveredLayer[]
  >([]);

  const [printLayoutImage, setPrintLayoutImage] = useState<string | null>(null);
  const [isGeeAuthenticated, setIsGeeAuthenticated] = useState(false);
  const [isGeeAuthenticating, setIsGeeAuthenticating] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [trelloCardNotification, setTrelloCardInfo] = useState<TrelloCardInfo | null>(null);
  const [statisticsLayer, setStatisticsLayer] = useState<VectorMapLayer | null>(null);

  const updateDiscoveredLayerState = useCallback(
    (layerName: string, added: boolean, type: 'wms' | 'wfs') => {
      setDiscoveredGeoServerLayers((prev) =>
        prev.map((l) => {
          if (l.name === layerName) {
            if (type === 'wms') return { ...l, wmsAddedToMap: added };
            if (type === 'wfs') return { ...l, wfsAddedToMap: added };
          }
          return l;
        })
      );
    },
    []
  );

  const handleShowTableRequest = useCallback(
    (data: PlainFeatureData[], name: string, id: string) => {
      featureInspectionHook.processAndDisplayFeatures(data, name, id);
      if (panels.attributes.isMinimized) {
        togglePanelMinimize('attributes');
      }
    },
    [featureInspectionHook, panels.attributes.isMinimized, togglePanelMinimize]
  );

  const layerManagerHook = useLayerManager({
    mapRef,
    isMapReady,
    onShowTableRequest: handleShowTableRequest,
  });

  const { handleFetchGeoServerLayers, isFetching: isFetchingDeasLayers } =
    useGeoServerLayers({
      onLayerStateUpdate: updateDiscoveredLayerState,
    });

  const wfsLibraryHook = useWfsLibrary({
    onAddLayer: layerManagerHook.handleAddHybridLayer,
  });

  const initialGeoServerUrl = 'https://www.minfra.gba.gob.ar/ambientales/geoserver';
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (initialMapState || !isMapReady || hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    setIsGeeAuthenticating(true);
    authenticateWithGee()
      .then((result) => {
        if (result.success) {
          setIsGeeAuthenticated(true);
        }
      })
      .catch(console.error)
      .finally(() => setIsGeeAuthenticating(false));

    checkTrelloCredentials().catch(console.error);

    handleFetchGeoServerLayers(initialGeoServerUrl)
      .then((discovered) => {
        if (discovered) {
          setDiscoveredGeoServerLayers(discovered);
        }
      })
      .catch(console.error);
  }, [isMapReady, initialMapState, handleFetchGeoServerLayers]);

  const handleReloadDeasLayers = useCallback(async () => {
    try {
      const discovered = await handleFetchGeoServerLayers(initialGeoServerUrl);
      if (discovered) setDiscoveredGeoServerLayers(discovered);
    } catch (error) { console.error(error); }
  }, [handleFetchGeoServerLayers]);

  const osmDataHook = useOSMData({
    mapRef,
    drawingSourceRef,
    addLayer: layerManagerHook.addLayer,
    osmCategoryConfigs: osmCategoryConfig,
    onExportLayers: layerManagerHook.handleExportLayer as any,
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

  const zoomToBoundingBox = useCallback(
    (bbox: [number, number, number, number]) => {
      if (!mapRef.current) return;
      const extent4326: Extent = [bbox[0], bbox[1], bbox[2], bbox[3]];
      try {
        const extent3857 = transformExtent(extent4326, 'EPSG:4326', 'EPSG:3857');
        mapRef.current.getView().fit(extent3857, { padding: [50, 50, 50, 50], duration: 1000, maxZoom: 17 });
      } catch (error) { console.error(error); }
    },
    [mapRef]
  );

  const handleLocationSelection = useCallback(
    (location: NominatimResult) => {
      const [sLat, nLat, wLon, eLon] = location.boundingbox.map(parseFloat);
      zoomToBoundingBox([wLon, sLat, eLon, nLat]);
    },
    [zoomToBoundingBox]
  );

  const handleDeasAddLayer = useCallback(
    (layer: GeoServerDiscoveredLayer): Promise<MapLayer | null> => {
      return layerManagerHook.handleAddHybridLayer(layer.name, layer.title, initialGeoServerUrl, layer.bbox, layer.styleName);
    },
    [layerManagerHook, initialGeoServerUrl]
  );

  const handleOpenStreetView = useCallback(() => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    const center = view.getCenter();
    if (!center) return;
    const [lon, lat] = transform(center, view.getProjection(), 'EPSG:4326');
    const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;
    window.open(url, '_blank');
  }, [mapRef]);

  const handleCaptureAndDownload = useCallback(async () => {
    const dataUrl = await captureMapAsDataUrl();
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `captura_mapa_${nanoid(5)}.jpeg`;
      link.click();
    }
  }, [captureMapAsDataUrl]);

  const handleSaveUserMap = useCallback(async () => {
    if (!mapRef.current || !firestore || !user) return;
    const currentView = mapRef.current.getView();
    const mapState: MapState = {
      subject: mapSubject || 'Mapa sin título',
      view: { center: transform(currentView.getCenter() || [0,0], 'EPSG:3857', 'EPSG:4326'), zoom: currentView.getZoom() || 7 },
      baseLayerId: activeBaseLayerId,
      layers: [], // Simplificado para persistencia básica
    };
    try {
        await saveUserMap(firestore, user.uid, mapState);
        toast({ description: "Mapa guardado." });
        setIsSaveMapDialogOpen(false);
    } catch (e) { console.error(e); }
  }, [mapRef, mapSubject, activeBaseLayerId, firestore, user, toast]);

  const handleFetchUserMaps = useCallback(async () => {
    if (!firestore || !user) return;
    setIsLoadingUserMaps(true);
    try {
        const maps = await getUserMaps(firestore, user.uid);
        setUserMapsList(maps);
    } finally { setIsLoadingUserMaps(false); }
  }, [firestore, user]);

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
                <DropdownMenuItem onSelect={() => { handleFetchUserMaps(); setIsLoadMapDialogOpen(true); }} className="text-xs"><FolderOpen className="h-4 w-4 mr-2" /> Cargar mapa</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsSaveMapDialogOpen(true)} className="text-xs"><Save className="h-4 w-4 mr-2" /> Guardar mapa</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsShareDialogOpen(true)} className="text-xs"><Share2 className="h-4 w-4 mr-2" /> Compartir mapa</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleCaptureAndDownload} className="text-xs"><Camera className="h-4 w-4 mr-2" /> Capturar Imagen</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleOpenStreetView} className="text-xs"><StreetViewIcon className="h-5 w-5 mr-2" /> Abrir Street View</DropdownMenuItem>
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
        <MapView setMapInstanceAndElement={setMapInstanceAndElement} activeBaseLayerId={activeBaseLayerId} baseLayerSettings={baseLayerSettings} />
        
        <AlertDialog open={isConfirmNewMapOpen} onOpenChange={setIsConfirmNewMapOpen}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>¿Iniciar Nuevo Mapa?</AlertDialogTitle></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => { layerManagerHook.removeLayers(layerManagerHook.layers.map(l => l.id)); setIsConfirmNewMapOpen(false); }}>Confirmar</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isSaveMapDialogOpen} onOpenChange={setIsSaveMapDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Guardar Mapa</AlertDialogTitle></AlertDialogHeader>
            <Input value={mapSubject} onChange={(e) => setMapSubject(e.target.value)} placeholder="Nombre del mapa..." />
            <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleSaveUserMap}>Guardar</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
            onShowStatistics={() => {}}
            onExtractByPolygon={() => {}}
            onExtractBySelection={() => {}}
            onSelectByLayer={() => {}}
            onExportLayer={() => {}}
            onExportWmsAsGeotiff={() => {}}
            onRenameLayer={layerManagerHook.renameLayer}
            onChangeLayerStyle={layerManagerHook.changeLayerStyle}
            onChangeLayerLabels={() => {}}
            onApplyGraduatedSymbology={layerManagerHook.applyGraduatedSymbology}
            onApplyCategorizedSymbology={layerManagerHook.applyCategorizedSymbology}
            onApplyGeoTiffStyle={() => {}}
            onToggleWmsStyle={() => {}}
            onGroupLayers={() => {}}
            onToggleGroupVisibility={() => {}}
            onToggleGroupExpanded={() => {}}
            onSetGroupDisplayMode={() => {}}
            onUngroup={() => {}}
            onRenameGroup={() => {}}
            onToggleGroupPlayback={() => {}}
            onSetGroupPlaySpeed={() => {}}
            isDrawingSourceEmptyOrNotPolygon={true}
            isSelectionEmpty={featureInspectionHook.selectedFeatures.length === 0}
            onSetLayerOpacity={layerManagerHook.setLayerOpacity}
            onReorderLayers={() => {}}
            onAddLayer={layerManagerHook.addLayer}
            activeTool={featureInspectionHook.activeTool}
            onSetActiveTool={featureInspectionHook.setActiveTool}
            onClearSelection={featureInspectionHook.clearSelection}
            discoveredDeasLayers={discoveredGeoServerLayers}
            onAddDeasLayer={handleDeasAddLayer}
            isFetchingDeasLayers={isFetchingDeasLayers}
            onReloadDeasLayers={handleReloadDeasLayers}
            canUndoRemove={false}
            onUndoRemove={() => {}}
            selectedFeaturesForSelection={[]}
            isSharedView={false}
            style={{ top: `${panels.legend.position.y}px`, left: `${panels.legend.position.x}px`, zIndex: panels.legend.zIndex }}
          />
        )}
      </div>
      <Notepad />
    </div>
  );
}
