// ProjectContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as ExpoLocation from "expo-location";
import { getDistance } from "geolib";
import {
  getProject,
  getLocations,
  getLocationsVisitedByUser,
} from "../lib/util"; // Assume these functions fetch the data
import {
  LocationTracking,
  MapState,
  Project,
  ProjectLocation,
  Location,
  UserLocation,
} from "../lib/types";
import { HOMESCREEN_DISPLAY_OPTIONS } from "../lib/constants";
import { useUser } from "./UserContext";

// Define the shape of your context
interface ProjectContextType {
  project: Project | undefined;
  projectStatus: "error" | "success" | "pending";
  projectError: Error | null;
  allLocations: ProjectLocation[] | undefined;
  visitedLocations: ProjectLocation[] | undefined;
  locationStatus: "error" | "success" | "pending";
  locationError: Error | null;
  mapState: MapState;
}
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
  // Retrieve project details
  const {
    status: projectStatus,
    error: projectError,
    data: projectData,
  } = useQuery<Project[]>({
    queryKey: ["project", projectId],
    queryFn: () => getProject(Number(projectId)),
  });

  const project = projectData?.[0];

  // Retrieve project locations
  const {
    status: locationStatus,
    error: locationError,
    data: locationsData,
  } = useQuery<ProjectLocation[]>({
    queryKey: ["locations", projectId],
    queryFn: () => getLocations(Number(projectId)),
  });

  // Retrieve locations visited by the user
  const { data: visitedLocationIdsData } = useQuery<LocationTracking[]>({
    queryKey: ["locationsVisited", username],
    queryFn: () => getLocationsVisitedByUser(Number(projectId), username ?? ""),
  });

  // GET LOCATIONS DATA
  const allLocations = locationsData;
  let visitedLocations: ProjectLocation[] | undefined = [];
  let visibleLocations: ProjectLocation[] | undefined = [];

  // Get visited locations
  visitedLocations = locationsData?.filter((location) => {
    return visitedLocationIdsData?.some(
      (visitedLocationId) => visitedLocationId.location_id === location.id
    );
  });

  // Get visible locations based on project setting
  project?.homescreen_display === HOMESCREEN_DISPLAY_OPTIONS.allLocations
    ? (visibleLocations = allLocations)
    : (visibleLocations = visitedLocations);

  // Map has two options
  // 1. Show all locations
  // 2. Show only visited locations

  // Preview shows only visited locations and all locations

  // Filter locations based on project setting
  // Either show all locations or only visited locations
  // let locationsVisited = locations;
  // if (project?.homescreen_display !== HOMESCREEN_DISPLAY_OPTIONS.allLocations) {
  //   // Filter for locations visited by the user only
  //   locationsVisited = locationsVisited?.filter((location) => {
  //     return locationsVisitedData?.some(
  //       (visitedLocation) => visitedLocation.location_id === location.id
  //     );
  //   });
  // }

  // Keep track of the geographical info of the user and project
  const initialMapState = {
    locationPermission: false,
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

  // Function to retrieve location nearest to current user location
  function calculateDistance(userLocation: UserLocation): Location {
    const nearestLocations = mapState.locations
      .map((location) => {
        const metres = getDistance(userLocation, location.coordinates);
        location["distance"] = {
          metres: metres,
          nearby: metres <= 100 ? true : false,
        };
        return location;
      })
      .sort((previousLocation, thisLocation) => {
        return previousLocation.distance.metres - thisLocation.distance.metres;
      });
    return (
      nearestLocations.shift() || {
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
      }
    );
  }

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

  // Request the user for location permission
  // Get current user location
  useEffect(() => {
    // Request location permission
    async function requestLocationPermission() {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setMapState((prevState) => ({
          ...prevState,
          locationPermission: true,
        }));
      }
    }
    requestLocationPermission();
  }, []);

  // Update user location and nearest location
  useEffect(() => {
    let locationSubscription: ExpoLocation.LocationSubscription | null = null;

    // Ensure location permission and locations data are available
    if (mapState.locationPermission && mapState.locations.length > 0) {
      (async () => {
        // Get the initial user location and set nearbyLocation on first load
        // const location = await ExpoLocation.getCurrentPositionAsync({});
        // const userLocation = {
        //   latitude: location.coords.latitude,
        //   longitude: location.coords.longitude,
        //   longitudeDelta: mapState.userLocation.longitudeDelta,
        //   latitudeDelta: mapState.userLocation.latitudeDelta,
        // };

        // // Calculate the nearest location
        // const nearbyLocation = calculateDistance(userLocation);
        // setMapState((prevState) => ({
        //   ...prevState,
        //   userLocation,
        //   nearbyLocation,
        // }));

        // Start watching the user's position
        locationSubscription = await ExpoLocation.watchPositionAsync(
          {
            accuracy: ExpoLocation.Accuracy.High,
            distanceInterval: 10, // in meters
          },
          (location) => {
            const updatedUserLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              longitudeDelta: mapState.userLocation.longitudeDelta,
              latitudeDelta: mapState.userLocation.latitudeDelta,
            };
            const updatedNearbyLocation =
              calculateDistance(updatedUserLocation);
            setMapState((prevState) => ({
              ...prevState,
              userLocation: updatedUserLocation,
              nearbyLocation: updatedNearbyLocation,
            }));
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
  }, [mapState.locationPermission, mapState.locations]);

  // Pass both project and locations data along with their status/error info
  const contextValue = {
    project,
    projectStatus,
    projectError,
    allLocations,
    visitedLocations,
    locationStatus,
    locationError,
    mapState,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}
