// Given nearby location, display it on the screen

import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import { Location } from "../lib/types";

export default function NearbyLocation({
  nearbyLocation,
}: {
  nearbyLocation: Location;
}) {
  if (typeof nearbyLocation.location != "undefined") {
    return (
      <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
        <View style={styles.nearbyLocationView}>
          <Text style={styles.nearbyLocationText}>
            Near:{" "}
            {nearbyLocation.location
              ? nearbyLocation.location
              : "No Available Locations"}
          </Text>
          {nearbyLocation.distance.nearby && (
            <Text
              style={{
                ...styles.nearbyLocationText,
                fontWeight: "bold",
              }}
            >
              Within 100 Metres!
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nearbyLocationSafeAreaView: {
    backgroundColor: "black",
  },
  nearbyLocationView: {
    padding: 20,
  },
  nearbyLocationText: {
    color: "white",
    lineHeight: 25,
  },
});
