import { Link } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import { styled } from "nativewind";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text className="bg-black">Home Screen</Text>
      <Link href="/profile">Go to Profile</Link>
      <Link href="/projects">Go to Projects</Link>
    </SafeAreaView>
  );
}
