import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.titleContainer}>
      {Array.from({ length: 22 }).map((_, index) => (
        <>
          <ThemedText>Step {index + 1}</ThemedText>
          <ThemedText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            ultricies, nibh nec vehicula.
          </ThemedText>
        </>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
