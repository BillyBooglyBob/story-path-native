import { Link } from "expo-router";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useProject } from "../../../context/ProjectContext";
import { SCORING_OPTIONS } from "../../../lib/constants";
import LocationPopUp from "../../../components/LocationPopUp";

export default function ProjectDetailsScreen() {
  const projectContext = useProject();
  const {
    project,
    allLocations,
    visitedLocations,
    locationStatus,
    locationError,
    locationOverlay,
    userScore,
  } = projectContext || {};

  const totalScore =
    allLocations?.reduce((acc, location) => {
      return acc + location.score_points;
    }, 0) ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <Link href="/projects">
            <Image
              source={{
                uri: "https://png.pngtree.com/png-vector/20220623/ourmid/pngtree-back-arrow-backward-direction-previous-png-image_5198415.png"
              }}
              style={styles.backIcon}
            />
          </Link>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.titleContent}>
          <View>
            <Text style={styles.title}>Project Title</Text>
            <Text style={styles.description}>{project?.title}</Text>
          </View>
          <View>
            <Text style={styles.title}>Description</Text>
            <Text style={styles.description}>{project?.description}</Text>
          </View>
        </View>
        <View style={styles.detailContent}>
          <View style={styles.detailContentDescription}>
            <View>
              <Text style={styles.title}>Instructions</Text>
              <Text style={styles.description}>{project?.instructions}</Text>
            </View>
            <View>
              <Text style={styles.title}>Initial Clue</Text>
              <Text style={styles.description}>{project?.initial_clue}</Text>
            </View>
          </View>
          <View style={styles.detailContentStats}>
            <View>
              <Text style={styles.title}>Locations Visited</Text>
              <Text style={styles.description}>
                {visitedLocations?.length} / {allLocations?.length}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>Score</Text>
              <Text style={styles.description}>
                {project?.participant_scoring === SCORING_OPTIONS.notScored
                  ? "Not Scored"
                  : `${userScore} / ${totalScore}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.locationContent}>
          <Text style={styles.title}>Visited Locations</Text>
          {visitedLocations?.length === 0 ? (
            <Text style={styles.description}>No locations visited yet</Text>
          ) : (
            visitedLocations?.map((location) => (
              <Text style={styles.description} key={location.id}>
                {location.location_name}
              </Text>
            ))
          )}
        </View>
      </View>
      {locationOverlay?.newLocationVisited.newLocationVisited && (
        <LocationPopUp />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202225",
  },
  header: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
  },
  body: {
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    padding: 10,
    flexDirection: "row",
    gap: 20,
  },
  footer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    marginBottom: 5,
  },
  backContainer: {
    paddingTop: 7,
    paddingLeft: 20,
    color: "white"
  },
  backIcon: {
    width: 35,
    height: 30,
  },
  locationContent: {
    padding: 15,
    borderRadius: 30,
    width: "100%",
    flex: 1,
    backgroundColor: "lightpink",
  },
  titleContent: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "lightblue",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 15,
    borderRadius: 30,
  },
  detailContent: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  detailContentDescription: {
    flex: 1,
    width: "100%",
    backgroundColor: "lightyellow",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 30,
  },
  detailContentStats: {
    flex: 1,
    width: "100%",
    backgroundColor: "lightgreen",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
  },
});
