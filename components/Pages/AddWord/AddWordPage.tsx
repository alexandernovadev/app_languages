import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Word } from "@/interfaces/models/Word";
import { BACKURL } from "@/api/backurl";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";

export default function AddWordPage() {
  const [word, setWord] = useState("");
  const [wordDb, setWordDb] = useState<Word | undefined>(undefined);
  const [loadingGetWord, setLoadingGetWord] = useState(false);

  const getWordFromDb = async (word: string) => {
    try {
      const response = await fetch(
        `${BACKURL}/api/words/word/${word.toLowerCase()}`
      );
      const { data } = await response.json();
      setWordDb(data);
    } catch (error) {
      console.error("Error fetching word from DB:", error);
    }
  };

  const generateWord = async () => {
    if (!word.trim()) return;
    setLoadingGetWord(true);
    try {
      const response = await fetch(`${BACKURL}/api/ai/generate-wordJson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: word, language: "en" }),
      });
      const { data } = await response.json();
      setWordDb(data);
    } catch (error) {
      console.error("Error generating word:", error);
    } finally {
      setLoadingGetWord(false);
    }
  };

  useEffect(() => {
    if (word) {
      getWordFromDb(word);
    }
  }, [word]);

  const listenWord = () => {
    if (wordDb?.word) {
      const utterance = new SpeechSynthesisUtterance(wordDb.word);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <MainLayoutView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una palabra..."
          placeholderTextColor="#888"
          value={word}
          onChangeText={setWord}
        />
        <TouchableOpacity
          style={[styles.button, loadingGetWord && styles.buttonDisabled]}
          onPress={generateWord}
          disabled={loadingGetWord}
        >
          {loadingGetWord ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.wordContainer}>
        {wordDb ? (
          <View style={styles.card}>
            <View style={styles.wordHeader}>
              <Text style={styles.wordTitle}>{wordDb.word}</Text>

              <TouchableOpacity
                onPress={listenWord}
                style={styles.speakerButton}
              >
                <Text style={styles.speakerText}>🔊</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingVertical: 10,
                
              }}
            >
              <Text style={styles.wordTitle}>
                {wordDb.spanish.word}
              </Text>
            </View>

            {wordDb.IPA && <Text style={styles.ipa}>{wordDb.IPA}</Text>}
            <Text style={styles.definition}>{wordDb.definition}</Text>

            {wordDb.examples && wordDb.examples.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Ejemplos:</Text>
                {wordDb.examples.map((example, index) => (
                  <Text key={index} style={styles.example}>
                    • {example}
                  </Text>
                ))}
              </View>
            )}

            {wordDb.sinonyms && wordDb.sinonyms.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Sinónimos:</Text>
                <Text style={styles.synonym}>{wordDb.sinonyms.join(", ")}</Text>
              </View>
            )}

            {wordDb.type && (
              <View>
                <Text style={styles.sectionTitle}>Tipo:</Text>
                <Text style={styles.modalText}>{wordDb.type.join(", ")}</Text>
              </View>
            )}

            {wordDb.level && (
              <View>
                <Text style={styles.sectionTitle}>Nivel:</Text>
                <Text style={styles.modalText}>{wordDb.level}</Text>
              </View>
            )}

            {wordDb.codeSwitching && wordDb.codeSwitching.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Code-Switching:</Text>
                {wordDb.codeSwitching.map((sentence, index) => (
                  <Text key={index} style={styles.example}>
                    • {sentence}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.noWordText}>
            Add new word to see its definition
          </Text>
        )}
      </ScrollView>
    </MainLayoutView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212", // 🌙 Modo oscuro
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  wordContainer: {
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 10,
    width: "100%",
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  wordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
  speakerButton: {
    backgroundColor: "#BB86FC",
    padding: 8,
    borderRadius: 50,
  },
  speakerText: {
    fontSize: 18,
    color: "#fff",
  },
  ipa: {
    fontSize: 18,
    color: "#BB86FC",
    marginBottom: 5,
  },
  definition: {
    fontSize: 16,
    color: "#bbb",
    flex: 1,
    textAlign: "justify",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  example: {
    fontSize: 16,
    color: "#ccc",
    marginLeft: 10,
  },
  synonym: {
    fontSize: 16,
    color: "#FF9800",
    fontStyle: "italic",
  },
  modalText: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 5,
  },
  noWordText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
