import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";
import { Text, StyleSheet } from "react-native";


export default function LectureScreen() {
  return (
    <MainLayoutView>
      <Text style={styles.text}>Aqui lectures generatore coming soon...</Text>
    </MainLayoutView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.customColors.green.green200,
  },
});
