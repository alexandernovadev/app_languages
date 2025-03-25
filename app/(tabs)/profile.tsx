import { Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../_layout";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { BACKURL } from "@/api/backurl";

interface backResponse {
  success: boolean;
  data: {
    date: string;
    version: string;
    message: string;
  };
}
export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [backVersion, setBackVersion] = useState<backResponse>(
    {} as backResponse
  );

  useEffect(() => {
    fetch(`${BACKURL}`)
      .then((response) => response.json())
      .then((data: backResponse) => {
        setBackVersion(data);
      });

    return () => {};
  }, []);

  return (
    <MainLayoutView>
      <Text style={styles.titleVersion}>
        VersionBack: {backVersion.data?.version}
      </Text>
      <View style={{ width:'90%', backgroundColor: Colors.green.green800, height:2 }}/>
      <Text style={styles.titleContainer}>VersionAPP: 3.03.mar25.2025</Text>
    </MainLayoutView>
  );
}

const styles = StyleSheet.create({
  titleVersion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontSize: 18,
    color: Colors.silver.silver600,
    width: "80%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontSize: 25,
    color: Colors.silver.silver200,
    marginTop: 20,
  },
});
