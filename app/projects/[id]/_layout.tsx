import { Tabs, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProjectProvider } from "../../../context/ProjectContext";

export default function ProjectTabs() {
  const { id } = useLocalSearchParams();
  // Since id is of type string | string[], we need to handle both cases
  const projectId = Array.isArray(id) ? id[0] : id;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProjectProvider projectId={projectId}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#1c1c1c", // Dark background color
              
            },
            tabBarActiveTintColor: "#ff6666", // Light red color for selected icon
            tabBarInactiveTintColor: "#ffffff", // White color for unselected icons
          }}
        >
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
      </ProjectProvider>
    </SafeAreaView>
  );
}
