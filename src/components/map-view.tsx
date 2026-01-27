"use client";

import * as React from "react";
import type { Feature, FeatureCollection, Polygon } from "@turf/turf";
import {
  Map,
  useMap,
  AdvancedMarker,
  InfoWindow,
  Polygon as GoogleMapPolygon,
  Data,
} from "@vis.gl/react-google-maps";
import { type LayerId } from "@/lib/map-data";
import { Info } from "lucide-react";

type MapViewProps = {
  pointsOfInterest: FeatureCollection;
  parkAreas: FeatureCollection;
  analysisResult: FeatureCollection<Polygon> | null;
  visibleLayers: Set<LayerId>;
  onFeatureClick: (feature: Feature) => void;
  onBoundsChanged: (bounds: string | null) => void;
};

export function MapView({
  pointsOfInterest,
  parkAreas,
  analysisResult,
  visibleLayers,
  onFeatureClick,
  onBoundsChanged,
}: MapViewProps) {
  const map = useMap();
  const [selectedMarker, setSelectedMarker] = React.useState<Feature | null>(
    null
  );

  React.useEffect(() => {
    if (!map) return;
    const listener = map.addListener("bounds_changed", () => {
      const bounds = map.getBounds();
      onBoundsChanged(bounds ? bounds.toUrlValue() : null);
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, onBoundsChanged]);
  
  React.useEffect(() => {
    if (map && analysisResult?.features?.[0]) {
      const bounds = new google.maps.LatLngBounds();
      const feature = analysisResult.features[0];
      if (feature.geometry) {
         feature.geometry.coordinates[0].forEach(coord => {
           bounds.extend(new google.maps.LatLng(coord[1], coord[0]));
         });
         map.fitBounds(bounds);
      }
    }
  }, [analysisResult, map]);

  return (
    <>
      <Map
        defaultCenter={{ lat: 40.7128, lng: -74.006 }}
        defaultZoom={11}
        mapId="a3a79d3b24aa19f"
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        style={{ width: "100%", height: "100%" }}
      >
        {visibleLayers.has("points-of-interest") &&
          pointsOfInterest.features.map((feature) => (
            <AdvancedMarker
              key={feature.id}
              position={{
                lat: (feature.geometry as any).coordinates[1],
                lng: (feature.geometry as any).coordinates[0],
              }}
              onClick={() => {
                onFeatureClick(feature);
                setSelectedMarker(feature);
              }}
            >
              <div className="w-5 h-5 bg-primary rounded-full border-2 border-white shadow-md"></div>
            </AdvancedMarker>
          ))}

        {visibleLayers.has("park-areas") && (
          <Data
            featureCollection={parkAreas}
            style={(feature) => ({
              fillColor: "green",
              strokeColor: "darkgreen",
              strokeWeight: 1,
              fillOpacity: 0.3,
            })}
            onClick={(e) => onFeatureClick(e.feature)}
          />
        )}
        
        {visibleLayers.has("analysis-result") && analysisResult && (
           <Data
            featureCollection={analysisResult}
            style={(feature) => ({
              fillColor: "#228B22",
              strokeColor: "#006400",
              strokeWeight: 2,
              fillOpacity: 0.5,
            })}
            onClick={(e) => onFeatureClick(e.feature)}
          />
        )}

      </Map>

      {selectedMarker && (
        <InfoWindow
          position={{
            lat: (selectedMarker.geometry as any).coordinates[1],
            lng: (selectedMarker.geometry as any).coordinates[0],
          }}
          onCloseClick={() => setSelectedMarker(null)}
          pixelOffset={new google.maps.Size(0, -20)}
        >
          <div className="p-2">
            <h3 className="font-bold flex items-center gap-2"><Info className="w-4 h-4"/>{selectedMarker.properties?.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedMarker.properties?.type}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
