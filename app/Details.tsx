import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams

export default function DetailsScreen() {
  // Access the ID parameter from the route
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ID de la tarjeta: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1c1c1e",
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});
