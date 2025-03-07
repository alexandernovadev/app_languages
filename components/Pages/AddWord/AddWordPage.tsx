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
import { Colors } from "@/constants/Colors";
import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";

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


  return (
    <MainLayoutView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una palabra..."
          placeholderTextColor={Colors.gray.gray850}
          value={word}
          onChangeText={setWord}
        />
        <TouchableOpacity
          style={[styles.button, loadingGetWord && styles.buttonDisabled]}
          onPress={generateWord}
          disabled={loadingGetWord}
        >
          {loadingGetWord ? (
            <ActivityIndicator color={Colors.white.white400} />
          ) : (
            <Text style={styles.buttonText}>Generar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.wordContainer}>
        {wordDb ? (
          <WordCardRoot word={wordDb} />
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
    backgroundColor: Colors.black.black900,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.black.black800,
    color: Colors.white.white400,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.black.black500,
    marginRight: 10,
  },
  button: {
    backgroundColor: Colors.green.green700,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray.gray900,
  },
  buttonText: {
    color: Colors.white.white200,
    fontWeight: "bold",
  },
  wordContainer: {
    paddingBottom: 60,
  },
  noWordText: {
    fontSize: 18,
    color: Colors.gray.gray600,
    textAlign: "center",
    marginTop: 20,
  },
});
