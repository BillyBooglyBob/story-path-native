import { Link } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import WebView from "react-native-webview";
import { useProject } from "../../../context/ProjectContext";

export default function ProjectDetailsScreen() {
  const projectContext = useProject();
  const { project, allLocations, visitedLocations, locationStatus, locationError } =
    projectContext || {};

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Link href="/projects">Back</Link>
      <Text>Project Title: {project?.title}</Text>
      <Text>Project Description: {project?.description}</Text>
      {/* Webviews content changes dynamically based on the location */}
      {/* <WebView style={styles.webView} originWhitelist={["*"]} /> */}
      <View>
        <Text>
          Locations visited: {visitedLocations?.length}/{allLocations?.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});
