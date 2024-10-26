import { StyleSheet, Text } from "react-native";
import ShowMap from "../../../components/locationMap"
import { useProject } from "../../../context/ProjectContext";

export default function MapScreen() {
  // Get all locations for the current project and display them on the map 
  const projectContext = useProject();
  const {locations, locationStatus, locationError} = projectContext || {};

  if (locationStatus === "pending") {
    return <Text>Loading...</Text>;
  }

  if (locationStatus === "error") {
    return <Text>Error: {locationError?.message ?? "Error has occurred"}</Text>;
  }

  return <ShowMap locations={locations ?? []}/>;
}

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
