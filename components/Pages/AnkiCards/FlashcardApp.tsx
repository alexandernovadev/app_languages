import { useWordCardStore } from "@/store/useWordCardStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Image,
} from "react-native";
import * as Speech from "expo-speech";
import { BACKURL } from "@/api/backurl";
import { Loading } from "@/components/shared/Loading";
import { Colors } from "@/constants/Colors";

export const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useState(new Animated.Value(0))[0];

  // Zustand store to fetch words
  const { words, loading, error, fetchRecentHardOrMediumWords } =
    useWordCardStore();

  // Fetch words data on component mount
  useEffect(() => {
    fetchRecentHardOrMediumWords();
  }, []);

  if (loading) return <Loading text={"Loading Cards"} />;

  if (error) return <Text style={styles.errorText}>{error}</Text>;

  const currentCard = words[currentCardIndex];

  const flipCard = () => {
    if (flipped) {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const handleNext = () => {
    setFlipped(false);
    flipAnimation.setValue(0); // Reset to front
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handlePrevious = () => {
    setFlipped(false);
    flipAnimation.setValue(0);
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? words.length - 1 : prevIndex - 1
    );
  };

  const listenWord = () => {
    if (currentCard?.word) {
      Speech.speak(currentCard?.word, { language: "en-US" });
    }
  };

  const updateLevel = async (level: string) => {
    if (!currentCard) return;

    try {
      const response = await fetch(
        `${BACKURL}/api/words/${currentCard?._id}/level`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ level }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("Word level updated successfully");

        // Actualizar solo la palabra en el store de Zustand sin hacer un fetch completo
        useWordCardStore.setState((state) => ({
          words: state.words.map((word) =>
            word._id === currentCard._id ? { ...word, level } : word
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
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotateY: frontInterpolate }] },
            !flipped && styles.cardFront,
          ]}
        >
          <View style={styles.wordRow}>
            <Text style={styles.word}>{currentCard?.word}</Text>
            <TouchableOpacity onPress={listenWord} style={styles.speakerIcon}>
              <Ionicons name="volume-high-outline" size={32} color={Colors.green.green400} />
            </TouchableOpacity>
          </View>
          <Text style={styles.pronunciation}>{currentCard?.IPA}</Text>
          {currentCard?.img ? (
            <Image
              source={{ uri: currentCard?.img }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : null}
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotateY: backInterpolate }] },
            flipped && styles.cardBack,
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {currentCard?.type && (
              <Text style={styles.typeText}>
                {currentCard?.type.join(", ")}
              </Text>
            )}
            {currentCard?.level && (
              <Text
                style={[
                  styles.levelText,
                  { textTransform: "capitalize", fontWeight: "bold" },
                  {
                    color: getLevelColor(currentCard.level),
                    borderColor: getLevelColor(currentCard.level),
                  },
                ]}
              >
                {currentCard.level}
              </Text>
            )}

            <View style={[styles.wordRow, { marginTop: 12 }]}>
              <Text style={styles.word}>{currentCard?.word}</Text>
              <TouchableOpacity onPress={listenWord} style={styles.speakerIcon}>
                <Ionicons
                  name="volume-high-outline"
                  size={32}
                  color={Colors.white.white300}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.pronunciation}>{currentCard?.IPA}</Text>
            <Text style={styles.definition}>{currentCard?.definition}</Text>

            {currentCard?.spanish && (
              <View style={styles.examplesContainer}>
                <Text style={styles.exampleTextTitle}>
                  {currentCard?.spanish.word}
                </Text>
                <Text style={styles.exampleText}>
                  {currentCard?.spanish.definition}
                </Text>
              </View>
            )}

            {currentCard?.img ? (
              <Image
                source={{ uri: currentCard?.img }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : null}

            {currentCard?.examples && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Examples</Text>
                {currentCard?.examples.map((example, index) => (
                  <Text key={index} style={styles.exampleText}>
                    • {example}
                  </Text>
                ))}
              </View>
            )}

            {currentCard?.codeSwitching && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>
                  Code-Switching Examples
                </Text>
                {currentCard?.codeSwitching.map((example, index) => (
                  <Text key={index} style={styles.exampleText}>
                    • {example}
                  </Text>
                ))}
              </View>
            )}

            {currentCard?.sinonyms && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Synonyms</Text>
                {currentCard?.sinonyms.map((synonym, index) => (
                  <Text key={index} style={styles.exampleText}>
                    • {synonym}
                  </Text>
                ))}
              </View>
            )}
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
        </Animated.View>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentCardIndex === 0}
        >
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.cardIndexText}>
          Card {currentCardIndex + 1} of {words.length}
        </Text>
        <TouchableOpacity onPress={handleNext}>
          <Ionicons name="chevron-forward" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
        <Text style={styles.flipButtonText}>
          <Ionicons
            name="sync"
            size={16}
            style={{ paddingHorizontal: 13 }}
            color="white"
          />
          Flip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: 320,
    height: 620,
    position: "relative",
  },
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f2023a8",
    borderWidth: 1,
    borderColor: "#2eb12e",
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 0,
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
  word: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#2eb12e",
  },
  speakerIcon: {
    marginLeft: 10,
  },
  pronunciation: {
    fontSize: 20,
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

  levelText: {
    fontSize: 18,
    color: "#d0de11",
    paddingHorizontal: 10, // Espaciado horizontal para forma de píldora
    paddingVertical: 5, // Agregar espacio vertical
    borderRadius: 12,
    borderWidth: 1,
    width: "auto", // Ancho automático
    height: "auto", // Alto automático
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
  flipButton: {
    marginTop: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#238636",
    borderRadius: 5,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  flipButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    padding: 5,
    marginHorizontal: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "76%",
    marginTop: 20,
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

export default FlashcardApp;
