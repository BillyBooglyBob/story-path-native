import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import WebView from "react-native-webview";
import { useProject } from "../../../context/ProjectContext";

export default function ProjectDetailsScreen() {
  const projectContext = useProject();
  const project = projectContext?.project;

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Project Title: {project?.title}</Text>
      <Text>Project Description: {project?.description}</Text>
      {/* Webviews content changes dynamically based on the location */}
      {/* <WebView style={styles.webView} originWhitelist={["*"]} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});
