import { Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../_layout";
import { MainLayoutView } from "@/components/shared/MainLayoutView";

export default function LectureScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MainLayoutView>
      <Text>Aqui lectures generatore coming soon...</Text>
    </MainLayoutView>
  );
}
