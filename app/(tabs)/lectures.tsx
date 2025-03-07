import { Text, StyleSheet } from "react-native";
import { MainLayoutView } from "@/components/shared/MainLayoutView";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../_layout";

export default function LectureScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MainLayoutView>
      <Text>Aqui lectures generatore coming soon...</Text>
    </MainLayoutView>
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
