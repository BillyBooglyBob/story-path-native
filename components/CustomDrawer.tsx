import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Image, Text } from "react-native";

const CustomDrawer = (props: any) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={{ backgroundColor: "#1f1e26" }}
      >
        <View>
          <Image
            source={require("../assets/icon.png")}
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              marginTop: 20,
            }}
          />
          <Text
            style={{
              alignSelf: "center",
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
        <View style={{backgroundColor: 'white'}}>
          <DrawerItemList {...props} />
          <DrawerItem label={"Logout"} onPress={() => console.log("first")} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;
