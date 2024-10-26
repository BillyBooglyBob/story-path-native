import { Stack } from "expo-router";
import { ProjectListProvider } from "../../context/ProjectsContext";

export default function ProjectsLayout() {
  return (
    <ProjectListProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Projects" }} />
        <Stack.Screen name="[id]" options={{ title: "Project Details" }} />
      </Stack>
    </ProjectListProvider>
  );
}
