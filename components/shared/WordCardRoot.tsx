import { useWordCardStore } from "@/store/useWordCardStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import * as Speech from "expo-speech";
import { BACKURL } from "@/api/backurl";
import { Loading } from "@/components/shared/Loading";
import { Word } from "@/interfaces/models/Word";

const WordCardRoot = ({ word }: { word: Word }) => {
  const listenWord = () => {
    Speech.speak(word.word, { language: "en-US", rate: 0.8 });
  };

  const slowerListenWord = () => {
    Speech.speak(word.word, { language: "en-US", rate: 0.09 });
  };

  // Services
  const updateLevel = async (level: string) => {
    if (!word) return;

    try {
      const response = await fetch(`${BACKURL}/api/words/${word?._id}/level`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Word level updated successfully");

        // Actualizar solo la palabra en el store de Zustand sin hacer un fetch completo
        useWordCardStore.setState((state) => ({
          words: state.words.map((word) =>
            word._id === word._id ? { ...word, level } : word
          ),
        }));
      } else {
        console.error("Error updating word level:", data.message);
      }
    } catch (error) {
      console.error("Error updating word level:", error);
    }
  };

  // Helper function to determine level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case "easy":
        return "#248924"; // green for easy
      case "medium":
        return "#0664c8"; // blue for medium
      case "hard":
        return "#c73737"; // red for hard
      default:
        return "#d0de11"; // default color if level is undefined
    }
  };

  return (
    <View style={[styles.card]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.wordRow}>
          <Text style={styles.cardIndexText}>🇺🇸</Text>
          <Text
            style={[
              styles.levelText,
              {
                color: getLevelColor(word.level),
                borderColor: getLevelColor(word.level),
              },
            ]}
          >
            {word.level}
          </Text>
        </View>

        <View style={[styles.wordRow, { marginTop: 12 }]}>
          <Text style={styles.word}>{word.word}</Text>
          <Text style={styles.word}>👀 {word.seen}</Text>
        </View>
        <View style={styles.Row}>
          <Text style={styles.pronunciation}>{word.IPA}</Text>
          <View style={styles.Row}>
            <TouchableOpacity onPress={listenWord} style={styles.speakerIcon}>
              <Ionicons name="volume-high-outline" size={32} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={slowerListenWord}>
              <Text style={styles.speakerTurtleIcon}>🐢</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.definition}>{word.definition}</Text>
        <View style={styles.examplesContainer}>
          <Text style={styles.exampleTextTitle}>{word.spanish.word}</Text>
          <Text style={styles.exampleText}>{word.spanish.definition}</Text>
        </View>
        <Text style={styles.typeText}>{word.type.join(", ")}</Text>

        {word.img ? (
          <Image
            source={{ uri: word.img }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : null}

        {word.examples && (
          <View style={styles.examplesContainer}>
            <View style={styles.wordRow}>
              <Text style={styles.examplesTitle}>Examples</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Refresh examples Comnig soon");
                }}
              >
                <Ionicons name="refresh-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            {word.examples.map((example, index) => (
              <Text key={index} style={styles.exampleText}>
                • {example}
              </Text>
            ))}
          </View>
        )}

        {word.codeSwitching && (
          <View style={styles.examplesContainer}>
            <View style={styles.wordRow}>
              <Text style={styles.examplesTitle}>Code-Switching</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Refresh Code-Switching Comnig soon");
                }}
              >
                <Ionicons name="refresh-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            {word.codeSwitching.map((example, index) => (
              <Text key={index} style={styles.exampleText}>
                • {example}
              </Text>
            ))}
          </View>
        )}

        {word.sinonyms && (
          <View style={styles.examplesContainer}>
            <View style={styles.wordRow}>
              <Text style={styles.examplesTitle}>Synonyms</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Refresh Synonyms Comnig soon");
                }}
              >
                <Ionicons name="refresh-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            {word.sinonyms.map((synonym, index) => (
              <Text key={index} style={styles.exampleText}>
                • {synonym}
              </Text>
            ))}
          </View>
        )}

        <View
          style={[
            styles.Row,
            { marginTop: 20, borderBlockColor: "red", borderWidth: 2 },
          ]}
        >
          <View>
            <Text style={styles.examplesTitle}>Updated</Text>
            <Text style={styles.dates}>Thuesday 12 - 2023</Text>
          </View>
          <View>
            <Text style={styles.examplesTitle}>Created</Text>
            <Text style={styles.dates}>Thuesday 12 - 2023</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.levelButton, styles.easyButton]}
          onPress={() => updateLevel("easy")}
        >
          <Text style={styles.buttonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.levelButton, styles.mediumButton]}
          onPress={() => updateLevel("medium")}
        >
          <Text style={styles.buttonText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.levelButton, styles.hardButton]}
          onPress={() => updateLevel("hard")}
        >
          <Text style={styles.buttonText}>Hard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101010f5",
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  word: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#2eb12e",
  },
  speakerIcon: {
    marginLeft: 10,
  },
  speakerTurtleIcon: {
    marginLeft: 10,
    fontSize: 32,
  },
  pronunciation: {
    fontSize: 18,
    color: "#5944ae", // Morado
    marginTop: 10,
  },
  definition: {
    fontSize: 18,
    color: "#C9D1D9",
    marginTop: 10,
  },
  typeText: {
    fontSize: 16,
    color: "#5944ae",
    marginTop: 5,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5, // Añadir espacio vertical para mejor apariencia
    borderColor: "#5944ae",
    width: "auto", // Ancho dinámico según el contenido
    height: "auto", // Alto dinámico
    textAlign: "center",
    textTransform: "capitalize",
  },
  dates: {
    fontSize: 16,
    color: "#C9D1D9",
    marginTop: 10,
  },
  levelText: {
    fontSize: 18,
    color: "#d0de11",
    paddingHorizontal: 10,
    textTransform: "capitalize",
    fontWeight: "bold",
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    width: "auto",
    height: "auto",
    textAlign: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#f9f9f9",
  },
  examplesContainer: {
    marginTop: 10,
  },
  examplesTitle: {
    fontSize: 20,
    color: "#2eb12e",
    fontWeight: "bold",
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 16,
    color: "#8B949E",
    marginTop: 4,
    lineHeight: 24,
  },
  exampleTextTitle: {
    fontSize: 22,
    textTransform: "capitalize",
    marginTop: 4,
    lineHeight: 24,
    color: "#2eb12e",
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
    color: "#2eb12e",
  },

  cardIndexText: {
    fontSize: 16,
    color: "#C9D1D9",
  },
  errorText: {
    fontSize: 18,
    color: "#ff4c4c",
    marginTop: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    marginTop: 20,
  },
  levelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  easyButton: {
    backgroundColor: "#248924",
  },
  mediumButton: {
    backgroundColor: "#0664c8",
  },
  hardButton: {
    backgroundColor: "#c73737",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WordCardRoot;
