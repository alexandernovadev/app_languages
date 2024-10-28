import { StyleSheet, Image, Platform } from "react-native";
import { ThemedText } from "@/components/shared/ThemedText";
import { ThemedView } from "@/components/shared/ThemedView";

export default function SettingsScreen() {
  return (
    <ThemedView>
      <ThemedText>
        Nada le gusta más a un programador que un buen café. Pero, ¿qué
      </ThemedText>
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
