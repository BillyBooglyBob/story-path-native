import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";

export default function ProjectTabs() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen name="index" options={{ title: "Project" }} />
        <Tabs.Screen name="map" options={{ title: "Map" }} />
        <Tabs.Screen name="qr" options={{ title: "QR Scanner" }} />
      </Tabs>
    </SafeAreaView>
  );
}
