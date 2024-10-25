import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { getLocations } from "../../../lib/util";
import { useQuery } from "@tanstack/react-query";
import { ProjectLocation } from "../../../lib/types";
// import ShowMap from "../../../components/locationMap/ShowMap";
import ShowMap2 from "../../../components/locationMap/test";

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

  // console.log("locations", locations);

  // return <View>
  //   <Text>sdjlfds</Text>
  // </View>
  return <ShowMap2 locations={locations}/>;
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
