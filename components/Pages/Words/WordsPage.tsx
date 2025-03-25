import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";

import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";
import { useWordStore } from "@/store/useWordStore";
import { capitalize } from "@/utils/capitalize";

export function WordsPage() {
  const {
    wordsList: { words, search, page, totalPages },
    wordActive,
    fetchWords,
    setSearch,
    setPage,
    setActiveWord,
    loading, 
  } = useWordStore();

  const [modalVisible, setModalVisible] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchWords();
    }, 500);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, page]);

  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  const handleOpenModal = (word: any) => {
    setActiveWord(word);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setActiveWord(null)
    setModalVisible(false);
  };

  return (
    <MainLayoutView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar palabra..."
          placeholderTextColor={Colors.gray.gray300}
          value={search}
          onChangeText={handleSearchChange}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.green.green600} />
          <Text style={styles.loadingText}>Loading words...</Text>
        </View>
      ) : (
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
              <Text style={styles.spanish}>
                {capitalize(item.spanish.word)}
              </Text>
              <Text style={styles.definition}>{item.definition}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 60, paddingTop: 80 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>❌ Not Found</Text>
            </View>
          }
        />
      )}

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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.cardhijo}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
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
  closeButtonText: { color: Colors.white.white200, fontWeight: "bold" ,
    height:30
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyText: {
    color: Colors.gray.gray300,
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: Colors.white.white300,
    fontSize: 16,
  },
});
