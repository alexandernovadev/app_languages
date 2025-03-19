import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Vibration,
} from "react-native";

import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { Loading } from "@/components/shared/Loading";
import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";
import { useWordStore } from "@/store/useWordStore";

export const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useState(new Animated.Value(0))[0];

  const { words, loading, error, fetchRecentHardOrMediumWords, setActiveWord } =
    useWordStore();

  useEffect(() => {
    fetchRecentHardOrMediumWords();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => Vibration.vibrate(500), 1000);
      return () => {
        Vibration.cancel();
        clearInterval(interval);
      };
    }
  }, [loading]);

  const currentCard = words[currentCardIndex];

  const flipCard: () => void = () => {
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
      if (currentCard) {
        setActiveWord(currentCard);
      }
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

  if (loading && words) return <Loading text={"Loading Cards"} />;

  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.cardIndexText}>
        Card {currentCardIndex + 1} of {words.length}
      </Text>
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
            <TouchableOpacity
              onPress={listenWord}
              style={styles.speakerIconButton}
            >
              <Ionicons
                name="volume-high-outline"
                size={32}
                color={Colors.green.green400}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.pronunciation}>{currentCard?.IPA}</Text>
          {currentCard?.img ? (
            <Image
              source={{ uri: currentCard?.img }}
              style={styles.image}
              resizeMode="stretch"
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
          <WordCardRoot />
        </Animated.View>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentCardIndex === 0}
          style={styles.arrowsButton}
        >
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
          <View style={styles.flipButtonContent}>
            <Ionicons name="sync" size={20} color="white" />
            <Text style={styles.flipButtonText}>Flip</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.arrowsButton} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={32} color="white" />
        </TouchableOpacity>
      </View>
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
    width: "95%",
    height: "82%",
    position: "relative",
  },
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
    borderRadius: 10,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.green.green800,
    backgroundColor: Colors.black.black800,
    paddingHorizontal: 8,
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 0,
  },
  scrollContent: {
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
    color: Colors.green.green600,
  },
  speakerIconButton: {
    marginLeft: 10,
    padding: 12,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.green.green500,
  },
  pronunciation: {
    fontSize: 26 ,
    color: Colors.purple.purpleNova,
    marginTop: 10,
    fontWeight: 'bold',
  },
  image: {
    width: "100%",
    height: 360,
    borderRadius: 16,
    marginTop: 10,
  },
  examplesContainer: {
    marginTop: 10,
  },
  cardIndexText: {
    fontSize: 16,
    color: Colors.white.white300,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    color: Colors.red.red500,
    marginTop: 20,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 12,
  },
  arrowsButton: {
    backgroundColor: Colors.green.green700,
    borderRadius: 50,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green.green700,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  flipButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  flipButtonText: {
    color: Colors.white.white300,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8, // Espacio entre el icono y el texto
  },
});

export default FlashcardApp;
