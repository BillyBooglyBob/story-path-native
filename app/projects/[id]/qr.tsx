import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Button } from "react-native";
import { useProject } from "../../../context/ProjectContext";
import LocationPopUp from "../../../components/LocationPopUp";
import { LOCATION_TRIGGER_OPTIONS } from "../../../lib/constants";

export default function QRScreen() {
  // States to store permission of QR data
  const [permission, requestPermission] = useCameraPermissions();
  const [qrData, setQrData] = useState({
    scanned: false,
    scannedData: "",
  });

  // Get location data from the project context
  const projectContext = useProject();
  const { allLocations, visitedLocations, locationOverlay } =
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

    // Check if location allows scoring by qr code
    const locationScored =
      location?.location_trigger ===
        LOCATION_TRIGGER_OPTIONS.LocationEntryAndQRCode ||
      location?.location_trigger === LOCATION_TRIGGER_OPTIONS.QRCode;

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
        <Button onPress={requestPermission} title="Grant permission" />
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
          <Button title="Press to scan again" onPress={setScannedFalse} />
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
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scanResultContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
