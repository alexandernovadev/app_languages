import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ThemedView } from "@/components/shared/ThemedView";
import { Word } from "@/interfaces/models/Word";

export default function WordsScreen() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(
          `https://languages-ai-back.alexandernova.pro/api/words?page=${page}&wordUser=${search}`
        );
        const data = await response.json();
        if (data.success) {
          setWords(data.data);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error("Error al obtener palabras:", error);
      }
    };

    fetchWords();
  }, [page, search]); // ⚡ Se ejecuta cada vez que cambia el input o la página

  return (
    <ThemedView style={styles.container}>
      {/* 🔎 Input fijo en la parte superior */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar palabra..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 📜 Lista de palabras */}
      <FlatList
        data={words} // 🚀 Ahora usa los datos filtrados directamente desde la API
        keyExtractor={(item) => item.word}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
            <Text style={styles.spanish}>{item.spanish.word}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 80 }}
      />

      {/* ⬅➡ Paginador */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <Text style={styles.button}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>
          {page} / {totalPages}
        </Text>
        <TouchableOpacity
          onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          <Text style={styles.button}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  inputContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    zIndex: 10,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    width: "100%",
  },
  word: { color: "#fff", fontWeight: "bold", flex: 1 },
  definition: { color: "#bbb", flex: 2, marginLeft: 10 },
  spanish: {
    color: "#4CAF50",
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  pagination: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#1e1e1e",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  button: { color: "#4CAF50", fontWeight: "bold", padding: 10 },
  pageText: { color: "#fff" },
});
