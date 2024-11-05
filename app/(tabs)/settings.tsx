import { StyleSheet, Text } from "react-native";
import { ThemedText } from "@/components/shared/ThemedText";
import { ThemedView } from "@/components/shared/ThemedView";
import { ScrollView } from "react-native-gesture-handler";

export default function SettingsScreen() {
  return (
    <ThemedView>
      <ThemedText>Languages : EN (comming soon PT )</ThemedText>
      <ThemedText>V. Tuesday 5 November 2024 6:10 PM</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
