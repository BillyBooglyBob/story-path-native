import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "../components/CustomDrawer";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "../context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <GestureHandlerRootView>
            <Drawer
              drawerContent={CustomDrawer} // Custom drawer component
              screenOptions={{
                headerShown: true, // Show headers for each screen
              }}
            >
              <Drawer.Screen
                name="index" // Home route
                options={{
                  drawerLabel: "Home",
                  headerTitle: "Home Page",
                  drawerIcon: ({ size, color }) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                  ),
                }}
              />
              <Drawer.Screen
                name="profile" // Profile route
                options={{
                  drawerLabel: "Profile",
                  headerTitle: "My Profile",
                  drawerIcon: ({ size, color }) => (
                    <Ionicons name="person-outline" size={size} color={color} />
                  ),
                }}
              />
              <Drawer.Screen
                name="projects" // Projects main route
                options={{
                  drawerLabel: "Projects",
                  headerTitle: "Projects",
                  drawerIcon: ({ size, color }) => (
                    <Ionicons name="book-outline" size={size} color={color} />
                  ),
                }}
              />
            </Drawer>
          </GestureHandlerRootView>
        </SafeAreaView>
      </UserProvider>
    </QueryClientProvider>
  );
}
