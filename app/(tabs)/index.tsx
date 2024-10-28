import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Added useNavigation import
import { ThemedView } from "@/components/shared/ThemedView";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

// Define RootStackParamList if not imported from elsewhere
type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
};

// Simulamos datos para la lista de tarjetas
const data = Array.from({ length: 12 }).map((_, index) => ({
  id: index.toString(),
  title: "The best practice with zustand and more",
  time: "3 min",
  level: "A1",
  languageIcon: "🇺🇸",
}));

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#aaa"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Details", { id: item.id })} // Ensure navigation.navigate is available
          >
            <View style={styles.imageContainer}>
              <Text style={styles.languageIcon}>{item.languageIcon}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons name="time-outline" size={16} color="#aaa" />
                  <Text style={styles.infoText}>{item.time}</Text>
                </View>
                <Text style={styles.levelBadge}>{item.level}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

// Style definitions...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e", // Fondo oscuro
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
  },
  filterButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  cardList: {
    paddingBottom: 16, // Espacio al final del scroll
  },
  columnWrapper: {
    justifyContent: "space-between", // Espaciado entre columnas
  },
  card: {
    backgroundColor: "#2c2c2e",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    width: "48%", // Cada tarjeta ocupará el 48% del ancho, con un margen entre ellas
  },
  imageContainer: {
    height: 80,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  languageIcon: {
    fontSize: 24,
  },
  cardContent: {
    padding: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: "#aaa",
    fontSize: 12,
    marginLeft: 4,
  },
  levelBadge: {
    color: "#0a84ff",
    fontSize: 12,
    fontWeight: "600",
  },
});
