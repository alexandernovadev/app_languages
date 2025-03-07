import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Word } from "@/interfaces/models/Word";
import { BACKURL } from "@/api/backurl";
import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";

export function WordsPage() {
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
  }, [page, search]);

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <MainLayoutView style={styles.container}>
      {/* 🔎 Input de búsqueda */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar palabra..."
          placeholderTextColor={Colors.gray.gray300}
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

      {selectedWord && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.cardhijo}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedWord(null)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
            <WordCardRoot word={selectedWord} />
          </View>
        </Modal>
      )}
    </MainLayoutView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardhijo: {
    width: "100%",
    height: "91%",
  },
  inputContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    zIndex: 10,
  },
  input: {
    backgroundColor: Colors.gray.gray850,
    color: Colors.white.white300,
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  row: {
    backgroundColor: Colors.black.black700,
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
  word: { color: Colors.white.white300, fontWeight: "bold", fontSize: 18 },
  ipa: { color: Colors.purple.purple200, fontWeight: "bold", fontSize: 16 },
  spanish: {
    color: Colors.green.green500,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  definition: { color: Colors.white.white400, fontSize: 14 },

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
  button: { color: Colors.green.green600, fontWeight: "bold", padding: 10 },
  pageText: { color: "#fff" },

  // TODO Replace it
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.black.black800,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.black.black800,
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
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
