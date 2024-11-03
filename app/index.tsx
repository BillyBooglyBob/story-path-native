import { Link } from "expo-router";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={["rgba(255, 0, 0, 0.3)", "rgba(255, 0, 0, 0)"]}
        start={{ x: 0.5, y: 0.5 }}
        style={styles.redBlur}
      />
      <Image
        source={{
          uri: "https://assets.website-files.com/6193c9dbb809764879877eec/619bf11703b95d04a9ce2bb0_footer_hand.png",
        }}
        style={styles.iconLeft}
      />

      {/* Main Content */}
      <View style={styles.titleContainer}>
        <Text style={styles.header}>Welcome to Story Path</Text>
        <Text style={styles.title}>Explore unlimited location-based experience</Text>
      </View>

      <Link style={styles.link} href="/profile">Profile</Link>
      <Link style={styles.link} href="/projects">Projects</Link>

      {/* Background */}
      <Image
        source={{
          uri: "https://assets.website-files.com/6193c9dbb809764879877eec/619bf1202d5013a1d0a1acb1_footer_rectangle.png",
        }}
        style={styles.iconRight}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202225",
  },
  redBlur: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 300,
    height: 300,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 150,
  },
  iconRight: {
    position: "absolute",
    right: -70,
    top: -70,
    width: 200,
    height: 200,
    transform: [{ rotate: "90deg" }],
  },
  iconLeft: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 200,
    height: 200,
  },
  titleContainer: {
    alignItems: "flex-start",
    display: "flex",
    gap: 20,
    padding: 20,
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "",
    color: "#646870",
    textTransform: "uppercase",
  },
  header: {
    fontSize: 40,
    fontWeight: "heavy",
    color: "white",
    textTransform: "uppercase",
  },
  link: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#40444b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "80%",
    textAlign: "center",
    marginTop: 10,
  }
});
