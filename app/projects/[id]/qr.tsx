import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useProject } from "../../../context/ProjectContext";
import LocationPopUp from "../../../components/LocationPopUp";
import {
  LOCATION_TRIGGER_OPTIONS,
  SCORING_OPTIONS,
} from "../../../lib/constants";

export default function QRScreen() {
  // States to store permission of QR data
  const [permission, requestPermission] = useCameraPermissions();
  const [qrData, setQrData] = useState({
    scanned: false,
    scannedData: "",
  });

  // Get location data from the project context
  const projectContext = useProject();
  const { allLocations, visitedLocations, locationOverlay, project } =
    projectContext || {};

  // Handle when barcode is scanned
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setQrData((prev) => ({
      ...prev,
      scanned: true,
      scannedData: data,
    }));

    const [_, locationId] = data.split(",");
    const locationIdNumber = Number(locationId);

    const visitedAlready = !(visitedLocations || []).some(
      (location) => location.id === locationIdNumber
    );

    const location = allLocations?.find(
      (location) => location.id === locationIdNumber
    );

    // Check if project allows scoring by qr code
    const locationScored =
      project?.participant_scoring === SCORING_OPTIONS.QRCodes;

    visitedAlready
      ? location &&
        locationOverlay?.setNewLocationVisited(location, locationScored)
      : locationOverlay?.setLocationAlreadyVisited();
  };

  // Handle scan again, reset scanned state
  const setScannedFalse = () => {
    setQrData({
      scanned: false,
      scannedData: "",
    });
  };

  // Camera permission still loading
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  // Camera permissions are not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={qrData.scanned ? undefined : handleBarCodeScanned}
      />
      {qrData.scanned && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>
            {locationOverlay?.newLocationVisited.newLocationVisited
              ? "New location visited"
              : "Location already visited"}
          </Text>
          <TouchableOpacity onPress={setScannedFalse} style={styles.button}>
            <Text style={styles.buttonText}>Press to scan again</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* If new location visited, display the content as overlay */}
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
    backgroundColor: "#202225",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "#878f9a",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  scanResultContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2f3136",
    padding: 15,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
});
