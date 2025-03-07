import { Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../_layout";
import { MainLayoutView } from "@/components/shared/MainLayoutView";
import { Colors } from "@/constants/Colors";

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MainLayoutView>
      <Text style={styles.titleContainer}>V. 2025 2 marzo nova</Text>
    </MainLayoutView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    color: Colors.customColors.silver.silver200,
  }
});
