import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text, View, ScrollView } from "react-native";
import { ThemedText } from "@/components/shared/ThemedText";
import { ThemedView } from "@/components/shared/ThemedView";
import { Word } from "@/interfaces/models/Word";
import { BACKURL } from "@/api/backurl";


export default function AddwordScreen() {
  const [word, setWord] = useState("");
  const [wordDb, setWordDb] = useState<Word | undefined>(undefined);
  const [loadingGetWord, setLoadingGetWord] = useState(false);

  const getWordFromDb = async (word: string) => {
    try {
      const response = await fetch(`${BACKURL}/api/words/word/${word}`);
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
    <ThemedView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={word}
          onChangeText={setWord}
        />
        <TouchableOpacity style={styles.button} onPress={generateWord} disabled={loadingGetWord}>
        <ThemedText>
            m
                </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.wordContainer}>
        {wordDb ? (
          <View>
            <View style={styles.wordHeader}>
              <ThemedText style={styles.wordTitle}>{wordDb.word}</ThemedText>
              <TouchableOpacity onPress={listenWord}>
                <ThemedText>
              x
                </ThemedText>
              </TouchableOpacity>
            </View>
            {wordDb.IPA && <Text style={styles.ipa}>{wordDb.IPA}</Text>}
            <Text style={styles.definition}>{wordDb.definition}</Text>

            {wordDb.examples && (
              <View>
                <Text style={styles.sectionTitle}>Examples:</Text>
                {wordDb.examples.map((example, index) => (
                  <Text key={index} style={styles.example}>{example}</Text>
                ))}
              </View>
            )}

            {wordDb.sinonyms && (
              <View>
                <Text style={styles.sectionTitle}>Synonyms:</Text>
                {wordDb.sinonyms.map((synonym, index) => (
                  <Text key={index} style={styles.synonym}>{synonym}</Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <ThemedText>No word found</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    color: "white",

  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  wordContainer: {
    marginTop: 20,
  },
  wordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  ipa: {
    fontSize: 18,
    color: "gray",
    marginBottom: 5,
  },
  definition: {
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  example: {
    fontSize: 16,
    color: "black",
    marginLeft: 10,
  },
  synonym: {
    fontSize: 16,
    color: "black",
    marginLeft: 10,
    fontStyle: "italic",
  },
});
