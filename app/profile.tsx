import React from "react";
import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../context/UserContext";

export default function ProfileScreen() {
  const userContext = useUser();
  const { userState, setUserState } = userContext || {};

  // Function to handle photo selection using the Image Picker
  async function handleChangePress() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user didn't cancel and an image is selected, update the state
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUserState?.((prevState) => ({
        ...prevState,
        uri: result.assets[0].uri,
      }));
    }
  }

  // Check if a photo has been selected
  const hasPhoto = Boolean(userState?.uri);

  // Component to display the selected photo or a placeholder
  function Photo() {
    if (hasPhoto) {
      return (
        <TouchableOpacity onPress={handleChangePress}>
          <View style={styles.photoFullView}>
            <Image
              style={styles.photoFullImage}
              resizeMode="cover"
              source={{ uri: userState?.uri }}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={handleChangePress}>
          <View style={styles.photoEmptyView}>
            <Text style={styles.photoEmptyViewText}>Select a photo</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  // Function to handle username change
  function handleUsernameChange(text: string) {
    setUserState?.((prevState) => ({
      ...prevState,
      username: text,
    }));
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Photo />
        <View>
          <Text style={styles.inputHeader}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#ccc"
            value={userState?.username}
            onChangeText={handleUsernameChange}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Get the screen width and height for styling
const { width, height } = Dimensions.get("window");

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#202225",
    height: "100%",
    display: "flex",
    gap: 40,
  },
  text: {
    color: "#fff", // White text for contrast
    fontSize: 18, // Font size
  },
  photoFullView: {
    marginBottom: 20,
  },
  photoEmptyView: {
    borderWidth: 3,
    borderRadius: 100,
    borderColor: "#999",
    borderStyle: "dashed",
    width: "100%",
    height: height / 2,
    marginBottom: 20,
  },
  photoEmptyViewText: {
    color: "#999",
    fontSize: 24,
    textAlign: "center",
    marginTop: height / 4.5,
  },
  photoFullImage: {
    width: "100%",
    height: height / 2,
    borderRadius: 100,
  },
  inputHeader: {
    color: "#878f9a",
    textTransform: "uppercase",
  },
  input: {
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#fff", // Text color for input
    marginTop: 10,
    backgroundColor: "#333", // Dark background for input
  },
});
