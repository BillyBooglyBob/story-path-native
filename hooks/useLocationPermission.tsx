import { useEffect, useState } from "react";
import * as ExpoLocation from "expo-location";

export const useLocationPermission = () => {
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
  }, []);

  return permission;
};
