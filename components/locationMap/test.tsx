import React, { useState, useEffect } from "react";
import { StyleSheet, Appearance, View, SafeAreaView, Text } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { ProjectLocation } from "../../lib/types";

// import { locations } from "./location.js";

// Define Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nearbyLocationSafeAreaView: {
    backgroundColor: "black",
  },
  nearbyLocationView: {
    padding: 20,
  },
  nearbyLocationText: {
    color: "white",
    lineHeight: 25,
  },
});

// Get light or dark mode
const colorScheme = Appearance.getColorScheme();

// Component for displaying nearest location and whether it's within 100 metres
// Add change scoring here
function NearbyLocation2(props) {
  if (typeof props.location != "undefined") {
    return (
      <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
        <View style={styles.nearbyLocationView}>
          <Text style={styles.nearbyLocationText}>{props.location}</Text>
          {props.distance.nearby && (
            <Text
              style={{
                ...styles.nearbyLocationText,
                fontWeight: "bold",
              }}
            >
              Within 100 Metres!
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default function ShowMap2({locations}) {
  // console.log("locations", locations);
  // Convert string-based latlong to object-based on each location
  const updatedLocations = locations.map((location) => {
    const [x, y] = location.location_position.replace(/[()]/g, '').split(',').map(Number);

    return {
      coordinates: {
        latitude: x,
        longitude: y,
      },
      id: location.id,
      location: location.location_name,
      distance: {
        metres: 0,
        nearby: false,
      }
    }
  });

  // console.log("updatedLocations", updatedLocations);
  console.log("Hello")

  // Setup state for map data
  // Retrieve user's current location
  const initialMapState = {
    locationPermission: false,
    locations: updatedLocations,
    userLocation: {
      latitude: 0,
      longitude: 0,
      longitudeDelta: 0.01,
      latitudeDelta: 0.01,
    },
    nearbyLocation: {},
  };
  const [mapState, setMapState] = useState(initialMapState);
  const [errorMsg, setErrorMsg] = useState(null);

  console.log("colorScheme", colorScheme);

  // Request the user for location permission
  // Get current user location
  useEffect(() => {
    // Request location permission
    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setMapState((prevState) => ({
          ...prevState,
          locationPermission: true,
        }));
      }
    }
    requestLocationPermission();

    // Get current user location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setMapState((prevState) => ({
        ...prevState,
        userLocation: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
      }));
    })();
  }, []);

  useEffect(() => {
    // Function to retrieve location nearest to current user location
    function calculateDistance(userLocation) {
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
          return (
            previousLocation.distance.metres - thisLocation.distance.metres
          );
        });
      return nearestLocations.shift();
    }

    let locationSubscription = null;

    if (mapState.locationPermission) {
      (async () => {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // in meters
          },
          (location) => {
            const userLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            const nearbyLocation = calculateDistance(userLocation);
            setMapState((prevState) => ({
              ...prevState,
              userLocation,
              nearbyLocation: nearbyLocation,
            }));
          }
        );
      })();
    }

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [mapState.locationPermission]);

  return (
    <>
      <MapView
        camera={{
          center: mapState.userLocation,
          pitch: 0, // Angle of 3D map
          heading: 0, // Compass direction
          altitude: 3000, // Zoom level for iOS
          zoom: 15, // Zoom level For Android
        }}
        showsUserLocation={mapState.locationPermission}
        style={styles.container}
        // customMapStyle={"dark"}
        initialRegion={mapState.userLocation}
      >
        <Marker
          coordinate={{
            latitude: mapState.userLocation.latitude,
            longitude: mapState.userLocation.longitude,
          }}
          title="UQ St Lucia Campus"
          description="University of Queensland, St Lucia Campus"
        />
        {mapState.locations.map((location) => (
          <Circle
            key={location.id}
            center={location.coordinates}
            radius={100}
            strokeWidth={3}
            strokeColor="#A42DE8"
            fillColor={
              colorScheme == "dark"
                ? "rgba(128,0,128,0.5)"
                : "rgba(210,169,210,0.5)"
            }
          />
        ))}
      </MapView>
      {/* If current nearby location is within 100m of user, will say so */}
      <NearbyLocation2 {...mapState.nearbyLocation} />
    </>
  );
}
