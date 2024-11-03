import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
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
          <Text style={styles.overlayTextTitle}>Location name</Text>
          <Text style={styles.overlayText}>
            {locationContent.location_name}
          </Text>
          <Text style={styles.overlayTextTitle}>Location coordinates</Text>
          <Text style={styles.overlayText}>
            {locationContent.location_position}
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
          <TouchableOpacity onPress={closeOverlay} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    backgroundColor: "#2f3136",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  overlayText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    color: "white",
  },
  overlayTextTitle: {
    fontSize: 24,
    textAlign: "center",
    color: "white",
  },
  webview: {
    marginTop: 20,
    maxHeight: 500,
    width: 400,
    flex: 1,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "#878f9a",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default LocationPopUp;
