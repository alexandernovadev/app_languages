import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "@/components/shared/ThemedView";
import { ThemedText } from "@/components/shared/ThemedText";

export default function NoTabsScreen() {
  const navigation = useNavigation();

  return (
    <ThemedView>
      <ThemedText type="title">Bienvenido a NoTabsScreen</ThemedText>
      <ThemedText>
        Esta es una pantalla fuera de las pestañas.
      </ThemedText>
      <Button
        title="Volver a las Pestañas"
        // @ts-ignore
        onPress={() => navigation.navigate("(tabs)")}
        color="#6200ee"
      />
    </ThemedView>
  );
}

NoTabsScreen.options = {
  headerShown: false, // Oculta el encabezado
};
