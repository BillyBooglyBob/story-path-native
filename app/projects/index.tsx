import { Link } from "expo-router";
import { SafeAreaView, Text } from "react-native";

export default function ProjectsScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Projects List</Text>
      <Link href="/projects/1">View Project 1</Link>
      <Link href="/projects/2">View Project 2</Link>
    </SafeAreaView>
  );
}
