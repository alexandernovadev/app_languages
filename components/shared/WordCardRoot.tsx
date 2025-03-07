import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import { getLevelColor } from "@/utils/getLevelColor";
import { BACKURL } from "@/api/backurl";
import { Word } from "@/interfaces/models/Word";
import { Colors } from "@/constants/Colors";
import { useWordCardStore } from "@/store/useWordCardStore";

const WordCardRoot = ({ word }: { word: Word }) => {
  const listenWord = (rate = 0.8, language = "en-US") => {
    Speech.speak(word.word, { language, rate });
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

  return (
    <View style={styles.card}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.levellangContainer}>
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

        <View style={styles.wordSeensContainer}>
          <Text style={styles.textWord}>{word.word}</Text>
          <Text style={styles.textSeen}>👀 {word.seen}</Text>
        </View>

        <View style={styles.ipaSpeakerContainer}>
          <Text style={styles.pronunciation}>{word.IPA}</Text>
          <View style={styles.speakersContainer}>
            <TouchableOpacity
              onPress={() => listenWord}
              style={styles.speakerIcon}
            >
              <Text style={styles.speakersIcons}>🔊</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => listenWord(0.09)}>
              <Text style={styles.speakersIcons}>🐢</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.definition} selectable>{word.definition}</Text>

        <View style={styles.spanishContainer}>
          <Text style={styles.spanishWord}>{word.spanish.word}</Text>
          <Text style={styles.spanisDefinition}>{word.spanish.definition}</Text>
        </View>

        <View style={styles.imageContainer}>
          <View style={styles.RowContainer}>
            <Text style={styles.titleBox}>Image</Text>
            <TouchableOpacity
              onPress={() => {
                console.log("Refresh examples Comnig soon");
              }}
            >
              <Ionicons
                name="refresh-outline"
                size={24}
                color={Colors.white.white300}
              />
            </TouchableOpacity>
          </View>
          {word.img ? (
            <Image
              source={{ uri: word.img }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : null}
        </View>

        {word.examples && (
          <View style={styles.examplesContainer}>
            <View style={styles.RowContainer}>
              <Text style={styles.titleBox}>Examples</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Refresh examples Comnig soon");
                }}
              >
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color={Colors.white.white300}
                />
              </TouchableOpacity>
            </View>
            {word.examples.map((example, index) => (
              <Text key={index} style={styles.exampleText} selectable>
                • {example}
              </Text>
            ))}
          </View>
        )}

        {word.codeSwitching && (
          <View style={styles.codeSwitchingContainer}>
            <View style={styles.RowContainer}>
              <Text style={styles.titleBox}>Code-Switching</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Refresh Code-Switching Comnig soon");
                }}
              >
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color={Colors.white.white300}
                />
              </TouchableOpacity>
            </View>
            {word.codeSwitching.map((example, index) => (
              <Text key={index} style={styles.exampleText} selectable>
                • {example}
              </Text>
            ))}
          </View>
        )}

        {word.sinonyms && (
          <View style={styles.synonymsContainer}>
            <View style={styles.RowContainer}>
              <Text style={styles.titleBox}>Synonyms</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Refresh Synonyms Comnig soon");
                }}
              >
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color={Colors.white.white300}
                />
              </TouchableOpacity>
            </View>
            {word.sinonyms.map((synonym, index) => (
              <Text key={index} style={styles.synonymList} selectable>
                🔹 {synonym}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.typeWordContainer}>
          <Text style={styles.titleBox}>Type Word</Text>
          <Text style={styles.typeText}>{word.type.join(", ")}</Text>
        </View>

        <View style={styles.datesContainer}>
          <View>
            <Text style={styles.titleBox}>Updated</Text>
            <Text style={styles.dates}>Thuesday 12 - 2023</Text>
          </View>
          <View>
            <Text style={styles.titleBox}>Created</Text>
            <Text style={styles.dates}>Thuesday 12 - 2023</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonsLevelContainer}>
        <TouchableOpacity
          style={[styles.levelButton, styles.easyButton]}
          onPress={() => updateLevel("easy")}
        >
          <Text style={styles.buttonLevelText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.levelButton, styles.mediumButton]}
          onPress={() => updateLevel("medium")}
        >
          <Text style={styles.buttonLevelText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.levelButton, styles.hardButton]}
          onPress={() => updateLevel("hard")}
        >
          <Text style={styles.buttonLevelText}>Hard</Text>
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
    backgroundColor: Colors.black.black800,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  wordSeensContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  RowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  ipaSpeakerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  speakersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levellangContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textWord: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: Colors.green.green600,
  },
  textSeen: {
    fontSize: 16,
    color: Colors.yellow.yellow500,
    fontWeight: "bold",
  },
  speakerIcon: {
    marginLeft: 10,
  },
  speakersIcons: {
    marginLeft: 10,
    fontSize: 20,
    borderColor: Colors.white.white500,
    borderWidth: 2,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 9,
  },
  pronunciation: {
    fontSize: 20,
    color: Colors.purple.purpleNova,
    marginTop: 10,
  },
  definition: {
    fontSize: 18,
    color: Colors.gray.gray400,
    marginTop: 10,
  },
  typeText: {
    fontSize: 16,
    color: Colors.white.white200,
    marginTop: 5,
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: Colors.purple.purpleNova,
    width: "auto",
    height: "auto",
    textAlign: "center",
    textTransform: "capitalize",
  },
  dates: {
    fontSize: 16,
    color: Colors.gray.gray400,
    marginTop: 10,
  },
  levelText: {
    fontSize: 18,
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
    borderRadius: 10,
    marginTop: 10,
    aspectRatio: 16 / 9,
  },
  examplesContainer: {
    marginVertical: 10,
  },

  spanishContainer: {
    marginVertical: 10,
  },
  imageContainer: {
    marginVertical: 10,
  },
  spanishWord: {
    color: Colors.blue.blue800,
    fontSize: 24,
    textTransform: "capitalize",
    fontWeight: "bold",
    marginBottom: 6,
    lineHeight: 24,
  },
  spanisDefinition: {
    color: Colors.white.white700,
    lineHeight: 24,
    fontSize: 17,
  },
  codeSwitchingContainer: {
    marginTop: 10,
  },
  synonymsContainer: {
    marginTop: 10,
  },
  titleBox: {
    fontSize: 18,
    color: Colors.silver.silver400,
    fontWeight: "bold",
    marginBottom: 6,
    textDecorationLine: "underline",
    fontStyle: "italic",
  },
  exampleText: {
    fontSize: 16,
    color: Colors.white.white500,
    marginTop: 4,
    lineHeight: 24,
  },
  synonymList: {
    fontSize: 16,
    color: Colors.white.white900,
    marginTop: 4,
    lineHeight: 24,
    textTransform: "capitalize",
  },
  exampleTextTitle: {
    fontSize: 22,
    textTransform: "capitalize",
    marginTop: 4,
    lineHeight: 24,
    color: Colors.green.green500,
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
    color: Colors.green.green500,
  },

  cardIndexText: {
    fontSize: 16,
    color: Colors.blue.blue500,
  },
  errorText: {
    fontSize: 18,
    color: Colors.red.red500,
    marginTop: 20,
  },
  datesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    borderBlockColor: Colors.orange.orange500,
    borderWidth: 2,
  },
  buttonsLevelContainer: {
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
    backgroundColor: Colors.green.green700,
  },
  mediumButton: {
    backgroundColor: Colors.blue.blue700,
  },
  hardButton: {
    backgroundColor: Colors.red.red700,
  },
  buttonLevelText: {
    color: Colors.white.white200,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WordCardRoot;
