import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useWordStore } from "@/store/useWordStore";
import { Colors } from "@/constants/Colors";
import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";

interface SidePanelProps {
  wordSelected: string | null;
}

export const SidePanelModalWord = ({ wordSelected }: SidePanelProps) => {
  const { wordActive, loading, getWord, generateWord, setActiveWord } = useWordStore();

  useEffect(() => {
    if (wordSelected) {
      getWord(wordSelected);
    }
    return () => {
      setActiveWord(null);
    };
  }, [wordSelected]);

  const listenWord = () => {
    if (wordActive?.word) {
      Speech.speak(wordActive.word, { language: "en-US", rate: 0.9 });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {wordActive ? (
        <View style={styles.content}>
          <WordCardRoot />
        </View>
      ) : (
        <View style={styles.noWordContainer}>
          <View style={styles.wordRow}>
            <Text style={styles.wordText}>{wordSelected}</Text>
            {wordActive && (
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
            onPress={() => generateWord(wordSelected!)}
            disabled={loading || !!wordActive}
            style={[
              styles.generateButton,
              (loading || wordActive) && styles.buttonDisabled,
            ]}
          >
            {loading && (
              <ActivityIndicator
                size="small"
                color="white"
                style={{ marginRight: 10 }}
              />
            )}
            <Text style={styles.generateButtonText}>
              {loading ? "Generating..." : "Generate Word with AI"}
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
  buttonDisabled: {
    backgroundColor: Colors.gray.gray900,
  },
});
