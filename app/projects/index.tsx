import { Link } from "expo-router";
import { SafeAreaView, Text, StyleSheet, View, FlatList } from "react-native";
import { useProjectList } from "../../context/ProjectsContext";

export default function ProjectsScreen() {
  const projectListContext = useProjectList();

  const { projects, status, error, participantQueries } =
    projectListContext || {};

  if (status === "pending")
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  if (status === "error")
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.error}>
          {error?.message ?? "Error has occurred"}
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Published Projects:</Text>
      <FlatList
      data={projects?.filter((project) => project.is_published)}
      keyExtractor={(project) => (project.id ?? "").toString()}
      renderItem={({ item }) =>
        !item.is_published ? null : (
        <View>
          <Link style={styles.item} href={`/projects/${item.id}`}>
          <View style={styles.itemContent}>
            <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.participants}>
              Participants:{" "}
              {participantQueries?.find(
              (query) => query.data?.[0]?.project_id === item.id
              )?.data?.[0]?.number_participants || "0"}
            </Text>
            </View>
          </View>
          </Link>
          {projects && projects.indexOf(item) < projects.length - 1 && (
          <View style={styles.separator} />
          )}
        </View>
        )
      }
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
  statusContainer: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#202225",
    padding: 30,
  },
  loading: {
    color: "white",
    fontSize: 20,
    flex: 1,
  },
  error: {
    color: "red",
    fontSize: 20,
    flex: 1,
  },
});
