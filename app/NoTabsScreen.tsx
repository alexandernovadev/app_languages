import React from "react";
import { Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MainLayoutView } from "@/components/shared/MainLayoutView";

export default function NoTabsScreen() {
  const navigation = useNavigation();

  return (
    <MainLayoutView>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Sin Pestañas</Text>
      <Button
        title="Volver a las Pestañas"
        // @ts-ignore
        onPress={() => navigation.navigate("(tabs)")}
        color="#6200ee"
      />
    </MainLayoutView>
  );
}

NoTabsScreen.options = {
  headerShown: false, // Oculta el encabezado
};
