import { Link } from "expo-router";
import { SafeAreaView, Text } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Home Screen</Text>
      <Link href="/profile">Go to Profile</Link>
      <Link href="/projects">Go to Projects</Link>
    </SafeAreaView>
  );
}
