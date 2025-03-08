import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";
import { useWordStore } from "@/store/useWordStore";

export function WordsPage() {
  const {
    wordsList: { words, search, page, totalPages },
    wordActive,
    fetchWords,
    setSearch,
    setPage,
    setActiveWord,
  } = useWordStore();

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchWords();
  }, [page, search]);

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const handleOpenModal = (word: any) => {
    setActiveWord(word);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <MainLayoutView style={styles.container}>
      {/* 🔎 Input de búsqueda */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar palabra..."
          placeholderTextColor={Colors.gray.gray300}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      {/* 📜 Lista de palabras */}
      <FlatList
        data={words}
        keyExtractor={(item) => item.word}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleOpenModal(item)}
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
          onPress={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          <Text style={styles.button}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>
          {page} / {totalPages}
        </Text>
        <TouchableOpacity
          onPress={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          <Text style={styles.button}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      {/* 📝 Modal para mostrar la palabra activa */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.cardhijo}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
          {wordActive && <WordCardRoot />}
        </View>
      </Modal>
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
  pageText: { color: Colors.white.white300 },
  closeButton: {
    backgroundColor: Colors.green.green700,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: { color: Colors.white.white200, fontWeight: "bold" },
});
