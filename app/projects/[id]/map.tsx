import { StyleSheet, Appearance } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { useProject } from "../../../context/ProjectContext";
import NearbyLocation from "../../../components/NearbyLocation";

// Get light or dark mode
const colorScheme = Appearance.getColorScheme();

export default function MapScreen() {
  // Setup state for map data
  // Retrieve user's current location
  const projectContext = useProject();
  const { locationPermission, mapState } = projectContext || {};

  if (!locationPermission || !mapState) {
    return null; // or you can return a loading spinner or some other fallback UI
  }

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
        showsUserLocation={locationPermission}
        style={styles.container}
        // customMapStyle={"dark"}
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
      <NearbyLocation nearbyLocation={mapState.nearbyLocation} />
    </>
  );
}

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
