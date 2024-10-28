import { Button, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/shared/ThemedText";
import { ThemedView } from "@/components/shared/ThemedView";
import { useNavigation } from "@react-navigation/native";

export default function WordsScreen() {

  const navigation = useNavigation();
  
  return (
    <ThemedView>
      <ThemedText>Test</ThemedText>
      <Button
      title="Ir a Pantalla Sin Tabs"
      // @ts-ignore
      onPress={() => navigation.navigate("NoTabsScreen")}
    />
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
