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
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView>
            <Drawer
              drawerContent={CustomDrawer}
              screenOptions={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: "#292b2f", // Black background for the header
                },
                headerTintColor: "#fff", // White color for header text and icons
                drawerStyle: {
                  backgroundColor: "#2f3136",
                },
                drawerLabelStyle: {
                  color: "white",
                },
                drawerActiveTintColor: "#b0b3b8", // Light gray color for selected items
                drawerInactiveTintColor: "white", // White color for unselected items
              }}
            >
              <Drawer.Screen
                name="index"
                options={{
                  drawerLabel: "Home",
                  headerTitle: "Home Page",
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="home-outline"
                      size={size}
                      color={focused ? "#b0b3b8" : "white"} // Light gray if selected, white otherwise
                    />
                  ),
                }}
              />
              <Drawer.Screen
                name="profile"
                options={{
                  drawerLabel: "Profile",
                  headerTitle: "My Profile",
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="person-outline"
                      size={size}
                      color={focused ? "#b0b3b8" : "white"}
                    />
                  ),
                }}
              />
              <Drawer.Screen
                name="projects"
                options={{
                  drawerLabel: "Projects",
                  headerTitle: "Projects",
                  drawerIcon: ({ focused, size }) => (
                    <Ionicons
                      name="book-outline"
                      size={size}
                      color={focused ? "#b0b3b8" : "white"}
                    />
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
