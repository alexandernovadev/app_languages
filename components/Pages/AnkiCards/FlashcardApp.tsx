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
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";

import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { Loading } from "@/components/shared/Loading";
import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";
import { useWordStore } from "@/store/useWordStore";
import { triggerVibration } from "@/utils/vibrationHaptic";

export const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useState(new Animated.Value(0))[0];
  const [refreshing, setRefreshing] = useState(false);

  const { words, loading, error, fetchRecentHardOrMediumWords, setActiveWord } =
    useWordStore();

  useEffect(() => {
    fetchRecentHardOrMediumWords();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => triggerVibration("pulse"), 1000);
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
    triggerVibration("doubleTap");
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
    triggerVibration("light");
    setFlipped(false);
    flipAnimation.setValue(0);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handlePrevious = () => {
    triggerVibration("light");
    setFlipped(false);
    flipAnimation.setValue(0);
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? words.length - 1 : prevIndex - 1
    );
  };

  const listenWord = (rate = 0.8, language = "en-US") => {
    triggerVibration("medium");
    Speech.speak(currentCard?.word, { language, rate });
  };

  const handleDoubleTap = (() => {
    let lastTap = 0;
    return () => {
      const now = Date.now();
      if (now - lastTap < 300) {
        listenWord();
      }
      lastTap = now;
    };
  })();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    triggerVibration("medium");
    // Reinicia el índice de la tarjeta actual y recarga las palabras
    setCurrentCardIndex(0);
    setFlipped(false);
    flipAnimation.setValue(0);

    // Recarga las palabras
    fetchRecentHardOrMediumWords().then(() => {
      setRefreshing(false);
    });
  }, []);

  if (loading && words) return <Loading text={"Loading Cards"} />;

  if (error)
    return (
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={styles.headerContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>Pull to refresh and try again</Text>
        </View>
      </ScrollView>
    );

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%" }} // Add this
        contentContainerStyle={styles.headerContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // colors={[Colors.green.green500]}
            // tintColor={Colors.green.green500}
            // progressBackgroundColor={Colors.black.black800}
          />
        }
      >
        <Text style={styles.cardIndexText}>
          Card {currentCardIndex + 1} of {words.length}
        </Text>
      </ScrollView>
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
            <View style={styles.rowContainer}>
              <TouchableOpacity
                onPress={() => listenWord()}
                style={styles.speakerIcon}
              >
                <Text style={styles.speakersIcons}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => listenWord(0.09)}>
                <Text style={styles.speakersIcons}>🐢</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.pronunciation}>{currentCard?.IPA}</Text>
          {currentCard?.img ? (
            <Pressable
              onPress={() => handleDoubleTap()}
              style={{ width: "100%" }}
            >
              <Image
                source={{ uri: currentCard?.img }}
                style={styles.image}
                resizeMode="stretch"
              />
            </Pressable>
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
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
    padding: 9,
  },
  cardContainer: {
    width: "95%",
    height: "80%",
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
  headerContainer: {
    paddingVertical: 8,
    paddingTop: 30,
    paddingHorizontal: 0,
    width: "100%",
    alignItems: "center",
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
    fontSize: 26,
    color: Colors.purple.purpleNova,
    marginTop: 10,
    fontWeight: "bold",
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
    width: "100%",
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  errorContainer: {
    backgroundColor: Colors.red.red600,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.red.red200,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  errorText: {
    fontSize: 20,
    color: Colors.white.white300,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  errorHint: {
    fontSize: 16,
    color: Colors.white.white500,
    textAlign: "center",
    opacity: 0.8,
  },
});

export default FlashcardApp;
