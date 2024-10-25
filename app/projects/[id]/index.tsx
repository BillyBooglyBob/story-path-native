import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { getProject } from "../../../lib/util";
import { useQuery } from "@tanstack/react-query";
import { Project } from "../../../lib/types";
import WebView from "react-native-webview";

export default function ProjectDetailsScreen() {
  const { id: projectId } = useLocalSearchParams();

  // Retrieve project details
  const {
    status,
    error,
    data: projectData,
  } = useQuery<Project[]>({
    queryKey: ["project", projectId],
    queryFn: () => getProject(Number(projectId)),
  });

  const project = projectData?.[0];

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
