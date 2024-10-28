// ProjectContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import * as ExpoLocation from "expo-location";
import { calculateDistance } from "../lib/util"; // Assume these functions fetch the data
import { MapState, Project, ProjectLocation, Location } from "../lib/types";
import { HOMESCREEN_DISPLAY_OPTIONS } from "../lib/constants";
import { useUser } from "./UserContext";
import { useProjectData } from "../hooks/useProjectData";
import { useLocationPermission } from "../hooks/useLocationPermission";
import { UseMutationResult } from "@tanstack/react-query";

// Define the shape of your context
type ProjectContextType = {
  project: Project | undefined;
  projectStatus: "error" | "success" | "pending";
  projectError: Error | null;
  allLocations: ProjectLocation[] | undefined;
  visitedLocations: ProjectLocation[] | undefined;
  locationStatus: "error" | "success" | "pending";
  locationError: Error | null;
  mapState: MapState;
  locationPermission: boolean;
  locationOverlay: {
    newLocationVisited: {
      newLocationVisited: boolean;
      newLocation: ProjectLocation;
    };
    setNewLocationVisited: (location: Location) => void;
    setLocationAlreadyVisited: () => void;
  };
};
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => useContext(ProjectContext);

export function ProjectProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const userContext = useUser();
  const username = userContext?.userState.username;

  // Create additional state to manage location tracking and
  // set locationVisit to true, so it overlays over the entire screen
  // and another button to close the overlay
  const [newLocationVisited, setLocationVisited] = useState({
    newLocationVisited: false,
    newLocation: {} as ProjectLocation,
  });

  // Location not visited yet, set it as visited
  const setNewLocationVisited = (location: Location) => {
    // Extract location content for the new location
    const locationContent = locationQuery.data?.find(
      (loc) => loc.id === location.id
    );
    setLocationVisited({
      newLocationVisited: true,
      newLocation: locationContent ?? ({} as ProjectLocation),
    });

    // Call the mutation function to mark the location as visited
    setLocationVisitedMutation.mutate(location);
  };

  // location visited already, set it as false
  const setLocationAlreadyVisited = () => {
    setLocationVisited({
      newLocationVisited: false,
      newLocation: {} as ProjectLocation,
    });
  };

  const locationOverlay = {
    newLocationVisited,
    setNewLocationVisited,
    setLocationAlreadyVisited,
  };

  // RETRIEVE DATA FROM API
  const {
    projectQuery,
    locationQuery,
    locationTrackingQuery,
    setLocationVisitedMutation,
  } = useProjectData(Number(projectId), username || "");

  // GET LOCATIONS DATA
  const allLocations = locationQuery.data;
  let visitedLocations: ProjectLocation[] | undefined = [];
  let visibleLocations: ProjectLocation[] | undefined = [];

  // Get visited locations
  const visitedLocationIds = locationTrackingQuery.data;
  visitedLocations = allLocations?.filter((location) => {
    return visitedLocationIds?.some(
      (visitedLocationId) => visitedLocationId.location_id === location.id
    );
  });

  // Get visible locations based on project setting
  const project = projectQuery.data?.[0];
  project?.homescreen_display === HOMESCREEN_DISPLAY_OPTIONS.allLocations
    ? (visibleLocations = allLocations)
    : (visibleLocations = visitedLocations);

  // Keep track of the geographical info of the user and project
  // Request the user for location permission when initialised
  const locationPermission = useLocationPermission();

  const initialMapState = {
    locations: [],
    userLocation: {
      latitude: 0,
      longitude: 0,
      longitudeDelta: 0.01,
      latitudeDelta: 0.01,
    },
    nearbyLocation: {
      id: 0,
      location: "",
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
      distance: {
        metres: 0,
        nearby: false,
      },
    },
  };

  const [mapState, setMapState] = useState<MapState>(initialMapState);

  // Update the mapState when the locations data from the API changes
  useEffect(() => {
    if (visibleLocations) {
      // Convert string-based latlong to object-based on each location
      const updatedLocations: Location[] = visibleLocations.map((location) => {
        const [x, y] = location.location_position
          .replace(/[()]/g, "")
          .split(",")
          .map(Number);

        return {
          coordinates: {
            latitude: x,
            longitude: y,
          },
          id: location.id ?? 0,
          location: location.location_name,
          distance: {
            metres: 0,
            nearby: false,
          },
        };
      });

      setMapState((prevState) => {
        return {
          ...prevState,
          locations: updatedLocations,
        };
      });
    }
  }, [visibleLocations]);

  // Update user location and nearest location
  useEffect(() => {
    let locationSubscription: ExpoLocation.LocationSubscription | null = null;

    // Ensure location permission and locations data are available
    if (locationPermission && mapState.locations.length > 0) {
      (async () => {
        // Start watching the user's position
        locationSubscription = await ExpoLocation.watchPositionAsync(
          {
            accuracy: ExpoLocation.Accuracy.High,
            distanceInterval: 10, // in meters
            timeInterval: 5000, // in milliseconds
          },
          (location) => {
            const updatedUserLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              longitudeDelta: mapState.userLocation.longitudeDelta,
              latitudeDelta: mapState.userLocation.latitudeDelta,
            };

            const updatedNearbyLocation = calculateDistance(
              updatedUserLocation,
              mapState.locations
            );

            setMapState((prevState) => ({
              ...prevState,
              userLocation: updatedUserLocation,
              nearbyLocation: updatedNearbyLocation,
            }));

            console.log("User location updated", updatedUserLocation);
            console.log("Nearby location updated", updatedNearbyLocation);

            // Check if user is within radius of nearby location
            // If so, mark location as visited if it is not visited already
            if (mapState.nearbyLocation.distance.nearby) {
              console.log("Within radius of nearby location!");
              // Mark location as visited if it is not visited already
              if (
                !visitedLocations?.some(
                  (location) => location.id === mapState.nearbyLocation.id
                )
              ) {
                console.log("Location not visited yet!");
                // Mark location as visited
                locationOverlay.setNewLocationVisited(mapState.nearbyLocation);
              }
            }
          }
        );
      })();
    }

    // Cleanup function to remove the subscription
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationPermission, mapState.locations]);

  // Pass both project and locations data along with their status/error info
  const contextValue = {
    project: projectQuery.data?.[0],
    projectStatus: projectQuery.status,
    projectError: projectQuery.error,
    allLocations: locationQuery.data,
    visitedLocations,
    locationStatus: locationQuery.status,
    locationError: locationQuery.error,
    mapState,
    locationPermission,
    locationOverlay,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}
