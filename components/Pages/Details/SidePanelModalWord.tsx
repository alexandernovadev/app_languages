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
import { Colors } from "@/constants/Colors";
import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";

interface SidePanelProps {
  isVisible: boolean;
  wordSelected: string | null;
}

export const SidePanelModalWord = ({
  isVisible,
  wordSelected,
}: SidePanelProps) => {
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
      {wordDb ? (
        <View style={styles.content}>
          <WordCardRoot word={wordDb} />
        </View>
      ) : (
        <View style={styles.noWordContainer}>
          <View style={styles.wordRow}>
            <Text style={styles.wordText}>{wordSelected}</Text>
            {wordDb && (
              <TouchableOpacity onPress={listenWord} style={styles.speakerIcon}>
                <Ionicons
                  name="volume-high-outline"
                  size={32}
                  color={Colors.white.white300}
                />
              </TouchableOpacity>
            )}
          </View>

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
    color: Colors.green.green600,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  speakerIcon: {
    marginLeft: 10,
  },
  content: {
    marginTop: 20,
  },
  boldText: {
    fontWeight: "bold",
    color: Colors.green.green600,
  },
  noWordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noWordText: {
    color: Colors.green.green600,
    marginBottom: 10,
    marginTop: 32,
    paddingTop: 32,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.green.green600,
    padding: 10,
    borderRadius: 8,
  },
  generateButtonText: {
    color: Colors.white.white300,
    fontSize: 16,
  },
});
