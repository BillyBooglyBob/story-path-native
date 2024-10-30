import {
  Text,
  StyleSheet,
  View,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import { useProject } from "../context/ProjectContext";
import WebView from "react-native-webview";
import { ProjectLocation } from "../lib/types";

const LocationPopUp = () => {
  const projectContext = useProject();
  const { locationOverlay } = projectContext || {};
  const locationContent =
    locationOverlay?.newLocationVisited?.newLocation || ({} as ProjectLocation);

  const closeOverlay = () => {
    locationOverlay?.setLocationAlreadyVisited();
  };

  return (
    <TouchableWithoutFeedback onPress={closeOverlay}>
      <View style={styles.overlayContainer}>
        <View style={styles.overlayContent}>
          <Text style={styles.overlayText}>
            Location name: {locationContent.location_name}
          </Text>
          <Text style={styles.overlayText}>
            Location coordinates: {locationContent.location_position}
          </Text>
          {locationContent.location_content ? (
            <WebView
              style={styles.webview}
              originWhitelist={["*"]}
              source={{ html: locationContent.location_content }}
            />
          ) : (
            <Text style={styles.overlayText}>No content available</Text>
          )}
          <Button onPress={closeOverlay} title="Close" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    width: 400,
    height: 600,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  overlayText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  webview: {
    marginTop: 20,
    maxHeight: 500,
    width: 400,
    flex: 1,
  },
});

export default LocationPopUp;
