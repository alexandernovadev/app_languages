import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";
import { useWordStore } from "@/store/useWordStore";
import { capitalize } from "@/utils/capitalize";
import { ModalDragger } from "@/components/shared/ModalDragger";
import { Word } from "@/interfaces/models/Word";

export function WordsPage() {
  const {
    wordsList: { words, search, page, totalPages, total },
    fetchWords,
    setSearch,
    setPage,
    setActiveWord,
    generateWord,
    loading,
  } = useWordStore();

  const [modalWordActive, setModalWordActive] = useState(false);
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

  const handleClearSearch = () => {
    setSearch('');
  };

  const handleOpenModal = (word: Word) => {
    setActiveWord(word);
    setModalWordActive(true);
  };

  const handleCloseModal = () => {
    setActiveWord(null);
    setModalWordActive(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <MainLayoutView style={styles.container}>
        <View
          style={[styles.inputContainer, modalWordActive && { display: "none" }]}
        >
          <TextInput
            style={styles.input}
            placeholder={`Search word of _ ${total} words`}
            placeholderTextColor={Colors.gray.gray300}
            value={search}
            onChangeText={handleSearchChange}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color={Colors.white.white300} />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.green.green600} />
            <Text style={styles.loadingText}>Loading...</Text>
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
            contentContainerStyle={{
              paddingBottom: 60,
              paddingTop: 80,
              zIndex: -1,
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Word not Found</Text>
                <TouchableOpacity
                  style={[styles.buttonMake, loading && styles.buttonDisabled]}
                  onPress={() =>
                    generateWord(search).finally(() => {
                      fetchWords();
                      setModalWordActive(true);
                    })
                  }
                  disabled={!!loading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.white.white400} />
                  ) : (
                    <Text style={styles.buttonMakeText}>Generate</Text>
                  )}
                </TouchableOpacity>
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
      </MainLayoutView>
      <ModalDragger
        isModalVisible={modalWordActive}
        setModalVisible={handleCloseModal}
      >
        <View style={styles.cardhijo}>
          <WordCardRoot />
        </View>
      </ModalDragger>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  cardhijo: {
    width: "100%",
    height: "91%",
  },
  inputContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    zIndex: 1,
    display: "flex",
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
  closeButtonText: {
    color: Colors.white.white200,
    fontWeight: "bold",
    height: 30,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    display: "flex",
    gap: 16,
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
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.green.green800,
    fontSize: 20,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray.gray900,
  },
  buttonMakeText: {
    color: Colors.white.white200,
    fontWeight: "bold",
  },
  buttonMake: {
    backgroundColor: Colors.green.green700,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearButton: {
    marginLeft: 8,
    position: "absolute",
    right: 5,
    top: 20,
  },
});
