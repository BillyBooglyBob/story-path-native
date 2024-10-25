import { Tabs, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProjectTabs() {
  const { id: projectId } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Info",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="folder" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
            ),
          }}
          initialParams={{ id: projectId }} // Pass projectId to map screen
        />
        <Tabs.Screen
          name="qr"
          options={{
            title: "QR Scanner",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera" color={color} size={size} />
            ),
          }}
          initialParams={{ id: projectId }} // Pass projectId to qr code screen
        />
      </Tabs>
    </SafeAreaView>
  );
}
