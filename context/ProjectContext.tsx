// ProjectContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as ExpoLocation from "expo-location";
import { calculateDistance } from "../lib/util"; // Assume these functions fetch the data
import {
  MapState,
  Project,
  ProjectLocation,
  Location,
  LocationTracking,
  UserLocation,
} from "../lib/types";
import {
  HOMESCREEN_DISPLAY_OPTIONS,
  LOCATION_TRIGGER_OPTIONS,
  SCORING_OPTIONS,
} from "../lib/constants";
import { useUser } from "./UserContext";
import { useProjectData } from "../hooks/useProjectData";
import { useLocationPermission } from "../hooks/useLocationPermission";

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
  updatedLocations: Location[];
  locationPermission: boolean;
  locationOverlay: {
    newLocationVisited: {
      newLocationVisited: boolean;
      newLocation: ProjectLocation;
    };
    setNewLocationVisited: (
      location: ProjectLocation,
      locationScored: boolean
    ) => void;
    setLocationAlreadyVisited: () => void;
  };
  userScore: number;
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

  // RETRIEVE DATA FROM API
  const {
    projectQuery,
    locationQuery,
    locationTrackingQuery,
    setLocationVisitedMutation,
  } = useProjectData(Number(projectId), username || "");

  // Check if the useEffect to get userLocation has run at least once
  const [hasRunOnce, setHasRunOnce] = useState(false);

  // GET LOCATIONS DATA
  const allLocations = locationQuery.data;

  // Get visited locations
  const visitedLocationIds = locationTrackingQuery.data;

  // Get user score
  const userScore =
    visitedLocationIds?.reduce((acc, location) => {
      return acc + location.points;
    }, 0) ?? 0;

  const visitedLocations = allLocations?.filter((location) => {
    return visitedLocationIds?.some(
      (visitedLocationId) => visitedLocationId.location_id === location.id
    );
  });

  const visibleLocations = useMemo(() => {
    const project = projectQuery.data?.[0];
    return project?.homescreen_display ===
      HOMESCREEN_DISPLAY_OPTIONS.allLocations
      ? allLocations
      : visitedLocations;
  }, [projectQuery.data, allLocations, visitedLocations]);

  // Convert location from string format into format usable by the map
  const updatedLocations: Location[] = useMemo(() => {
    return (visibleLocations ?? []).map((location) => {
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
  }, [visibleLocations]);

  // Create additional state to manage location tracking and
  // set locationVisit to true, so it overlays over the entire screen
  // and another button to close the overlay
  const [newLocationVisited, setLocationVisited] = useState({
    newLocationVisited: false,
    newLocation: {} as ProjectLocation,
  });

  // Location not visited yet, set it as visited
  const setNewLocationVisited = (
    location: ProjectLocation,
    locationScored: boolean
  ) => {
    // Extract location content for the new location
    setLocationVisited({
      newLocationVisited: true,
      newLocation: location ?? ({} as ProjectLocation),
    });

    // Call the mutation function to mark the location as visited
    setLocationVisitedMutation.mutate({ location, locationScored });
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

  // Keep track of the geographical info of the user and project
  // Request the user for location permission when initialised

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

  const locationPermission = useLocationPermission(setMapState);

  // Update user location and nearest location
  useEffect(() => {
    let locationSubscription: ExpoLocation.LocationSubscription | null = null;

    // Ensure location permission and locations data are available
    if (locationPermission && (!hasRunOnce || updatedLocations.length > 0)) {
      (async () => {
        console.log("\n\nSUBSCRIPTION\n\n");
        // Start watching the user's position
        locationSubscription = await ExpoLocation.watchPositionAsync(
          {
            accuracy: ExpoLocation.Accuracy.Balanced,
            distanceInterval: 10, // in meters
            timeInterval: 5000, // in milliseconds
          },
          (location) => {
            const updatedUserLocation: UserLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              longitudeDelta: mapState.userLocation.longitudeDelta,
              latitudeDelta: mapState.userLocation.latitudeDelta,
            };

            const updatedNearbyLocation = calculateDistance(
              updatedUserLocation,
              updatedLocations
            );

            console.log("Calculating nearby again");

            // Only update the mapState when the locations change
            if (
              !(
                mapState.nearbyLocation === updatedNearbyLocation &&
                mapState.userLocation === updatedUserLocation
              )
            ) {
              console.log(
                `Nearby Location: \n old: ${mapState.nearbyLocation.coordinates.latitude}, ${mapState.nearbyLocation.coordinates.longitude} \n new: ${updatedNearbyLocation.coordinates.latitude}, ${updatedNearbyLocation.coordinates.longitude}`
              );
              console.log(
                `User Location: \n old: ${mapState.userLocation.latitude}, ${mapState.userLocation.longitude} \n new: ${updatedUserLocation.latitude}, ${updatedUserLocation.longitude}`
              );

              setMapState((prevState) => ({
                ...prevState,
                userLocation: updatedUserLocation,
                nearbyLocation: updatedNearbyLocation,
              }));

              console.log(
                `Locations updated: userLocation - ${mapState.userLocation.latitude}, ${mapState.userLocation.longitude}, nearbyLocation - ${mapState.nearbyLocation.coordinates.latitude}, ${mapState.nearbyLocation.coordinates.longitude}`
              );
            }
          }
        );

        // Ensure the effect is run at least once
        setHasRunOnce(true);
      })();
    }

    // Cleanup function to remove the subscription
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationPermission, updatedLocations]);

  // Check if user is within radius of nearby location
  // If so, mark location as visited if it is not visited already
  useEffect(() => {
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
        const locationToVisit = allLocations?.find((location) => {
          return location.id === mapState.nearbyLocation.id;
        });

        if (locationToVisit) {
          // Check if project allows scoring by visiting location
          const locationScored =
            projectQuery.data?.[0].participant_scoring ===
            SCORING_OPTIONS.locations;

          locationOverlay.setNewLocationVisited(
            locationToVisit,
            locationScored
          );
        }
      }
    }
  }, [mapState.nearbyLocation, mapState.userLocation, updatedLocations]);

  // Pass both project and locations data along with their status/error info
  const contextValue = {
    project: projectQuery.data?.[0],
    projectStatus: projectQuery.status,
    projectError: projectQuery.error,
    allLocations: locationQuery.data,
    visitedLocations,
    locationStatus: locationQuery.status,
    locationError: locationQuery.error,
    userScore,
    mapState,
    updatedLocations,
    locationPermission,
    locationOverlay,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}
