import { Link } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useProject } from "../../../context/ProjectContext";
import {
  HOMESCREEN_DISPLAY_OPTIONS,
  SCORING_OPTIONS,
} from "../../../lib/constants";
import LocationPopUp from "../../../components/LocationPopUp";

export default function ProjectDetailsScreen() {
  const projectContext = useProject();
  const {
    project,
    allLocations,
    visitedLocations,
    locationOverlay,
    userScore,
  } = projectContext || {};

  const totalScore =
    allLocations?.reduce((acc, location) => {
      return acc + location.score_points;
    }, 0) ?? 0;

  const scoringMessages = {
    [SCORING_OPTIONS.QRCodes]: "Score via scanning QR codes only",
    [SCORING_OPTIONS.locations]: "Score via visiting locations only",
    [SCORING_OPTIONS.notScored]: "Not scored",
  };

  const scoringOption =
    scoringMessages[project?.participant_scoring ?? "Not Scored"] ||
    "Not scored";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <Link href="/projects">
            <Image
              source={{
                uri: "https://png.pngtree.com/png-vector/20220623/ourmid/pngtree-back-arrow-backward-direction-previous-png-image_5198415.png",
              }}
              style={styles.backIcon}
            />
          </Link>
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView style={styles.child1}>
          <View style={styles.text}>
            <Text style={styles.title}>Project Title</Text>
            <Text style={styles.description}>{project?.title}</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>Scoring Option</Text>
            <Text style={styles.description}>{scoringOption}</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>Initial Display Mode</Text>
            <Text style={styles.description}>
              {project?.homescreen_display ===
              HOMESCREEN_DISPLAY_OPTIONS.initialClue
                ? "Display no locations on the map, need to discover them. Try starting with the initial clue."
                : "Display all locations on the map."}
            </Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>Description</Text>
            <Text style={styles.description}>{project?.description}</Text>
          </View>
        </ScrollView>
        <View style={styles.child2}>
          <ScrollView style={styles.grandchild1}>
            <View style={styles.text}>
              <Text style={styles.title}>Instructions</Text>
              <Text style={styles.description}>{project?.instructions}</Text>
            </View>
            <View style={styles.text}>
              <Text style={styles.title}>Initial Clue</Text>
              <Text style={styles.description}>{project?.initial_clue}</Text>
            </View>
          </ScrollView>
          <View style={styles.grandchild2}>
            <View style={styles.text}>
              <Text style={styles.title}>Locations Visited</Text>
              <Text style={styles.description}>
                {visitedLocations?.length} / {allLocations?.length}
              </Text>
            </View>
            <View style={styles.text}>
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
        <ScrollView style={styles.locationContent}>
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
        </ScrollView>
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
    backgroundColor: "#202225",
  },
  header: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
  },
  backContainer: {
    paddingTop: 7,
    paddingLeft: 20,
    color: "white",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
  },
  body: {
    flex: 8, // Ensures the container takes up the full available space
    flexDirection: "row", // Arranges children side by side
    width: "100%", // Ensures the container spans the full screen width
    gap: 10,
    padding: 15,
  },
  child1: {
    flex: 1,
    width: "50%", // Explicitly ensures equal width
    backgroundColor: "lightblue",
    borderRadius: 30,
  },
  child2: {
    flex: 1,
    width: "50%", // Explicitly ensures equal width
    gap: 10,
  },
  grandchild1: {
    height: "50%",
    backgroundColor: "lightyellow",
    borderRadius: 30,
  },
  grandchild2: {
    height: "50%",
    backgroundColor: "lightgreen",
    borderRadius: 30,
  },
  text: {
    padding: 15,
  },
  footer: {
    flex: 3,
    width: "100%",
    height: "100%",
    padding: 20,
    marginBottom: 5,
  },
});
