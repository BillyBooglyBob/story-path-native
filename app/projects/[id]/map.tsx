import { StyleSheet, Appearance, SafeAreaView, Text } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { useProject } from "../../../context/ProjectContext";
import NearbyLocation from "../../../components/NearbyLocation";
import LocationPopUp from "../../../components/LocationPopUp";

// Get light or dark mode
const colorScheme = Appearance.getColorScheme();

export default function MapScreen() {
  // Setup state for map data
  // Retrieve user's current location
  const projectContext = useProject();
  const {
    locationPermission,
    mapState,
    locationOverlay,
    updatedLocations,
    userCenter,
  } = projectContext || {};

  if (!locationPermission || !mapState) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Map not available</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <MapView
        camera={{
          center: userCenter ?? { latitude: 0, longitude: 0 },
          pitch: 0, // Angle of 3D map
          heading: 0, // Compass direction
          altitude: 3000, // Zoom level for iOS
          zoom: 15, // Zoom level For Android
        }}
        showsUserLocation={locationPermission}
        style={styles.container}
        customMapStyle={DARK_MAP_STYLE}
        initialRegion={mapState.userLocation}
      >
        <Marker
          coordinate={{
            latitude: mapState.userLocation.latitude,
            longitude: mapState.userLocation.longitude,
          }}
          title="You are here"
          description="Your current location"
        />
        {updatedLocations &&
          updatedLocations.map((location) => (
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
      <NearbyLocation nearbyLocation={mapState.nearbyLocation} />
      {locationOverlay?.newLocationVisited.newLocationVisited && (
        <LocationPopUp />
      )}
    </>
  );
}

// Define Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorScheme === "dark" ? "#1c1c1e" : "#f9f9f9",
  },
  fallbackText: {
    fontSize: 18,
    color: colorScheme === "dark" ? "#ffffff" : "#333333",
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

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];
