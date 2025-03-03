import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Word } from "@/interfaces/models/Word";
import { BACKURL } from "@/api/backurl";

interface SidePanelProps {
  isVisible: boolean;
  wordSelected: string | null;
}

export const SidePanelModalWord: React.FC<SidePanelProps> = ({
  isVisible,
  wordSelected,
}) => {
  const [wordDb, setWordDb] = useState<Word | undefined>(undefined);
  const [loadingGetWord, setLoadingGetWord] = useState(false);

  const getWord = async (word: string) => {
    try {
      const response = await fetch(
        `${BACKURL}/api/words/word/${word.toLocaleLowerCase()}`
      );
      const { data } = await response.json();
      setWordDb(data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateWord = async () => {
    setLoadingGetWord(true);
    try {
      const response = await fetch(`${BACKURL}/api/ai/generate-wordJson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: wordSelected, language: "en" }),
      });
      const { data } = await response.json();
      setWordDb(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGetWord(false);
    }
  };

  useEffect(() => {
    if (isVisible && wordSelected) {
      getWord(wordSelected);
    }
  }, [isVisible, wordSelected]);

  const listenWord = () => {
    if (wordDb?.word) {
      Speech.speak(wordDb.word, { language: "en-US" });
    }
  };

  if (!isVisible) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wordRow}>
        <Text style={styles.wordText}>{wordSelected}</Text>
        {wordDb && (
          <TouchableOpacity onPress={listenWord} style={styles.speakerIcon}>
            <Ionicons name="volume-high-outline" size={32} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {wordDb?.IPA && <Text style={styles.ipaText}>{wordDb.IPA}</Text>}

      {wordDb ? (
        <View style={styles.content}>
          {wordDb.level && (
            <Text style={styles.levelText}>Nivel: {wordDb.level}</Text>
          )}
          {wordDb.type && (
            <Text style={styles.typeText}>Type {wordDb.type.join(", ")}</Text>
          )}
          <Text style={styles.definition}>{wordDb.definition}</Text>

          {wordDb.img && (
            <Image
              source={{ uri: wordDb.img }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          {wordDb.examples && (
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Examples</Text>
              {wordDb.examples.map((example, index) => (
                <Text key={index} style={styles.exampleText}>
                  • {example}
                </Text>
              ))}
            </View>
          )}

          {wordDb.codeSwitching && (
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Code-Switching Examples</Text>
              {wordDb.codeSwitching.map((example, index) => (
                <Text key={index} style={styles.exampleText}>
                  • {example}
                </Text>
              ))}
            </View>
          )}

          {wordDb.sinonyms && (
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Sinonyms</Text>
              {wordDb.sinonyms.map((sinonym, index) => (
                <Text
                  key={index}
                  style={[styles.exampleText, { textTransform: "capitalize" }]}
                >
                  <Text
                  style={styles.boldText}
                  >{index + 1}) </Text> {sinonym}
                </Text>
              ))}
            </View>
          )}

          {wordDb.spanish && (
            <View style={[styles.examplesContainer, { paddingBottom: 12 }]}>
              <Text style={styles.examplesTitle}>Spanish</Text>
              <Text
                style={[styles.exampleText, { textTransform: "capitalize" }]}
              >
                <Text style={styles.boldText}>Word </Text>
                {wordDb.spanish.word}
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.boldText}>Definición </Text>
                {wordDb.spanish.definition}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noWordContainer}>
          <Text style={styles.noWordText}>Word not found in the database.</Text>
          <TouchableOpacity
            onPress={generateWord}
            disabled={loadingGetWord}
            style={styles.generateButton}
          >
            {loadingGetWord && (
              <ActivityIndicator
                size="small"
                color="white"
                style={{ marginRight: 10 }}
              />
            )}
            <Text style={styles.generateButtonText}>
              {loadingGetWord ? "Generating..." : "Generate Word with AI"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingRight: 10,
    paddingBottom: 24,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  wordText: {
    fontSize: 40,
    color: "#2eb12e",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  speakerIcon: {
    marginLeft: 10,
  },
  content: {
    marginTop: 20,
  },
  levelText: {
    fontSize: 16,
    color: "#d0de11",
  },
  typeText: {
    fontSize: 14,
    color: "#44ae44",
    marginTop: 2,
  },
  definition: {
    fontSize: 18,
    color: "white",
    marginTop: 10,
  },
  ipaText: {
    fontSize: 20,
    color: "#7a5cf1", // Morado
    marginTop: 4,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "green",
  },
  examplesContainer: {
    marginTop: 10,
  },
  examplesTitle: {
    fontSize: 22,
    color: "#2b952b",
    marginBottom: 6,
    fontWeight: "bold",
  },
  exampleText: {
    fontSize: 16,
    color: "white",
    marginTop: 4,
    lineHeight: 26,
  },
  boldText: {
    fontWeight: "bold",
    color: "#2eb12e",
  },
  noWordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noWordText: {
    color: "#2eb12e",
    marginBottom: 10,
    marginTop: 32,
    paddingTop: 32,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2eb12e",
    padding: 10,
    borderRadius: 8,
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
  },
});
