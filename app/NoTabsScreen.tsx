import React from "react";
import { Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";

export default function NoTabsScreen() {
  const navigation = useNavigation();

  return (
    <MainLayoutView>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Sin Pestañas</Text>
      <Button
        title="Volver a las Pestañas"
        // @ts-ignore
        onPress={() => navigation.navigate("(tabs)")}
        color={Colors.customColors.orange.orange500}
      />
    </MainLayoutView>
  );
}

NoTabsScreen.options = {
  headerShown: false, 
};
