import { Link } from "expo-router";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { useUser } from "../../UserContext";
import { getProjectParticipantsCount, getProjects } from "../../lib/util";
import { Project, ProjectParticipantsCount } from "../../lib/types";
import { useQueries, useQuery } from "@tanstack/react-query";

export default function ProjectsScreen() {
  const { userState } = useUser();
  const {
    status,
    error,
    data: projects,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const participantQueries = useQueries({
    queries: (projects || []).map((project) => ({
      queryKey: ["participants", project.id],
      queryFn: () => getProjectParticipantsCount(project.id!),
      enabled: !!project.id, // Only run if the project has an ID
    })),
  });

  if (status === "pending")
    return <Text style={{ color: "white" }}>Loading...</Text>;
  if (status === "error")
    return <Text style={{ color: "white" }}>{error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {projects?.map((project, index) => {
        const participantQuery = participantQueries[index];
        const participantsCount =
          participantQuery?.data?.[0]?.number_participants || "0";

        return (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <View style={styles.projectRow}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <View style={styles.participantsBubble}>
                <Text style={styles.participantsText}>{participantsCount}</Text>
              </View>
            </View>
          </Link>
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a1a", // Dark background for the screen
  },
  headerText: {
    color: "#fff", // White text for contrast
    fontSize: 22,
    marginBottom: 20,
  },
  projectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333", // Dark gray background for rows
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  projectTitle: {
    color: "#fff", // White text for contrast
    fontSize: 18,
    flex: 1,
  },
  projectDescription: {
    color: "#aaa", // Lighter gray for description
    fontSize: 14,
    flex: 2,
    paddingRight: 10,
  },
  participantsBubble: {
    backgroundColor: "#f08d49", // Bubble color (you can change this)
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
  },
  participantsText: {
    color: "#fff", // White text for the bubble
    fontWeight: "bold",
    fontSize: 16,
  },
});
