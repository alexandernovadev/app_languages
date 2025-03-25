import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Vibration,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import { getLevelColor } from "@/utils/getLevelColor";
import { Colors } from "@/constants/Colors";
import { SectionContainerProps, SectionHeaderProps, StylesType } from "./types";
import { useWordStore } from "@/store/useWordStore";
import { formatDateV1 } from "@/utils/formatDates";
import LoadingBar from "../LoadingBar";
import { triggerVibration } from "@/utils/vibrationHaptic";

const WordCardRoot = () => {
  const {
    wordActive: word,
    loadingUpdate,
    updateWordLevel,
    updateWordExamples,
    updateWordImage,
    updateWordCodeSwitching,
    updateWordSynonyms,
    updateWordTypes,
  } = useWordStore();

  const scrollRef = useRef<ScrollView>(null);

  const listenWord = (rate = 0.8, language = "en-US") => {
    triggerVibration("medium");
    Speech.speak(word?.word!, { language, rate });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [word]);

  useEffect(() => {
    if (loadingUpdate) {
      const interval = setInterval(() => triggerVibration("pulse"), 1000);
      return () => {
        Vibration.cancel();
        clearInterval(interval);
      };
    }
  }, [loadingUpdate]);

  const SectionContainer = ({
    children,
    hasBox = false,
    style = {},
  }: SectionContainerProps) => (
    <View
      style={[hasBox ? styles.boxedContainer : styles.sectionContainer, style]}
    >
      {children}
    </View>
  );

  const SectionHeader = ({ title, onRefresh }: SectionHeaderProps) => (
    <View style={styles.rowContainer}>
      <Text style={styles.titleBox}>{title}</Text>
      {onRefresh && (
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => {
            triggerVibration("medium");
            onRefresh();
          }}
          disabled={loadingUpdate}
        >
          <Ionicons
            name="refresh-outline"
            size={24}
            color={loadingUpdate ? Colors.gray.gray800 : Colors.white.white200}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (!word) return <Text style={styles.itemText}>NO WORKS</Text>;

  return (
    <View style={styles.card}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
        <View style={styles.rowContainer}>
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

        <View style={styles.rowContainer}>
          <Text style={styles.textWord}>{word.word}</Text>
          <Text style={styles.textSeen}>👀 {word.seen}</Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.pronunciation}>{word.IPA}</Text>
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

        <Text style={styles.definition} selectable>
          {word.definition}
        </Text>

        <SectionContainer style={styles.spanishContainer}>
          <Text style={styles.spanishWord}>{word.spanish.word}</Text>
          <Text style={styles.spanisDefinition}>{word.spanish.definition}</Text>
        </SectionContainer>

        <SectionContainer hasBox>
          <TouchableOpacity
            onPress={() => updateWordImage(word._id!, word.word, word.img!)}
            style={[
              styles.buttonRefreshImage,
              word.img ? styles.buttonWithImage : null,
            ]}
          >
            <Ionicons
              name="refresh-outline"
              size={24}
              style={[
                loadingUpdate
                  ? styles.RefreshImageIconLoading
                  : styles.RefreshImageIcon,
              ]}
              color={
                loadingUpdate ? Colors.gray.gray600 : Colors.white.white500
              }
            />
          </TouchableOpacity>
          {word.img ? (
            <Image
              source={{ uri: word.img }}
              style={styles.image}
              resizeMode="stretch"
            />
          ) : (
            <Text
              style={{
                color: Colors.white.white400,
              }}
            >
              No Image
            </Text>
          )}
        </SectionContainer>

        {word.examples && (
          <SectionContainer hasBox>
            <SectionHeader
              title="Examples"
              onRefresh={() =>
                updateWordExamples(
                  word._id!,
                  word.word,
                  word.language,
                  word.examples
                )
              }
            />
            {word.examples.map((example, index) => (
              <Text key={index} style={styles.itemText} selectable>
                • {example}
              </Text>
            ))}
          </SectionContainer>
        )}

        {word.codeSwitching && (
          <SectionContainer hasBox>
            <SectionHeader
              title="Code-Switching"
              onRefresh={() =>
                updateWordCodeSwitching(
                  word._id!,
                  word.word,
                  word.language,
                  word.codeSwitching
                )
              }
            />
            {word.codeSwitching.map((example, index) => (
              <Text key={index} style={styles.itemText} selectable>
                • {example}
              </Text>
            ))}
          </SectionContainer>
        )}

        {word.sinonyms && (
          <SectionContainer hasBox>
            <SectionHeader
              title="Synonyms"
              onRefresh={() =>
                updateWordSynonyms(
                  word._id!,
                  word.word,
                  word.language,
                  word.sinonyms || []
                )
              }
            />
            {word.sinonyms.map((synonym, index) => (
              <Text key={index} style={styles.synonymList} selectable>
                🔹 {synonym}
              </Text>
            ))}
          </SectionContainer>
        )}

        {/* Sección de tipos con refresh */}
        {word.type && (
          <SectionContainer hasBox>
            <SectionHeader
              title="Word Types"
              onRefresh={() =>
                updateWordTypes(
                  word._id!,
                  word.word,
                  word.language,
                  word.type || []
                )
              }
            />
            {word.type.map((type, index) => (
              <Text key={index} style={styles.synonymList} selectable>
                🪹 {type}
              </Text>
            ))}
          </SectionContainer>
        )}

        {/* Sección mejorada de fechas */}
        <SectionContainer hasBox style={styles.datesContainer}>
          <View style={styles.datesContent}>
            <View style={styles.dateItem}>
              <Text style={styles.titleBox}>Updated</Text>
              <Text style={styles.dates}>
                {formatDateV1(String(word.updatedAt))}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.titleBox}>Created</Text>
              <Text style={styles.dates}>
                {formatDateV1(String(word.createdAt))}
              </Text>
            </View>
          </View>
        </SectionContainer>
      </ScrollView>

      {loadingUpdate && (
        <View style={styles.loadingContainer}>
          <LoadingBar />
        </View>
      )}
      <View style={styles.buttonsLevelContainer}>
        {["easy", "medium", "hard"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.levelButton,
              styles[`${level}Button` as keyof StylesType],
              loadingUpdate && { opacity: 0.5 },
            ]}
            onPress={() => updateWordLevel(word._id!, level)}
            disabled={loadingUpdate}
          >
            <Text style={styles.buttonLevelText}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Estilos tipados
const styles = StyleSheet.create<StylesType>({
  // Contenedores principales
  card: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.black.black800,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },

  // Layout containers
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  sectionContainer: {
    marginVertical: 2,
  },
  boxedContainer: {
    marginVertical: 10,
    borderColor: Colors.black.black200,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    position: "relative",
  },
  buttonsLevelContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  datesContainer: {
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.orange.orange500,
    borderRadius: 10,
  },
  datesContent: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  dateItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  spanishContainer: {
    marginVertical: 10,
  },

  // Word header styles
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
  pronunciation: {
    fontSize: 24,
    color: Colors.purple.purpleNova,
    marginTop: 10,
    fontWeight: "bold",
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
  cardIndexText: {
    fontSize: 16,
    color: Colors.blue.blue500,
  },

  // Pronunciation icons
  speakerIcon: {
    marginLeft: 10,
  },
  buttonRefreshImage: {
    zIndex: 999,
    display: "flex",
    width: "100%",
    alignItems: "flex-end",
  },
  buttonWithImage: {
    position: "absolute",
    top: 23,
  },
  RefreshImageIcon: {
    backgroundColor: Colors.green.green600,
    borderWidth: 2,
    borderColor: Colors.white.white500,
    borderRadius: 100,
    padding: 4,
  },

  RefreshImageIconLoading: {
    borderRadius: 100,
    padding: 4,
    backgroundColor: Colors.green.green800,
    borderWidth: 2,
    borderColor: Colors.gray.gray600,
  },
  speakersIcons: {
    marginLeft: 10,
    fontSize: 20,
    borderColor: Colors.white.white500,
    borderWidth: 2,
    borderRadius: 100,
    padding: 9,
  },

  // Content styles
  definition: {
    fontSize: 18,
    color: Colors.gray.gray400,
    marginTop: 10,
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
  titleBox: {
    fontSize: 17,
    color: Colors.silver.silver400,
    fontWeight: "bold",
  },
  itemText: {
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
    color: Colors.gray.gray300,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
    height: 360,
    zIndex: 1,
  },

  // Button styles
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
