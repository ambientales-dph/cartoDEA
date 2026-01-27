import type { FeatureCollection } from "@turf/turf";

export type LayerId = "points-of-interest" | "park-areas" | "analysis-result";

export const pointsOfInterest: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "poi-1",
      properties: {
        name: "Statue of Liberty",
        type: "Landmark",
        established: 1886,
      },
      geometry: { type: "Point", coordinates: [-74.0445, 40.6892] },
    },
    {
      type: "Feature",
      id: "poi-2",
      properties: {
        name: "Empire State Building",
        type: "Skyscraper",
        height_m: 443.2,
      },
      geometry: { type: "Point", coordinates: [-73.9857, 40.7484] },
    },
    {
      type: "Feature",
      id: "poi-3",
      properties: {
        name: "Times Square",
        type: "Tourist Attraction",
        description: "Major commercial intersection and tourist destination.",
      },
      geometry: { type: "Point", coordinates: [-73.9851, 40.758] },
    },
  ],
};

export const parkAreas: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "park-1",
      properties: {
        name: "Central Park",
        area_acres: 843,
        borough: "Manhattan",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.9818, 40.768],
            [-73.958, 40.8005],
            [-73.9493, 40.7968],
            [-73.973, 40.7643],
            [-73.9818, 40.768],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "park-2",
      properties: {
        name: "Prospect Park",
        area_acres: 526,
        borough: "Brooklyn",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.972, 40.665],
            [-73.96, 40.667],
            [-73.963, 40.65,],
            [-73.975, 40.655],
            [-73.972, 40.665]
          ]
        ]
      }
    }
  ],
};
