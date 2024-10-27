import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
  Button,
  TextInput,
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

  // Function to remove the selected photo
  async function handleRemovePress() {
    setUserState?.((prevState) => ({ ...prevState, uri: "" }));
  }

  // Check if a photo has been selected
  const hasPhoto = Boolean(userState?.uri);

  // Component to display the selected photo or a placeholder
  function Photo() {
    if (hasPhoto) {
      return (
        <View style={styles.photoFullView}>
          <Image
            style={styles.photoFullImage}
            resizeMode="cover"
            source={{ uri: userState?.uri }}
          />
        </View>
      );
    } else {
      return <View style={styles.photoEmptyView} />;
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
        <View style={styles.buttonView}>
          <Button
            onPress={handleChangePress}
            title={hasPhoto ? "Change Photo" : "Add Photo"}
          />
          {hasPhoto && (
            <Button onPress={handleRemovePress} title="Remove Photo" />
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#ccc"
          value={userState?.username}
          onChangeText={handleUsernameChange}
        />
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
  },
  icon: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    marginBottom: 20,
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
    borderRadius: 10,
    borderColor: "#999",
    borderStyle: "dashed",
    width: "100%",
    height: height / 2,
    marginBottom: 20,
  },
  photoFullImage: {
    width: "100%",
    height: height / 2,
    borderRadius: 10,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#fff", // Text color for input
    marginTop: 20,
    backgroundColor: "#333", // Dark background for input
  },
});
