import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from "react-native";

const mockData = [
  {
    id: 1,
    word: "Infrastructure",
    pronunciation: "/ˈɪnfrəˌstrʌktʃər/",
    definition:
      "The basic physical and organizational structures and facilities needed for the operation of a society or enterprise.",
    examples: [
      "The government invested heavily in the country's infrastructure to support economic growth.",
      "Infrastructure projects like roads and bridges are essential for a growing city.",
      "The company expanded its infrastructure to improve its production capabilities.",
      "Good digital infrastructure is key to the success of online businesses.",
      "Good digital infrastructure is key to the success of online businesses.",
      "Good digital infrastructure is key to the success of online businesses.",
      "Good digital infrastructure is key to the success of online businesses.",
      "Good digital infrastructure is key to the success of online businesses.",
      "Good digital infrastructure is key to the success of online businesses.",
      "Good digital infrastructure is key to the success of online businesses.",
      "Good digital infrastructure is key to the success of online businesses.",
      "Good digital infrastructure is key to the success of online businesses.",
      "After the natural disaster, rebuilding infrastructure became the government's top priority.",
    ],
  },
  {
    id: 2,
    word: "segunda",
    pronunciation: "/ˈɪnfrəˌstrʌktʃər/",
    definition:
      "Another definition representing the second card content in the mock data.",
    examples: [
      "Example 1 for segunda.",
      "Example 2 for segunda.",
      "Example 3 for segunda.",
    ],
  },
  {
    id: 3,
    word: "tercera",
    pronunciation: "/ˈɪnfrəˌstrʌktʃər/",
    definition:
      "Additional definition text for the third card in the mock data set.",
    examples: [
      "Example 1 for tercera.",
      "Example 2 for tercera.",
      "Example 3 for tercera.",
    ],
  },
];

const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useState(new Animated.Value(0))[0];

  const currentCard = mockData[currentCardIndex];

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
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % mockData.length);
  };

  const handlePrevious = () => {
    setFlipped(false);
    flipAnimation.setValue(0); // Reset to front
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? mockData.length - 1 : prevIndex - 1
    );
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
          <Text style={styles.word}>{currentCard.word}</Text>
          <Text style={styles.pronunciation}>{currentCard.pronunciation}</Text>
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
            <Text style={styles.examplesTitle}>Examples:</Text>
            {currentCard.examples.map((example, index) => (
              <Text key={index} style={styles.example}>
                • {example}
              </Text>
            ))}
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
          Card {currentCardIndex + 1} of {mockData.length}
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
    backgroundColor: "#161B22",
    borderWidth: 1,
    borderColor: "#2b6412",
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
  word: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#C9D1D9",
  },
  pronunciation: {
    fontSize: 18,
    color: "#8B949E",
    marginTop: 10,
  },
  definition: {
    fontSize: 16,
    color: "#C9D1D9",
    textAlign: "center",
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C9D1D9",
    marginTop: 20,
  },
  example: {
    fontSize: 14,
    color: "#8B949E",
    marginTop: 5,
    textAlign: "left",
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
    display: "flex",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "76%",
    marginTop: 20,
  },
  navButton: {
    fontSize: 16,
    color: "#238636",
    marginHorizontal: 20,
  },
  disabledNav: {
    color: "#8B949E",
  },
  cardIndexText: {
    fontSize: 16,
    color: "#C9D1D9",
  },
});

export default FlashcardApp;
