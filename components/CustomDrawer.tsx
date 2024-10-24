import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Image, Text, SafeAreaView } from "react-native";

const CustomDrawer = (props: any) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1f1e26' }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={{ flexGrow: 1 }} // Ensure the content takes up all available space
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require("../assets/icon.png")}
            style={{
              width: 150,
              height: 150,
              marginTop: 20,
            }}
          />
          <Text
            style={{
              fontWeight: "500",
              fontSize: 18,
              paddingTop: 10,
              paddingBottom: 10,
              color: "white",
            }}
          >
            Story Path
          </Text>
        </View>
        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <DrawerItemList {...props} />
          <DrawerItem label={"Logout"} onPress={() => console.log("first")} />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawer;
