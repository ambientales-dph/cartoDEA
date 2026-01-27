"use client";

import * as React from "react";
import type { Feature, FeatureCollection, Point, Polygon } from "@turf/turf";
import { buffer } from "@turf/turf";
import {
  Layers,
  Beaker,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Info,
} from "lucide-react";

import { APIProvider } from "@vis.gl/react-google-maps";
import { getFeatureSuggestions } from "@/app/actions";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CartoLogo } from "@/components/carto-logo";
import { MapView } from "@/components/map-view";
import { parkAreas, pointsOfInterest, type LayerId } from "@/lib/map-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type Suggestion = {
  suggestedFeatures: string[];
  reasoning: string;
};

export default function Home() {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);

  // State Management
  const [visibleLayers, setVisibleLayers] = React.useState<Set<LayerId>>(
    new Set(["points-of-interest"])
  );
  const [mapBounds, setMapBounds] = React.useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] =
    React.useState<Feature | null>(null);
  const [analysisResult, setAnalysisResult] =
    React.useState<FeatureCollection<Polygon> | null>(null);

  // AI Suggestion State
  const [isSuggestionModalOpen, setSuggestionModalOpen] =
    React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [userPreferences, setUserPreferences] = React.useState("");
  const [suggestionResult, setSuggestionResult] =
    React.useState<Suggestion | null>(null);

  React.useEffect(() => setIsMounted(true), []);

  const toggleLayer = (layerId: LayerId) => {
    setVisibleLayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
  };

  const runBufferAnalysis = () => {
    if (selectedFeature && selectedFeature.geometry.type === "Point") {
      const buffered = buffer(selectedFeature as Feature<Point>, 1, {
        units: "kilometers",
      });
      setAnalysisResult({
        type: "FeatureCollection",
        features: [buffered],
      });
      setVisibleLayers((prev) => new Set(prev).add("analysis-result"));
      toast({
        title: "Analysis Complete",
        description: "Buffer analysis successfully performed.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Please select a point feature on the map to buffer.",
      });
    }
  };

  const handleGenerateSuggestion = async () => {
    if (!mapBounds) {
      toast({
        variant: "destructive",
        title: "Map Error",
        description: "Could not determine map's current view.",
      });
      return;
    }
    setIsGenerating(true);
    setSuggestionResult(null);
    try {
      const result = await getFeatureSuggestions({
        currentView: mapBounds,
        selectedDataLayers: Array.from(visibleLayers),
        userPreferences: userPreferences,
      });
      setSuggestionResult(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "An error occurred while generating suggestions.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isMounted) {
    return null;
  }
  
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      solutionChannel="GMP_visgl_rgm_firebase_studio_v1"
    >
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <CartoLogo className="size-7 text-primary" />
                <span className="text-lg font-semibold font-headline">
                  CartoDEA
                </span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center gap-2">
                    <Layers />
                    Data Layers
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="flex items-center justify-between space-x-2 p-2">
                      <Label htmlFor="points-of-interest">
                        Points of Interest
                      </Label>
                      <Switch
                        id="points-of-interest"
                        checked={visibleLayers.has("points-of-interest")}
                        onCheckedChange={() => toggleLayer("points-of-interest")}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2 p-2">
                      <Label htmlFor="park-areas">Park Areas</Label>
                      <Switch
                        id="park-areas"
                        checked={visibleLayers.has("park-areas")}
                        onCheckedChange={() => toggleLayer("park-areas")}
                      />
                    </div>
                    {analysisResult && (
                      <div className="flex items-center justify-between space-x-2 p-2">
                        <Label
                          htmlFor="analysis-result"
                          className="text-accent-foreground"
                        >
                          Analysis Result
                        </Label>
                        <Switch
                          id="analysis-result"
                          checked={visibleLayers.has("analysis-result")}
                          onCheckedChange={() =>
                            toggleLayer("analysis-result")
                          }
                        />
                      </div>
                    )}
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center gap-2">
                    <Beaker />
                    Geospatial Analysis
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="p-2">
                      <Button
                        className="w-full"
                        onClick={runBufferAnalysis}
                        variant="outline"
                      >
                        Buffer Selected Point
                      </Button>
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center gap-2">
                    <Sparkles />
                    AI Suggestions
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="p-2">
                      <Button
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => {
                          setSuggestionResult(null);
                          setUserPreferences("");
                          setSuggestionModalOpen(true);
                        }}
                      >
                        Suggest Features
                      </Button>
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted">
                    <Avatar className="h-8 w-8">
                       {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium">Jane Doe</span>
                      <span className="text-xs text-muted-foreground">
                        jane.doe@example.com
                      </span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" side="top">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-12 items-center border-b bg-background/50 px-4 backdrop-blur-sm">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-lg font-semibold ml-2 md:ml-0 font-headline">Map View</h1>
            </header>
            <main className="flex-1 relative">
              <MapView
                pointsOfInterest={pointsOfInterest}
                parkAreas={parkAreas}
                analysisResult={analysisResult}
                visibleLayers={visibleLayers}
                onFeatureClick={handleFeatureClick}
                onBoundsChanged={setMapBounds}
              />
              {selectedFeature && (
                <Card className="absolute bottom-4 right-4 w-80 max-w-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info /> Feature Properties</CardTitle>
                    <CardDescription>
                      {selectedFeature.properties?.name ||
                        `ID: ${selectedFeature.id}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <pre className="text-xs p-2 bg-muted rounded-md overflow-auto">
                        {JSON.stringify(selectedFeature.properties, null, 2)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <Dialog
        open={isSuggestionModalOpen}
        onOpenChange={setSuggestionModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AI-Powered Feature Suggestions</DialogTitle>
            <DialogDescription>
              Describe your interests, and our AI will suggest relevant
              features to display on the map.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="preferences" className="text-right">
                Preferences
              </Label>
              <Input
                id="preferences"
                value={userPreferences}
                onChange={(e) => setUserPreferences(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 'family-friendly activities'"
              />
            </div>
          </div>
          {suggestionResult && (
            <Card>
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-sm">Suggested Features:</h4>
                <ul className="list-disc pl-5 mt-1 text-sm">
                  {suggestionResult.suggestedFeatures.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <h4 className="font-semibold text-sm mt-4">Reasoning:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {suggestionResult.reasoning}
                </p>
              </CardContent>
            </Card>
          )}
          <DialogFooter>
            <Button
              onClick={handleGenerateSuggestion}
              disabled={isGenerating}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </APIProvider>
  );
}
