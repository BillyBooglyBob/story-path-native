import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Image, Text, SafeAreaView } from "react-native";
import { useUser } from "../context/UserContext";

const CustomDrawer = (props: any) => {
  const userContext = useUser();
  const userState = userContext?.userState;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={{ flexGrow: 1 }} // Ensure the content takes up all available space
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={
              userState?.uri
                ? { uri: userState.uri }
                : require("../assets/user.png") // Default image
            }
            style={{
              width: 150,
              height: 150,
              marginTop: 20,
              borderRadius: 75,
            }}
          />
          <Text
            style={{
              fontWeight: "500",
              fontSize: 18,
              paddingTop: 10,
              paddingBottom: 10,
              color: "black",
            }}
          >
            {userState?.username}
          </Text>
        </View>
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawer;
