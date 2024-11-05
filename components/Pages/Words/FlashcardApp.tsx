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

const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useState(new Animated.Value(0))[0];

  // Zustand store to fetch words
  const { words, loading, error, fetchRecentHardOrMediumWords } = useWordCardStore();

  // Fetch words data on component mount
  useEffect(() => {
    fetchRecentHardOrMediumWords();
  }, []);

  // Show loading or error messages
  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
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
      Speech.speak(currentCard.word, { language: "en-US" });
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
            <Text style={styles.word}>{currentCard.word}</Text>
            <TouchableOpacity onPress={listenWord} style={styles.speakerIcon}>
              <Ionicons name="volume-high-outline" size={32} color="#2eb12e" />
            </TouchableOpacity>
          </View>
          <Text style={styles.pronunciation}>{currentCard.IPA}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotateY: backInterpolate }] },
            flipped && styles.cardBack,
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.definition}>{currentCard.definition}</Text>
            {currentCard.type && (
              <Text style={styles.typeText}>Type: {currentCard.type.join(", ")}</Text>
            )}
            {currentCard.level && (
              <Text style={styles.levelText}>Level: {currentCard.level}</Text>
            )}

            {currentCard.img ? (
              <Image
                source={{ uri: currentCard.img }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : null}

            {currentCard.examples && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Examples</Text>
                {currentCard.examples.map((example, index) => (
                  <Text key={index} style={styles.exampleText}>
                    • {example}
                  </Text>
                ))}
              </View>
            )}

            {currentCard.codeSwitching && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Code-Switching Examples</Text>
                {currentCard.codeSwitching.map((example, index) => (
                  <Text key={index} style={styles.exampleText}>
                    • {example}
                  </Text>
                ))}
              </View>
            )}

            {currentCard.sinonyms && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Synonyms</Text>
                {currentCard.sinonyms.map((synonym, index) => (
                  <Text key={index} style={styles.exampleText}>
                    • {synonym}
                  </Text>
                ))}
              </View>
            )}

            {currentCard.spanish && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Spanish Translation</Text>
                <Text style={styles.exampleText}>
                  <Text style={styles.boldText}>Word: </Text>
                  {currentCard.spanish.word}
                </Text>
                <Text style={styles.exampleText}>
                  <Text style={styles.boldText}>Definition: </Text>
                  {currentCard.spanish.definition}
                </Text>
              </View>
            )}
          </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#2eb12e",
  },
  speakerIcon: {
    marginLeft: 10,
  },
  pronunciation: {
    fontSize: 18,
    color: "#8B949E",
    marginTop: 10,
  },
  definition: {
    fontSize: 18,
    color: "#C9D1D9",
    textAlign: "center",
    marginTop: 10,
  },
  typeText: {
    fontSize: 16,
    color: "#44ae44",
    marginTop: 5,
  },
  levelText: {
    fontSize: 16,
    color: "#d0de11",
    marginTop: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#2eb12e",
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
  loadingText: {
    fontSize: 18,
    color: "#2eb12e",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff4c4c",
    marginTop: 20,
  },
});

export default FlashcardApp;
