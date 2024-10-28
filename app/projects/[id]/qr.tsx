import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Button } from "react-native";
import { useProject } from "../../../context/ProjectContext";

export default function QRScreen() {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [permission, requestPermission] = useCameraPermissions();

  const projectContext = useProject();
  const { mapState, visitedLocations, setLocationVisitedMutation } =
    projectContext || {};

  // Camera permission still loading
  if (!permission) {
    // Camera permissions are still loading
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

  // Handle when barcode is scanned
  const handleBarCodeScanned = ({data}: {data: string}) => {
    setScanned(true);
    setScannedData(data);

    const [_, locationId] = data.split(",");
    const locationIdNumber = Number(locationId)

    // Set location to visited if not visited already
    if (
      !(visitedLocations || []).some((location) => location.id === locationIdNumber)
    ) {
      // Get the full location with the given id
      const location = mapState?.locations?.find(
        (location) => location.id === locationIdNumber
      );
      if (location) {
        console.log("Setting location as visited", location);
        setLocationVisitedMutation?.mutate(location);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>Scanned data: {scannedData}</Text>
          <Button
            title="Press to scan again"
            onPress={() => setScanned(false)}
          />
        </View>
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
