import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "../components/CustomDrawer";

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
      drawerContent={CustomDrawer}
      screenOptions={{
        drawerHideStatusBarOnOpen: true,
        drawerActiveTintColor: "#1f1e26",
        drawerActiveBackgroundColor: "#9998a3",
      }}>
        <Drawer.Screen name="index" options={{
          drawerLabel: "Home",
          headerTitle: "Home Page",
          drawerIcon: ({size, color}) => (
        <Ionicons name="home-outline" size={size} color={color}/>
          )
        }}/>
        <Drawer.Screen name="profile" options={{
          drawerLabel: "Profile",
          headerTitle: "My Profile",
          drawerIcon: ({size, color}) => (
        <Ionicons name="person-outline" size={size} color={color}/>
          )
        }}/>
        <Drawer.Screen name="projects" options={{
          drawerLabel: "Projects",
          headerTitle: "Projects",
          drawerIcon: ({size, color}) => (
        <Ionicons name="book-outline" size={size} color={color}/>
          )
        }}/>
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default _layout;
