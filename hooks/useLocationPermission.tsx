import { useEffect, useState } from "react";
import * as ExpoLocation from "expo-location";
import { MapState } from "../lib/types";

export const useLocationPermission = (
  setMapState: React.Dispatch<React.SetStateAction<MapState>>
) => {
  const [permission, setPermission] = useState<boolean>(false);

  // Request the user for location permission when initialised
  useEffect(() => {
    // Request location permission
    async function requestLocationPermission() {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setPermission(true);
      }
    }
    requestLocationPermission();
    // Get current user location
    (async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let loc = await ExpoLocation.getCurrentPositionAsync({});
      setMapState((prevState) => ({
        ...prevState,
        userLocation: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      }));
    })();
  }, []);

  return permission;
};
