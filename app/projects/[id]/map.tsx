import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { getLocations } from "../../../lib/util";
import { useQuery } from "@tanstack/react-query";
import { ProjectLocation } from "../../../lib/types";

export default function MapScreen() {
  // Get all locations for the current project and display them on the map

  // Get all locations
  const { id: projectId } = useLocalSearchParams();
  const {
    status,
    error,
    data: locations,
  } = useQuery<ProjectLocation[]>({
    queryKey: ["locations", projectId],
    queryFn: () => getLocations(Number(projectId)),
  });

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Map Screen</Text>
      {locations?.map((location) => (
        <View key={location.id}>
          <Text>Location name: {location.location_name}</Text>
          <Text>Location coordinate: {location.location_position}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
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
