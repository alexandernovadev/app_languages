import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/shared/ThemedView";
import { Word } from "@/interfaces/models/Word";
import { BACKURL } from "@/api/backurl";

export default function WordsScreen() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  // Resetear la paginación cuando cambia la búsqueda
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const query = search ? `&wordUser=${search.toLowerCase()}` : "";
        const response = await fetch(
          `${BACKURL}/api/words?page=${page}${query}`
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
  }, [page, search]); // 🔥 Ahora también se ejecuta cuando cambia `search`

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <ThemedView style={styles.container}>
      {/* 🔎 Input de búsqueda */}
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
        data={words}
        keyExtractor={(item) => item.word}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => setSelectedWord(item)}
          >
            <View style={styles.headerRow}>
              <Text style={styles.word}>{capitalize(item.word)}</Text>
              <Text style={styles.ipa}>{item.IPA}</Text>
            </View>
            <Text style={styles.spanish}>{capitalize(item.spanish.word)}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
          </TouchableOpacity>
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

      {/* 📌 Modal con todas las propiedades */}
      {selectedWord && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>
                  {capitalize(selectedWord.word)}
                </Text>
                <Text style={styles.modalIPA}>{selectedWord.IPA}</Text>

                <Text style={styles.modalSubtitle}>Traducción:</Text>
                <Text style={styles.modalText}>
                  {capitalize(selectedWord.spanish.word)}
                </Text>

                <Text style={styles.modalSubtitle}>Definición:</Text>
                <Text style={styles.modalText}>{selectedWord.definition}</Text>

                <Text style={styles.modalSubtitle}>Ejemplos:</Text>
                {selectedWord.examples.map((example, index) => (
                  <Text key={index} style={styles.modalText}>
                    • {example}
                  </Text>
                ))}

                <Text style={styles.modalSubtitle}>Sinónimos:</Text>
                <Text style={styles.modalText}>
                  {selectedWord.sinonyms?.join(", ")}
                </Text>

                <Text style={styles.modalSubtitle}>Tipo:</Text>
                <Text style={styles.modalText}>
                  {selectedWord.type.join(", ")}
                </Text>

                <Text style={styles.modalSubtitle}>Nivel:</Text>
                <Text style={styles.modalText}>{selectedWord.level}</Text>

                {/* 🔥 CodeSwitching */}
                <Text style={styles.modalSubtitle}>Code-Switching:</Text>
                {selectedWord.codeSwitching.map((sentence, index) => (
                  <Text key={index} style={styles.modalText}>
                    • {sentence}
                  </Text>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedWord(null)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
  },
  word: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  ipa: { color: "#BB86FC", fontWeight: "bold", fontSize: 16 },
  spanish: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  definition: { color: "#bbb", fontSize: 14 },

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

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  modalIPA: {
    fontSize: 18,
    color: "#BB86FC",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  modalText: { fontSize: 14, color: "#fff", marginTop: 5 },
  closeButton: {
    backgroundColor: "#BB86FC",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
