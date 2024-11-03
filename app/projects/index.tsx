import { Link } from "expo-router";
import { SafeAreaView, Text, StyleSheet, View, FlatList } from "react-native";
import { useProjectList } from "../../context/ProjectsContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProjectsScreen() {
  const projectListContext = useProjectList();

  const { projects, status, error, participantQueries } =
    projectListContext || {};

  if (status === "pending")
    return <Text style={{ color: "white" }}>Loading...</Text>;
  if (status === "error")
    return (
      <Text style={{ color: "white" }}>
        {error?.message ?? "Error has occurred"}
      </Text>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Published Projects:</Text>
      <FlatList
        data={projects}
        keyExtractor={(project) => (project.id ?? "").toString()}
        renderItem={({ item, index }) => (
          <View>
            <Link style={styles.item} href={`/projects/${item.id}`}>
              <View style={styles.itemContent}>
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.participants}>
                    Participants:{" "}
                    {participantQueries?.[index]?.data?.[0]
                      ?.number_participants || "0"}
                  </Text>
                </View>
              </View>
            </Link>
            {projects && index < projects.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#202225",
    display: "flex",
  },
  headerText: {
    color: "#878f9a",
    fontSize: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  item: {
    padding: 10,
    marginVertical: 10,
    flex: 1,
    backgroundColor: "#4f545c",
    display: "flex",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  itemContent: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    color: "#fff",
  },
  participants: {
    color: "#878f9a",
  },
  separator: {
    borderBottomColor: "#878f9a",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
