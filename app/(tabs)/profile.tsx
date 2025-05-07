import { Text, StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../_layout";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { BACKURL } from "@/api/backurl";
import { Storage } from "expo-storage";

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

  const handleLogout = async () => {
    await clearStorage();
    navigation.reset({
      routes: [{ name: "Login" }],
    });
  };

  const clearStorage = async () => {
    const keys = await Storage.getAllKeys();
    await Promise.all(keys.map((key) => {
      return Storage.removeItem({ key });
    }));
  };

  return (
    <MainLayoutView>
      <Text style={styles.titleVersion}>
        VersionBack: {backVersion.data?.version}
      </Text>
      <View
        style={{
          width: "90%",
          backgroundColor: Colors.green.green800,
          height: 2,
        }}
      />
      <Text style={styles.titleContainer}>VersionAPP: 3.03.mar25.2025</Text>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LogOut</Text>
      </Pressable>
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
  logoutButton: {
    marginTop: 40,
    backgroundColor: Colors.green.green600,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
