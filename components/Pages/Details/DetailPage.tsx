import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
} from "react-native";

import * as Speech from "expo-speech";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Lecture } from "@/interfaces/models/Lectures";
import { useLectureStore } from "@/store/useLectureStore";
import { ModalDragger } from "@/components/shared/ModalDragger";
import { MarkDownRender } from "@/components/Pages/Details/MarkDownRender";
import { Loading } from "@/components/shared/Loading";
import { Colors } from "@/constants/Colors";
import { SidePanelModalWord } from "./SidePanelModalWord";
import { triggerVibration } from "@/utils/vibrationHaptic";
import { useWordStore } from "@/store/useWordStore";

export const DetailPage = () => {
  const [lecture, setLecture] = useState<Lecture>();
  const [isLoading, setIsLoading] = useState(true);
  const [wordSelected, setWordSelected] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const { id } = useLocalSearchParams();
  useWordStore();

  const getLectureById = useLectureStore((state) => state.getLectureById);
  const setActiveWord = useWordStore((state) => state.setActiveWord);

  useEffect(() => {
    setIsLoading(true);
    const fetchedLecture = getLectureById(String(id));
    setLecture(fetchedLecture);
    setIsLoading(false);
    setActiveWord(null);
  }, [id]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => triggerVibration("pulse"), 810);
      return () => {
        Vibration.cancel();
        clearInterval(interval);
      };
    }
  }, [isLoading]);

  const speakWord = useCallback((word: string) => {
    triggerVibration("medium");
    if (word) {
      Speech.speak(word, {
        language: "en-US",
        rate: 0.9,
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading text={"Loading Lecture"} />
      ) : (
        <MarkDownRender
          lecture={lecture}
          id={String(id)}
          setWordSelected={setWordSelected}
        />
      )}

      {wordSelected.length > 0 && (
        <View style={styles.wordActionContainer}>
          <TouchableOpacity
            style={{ padding: 24 }}
            onPress={() => {
              speakWord(wordSelected);
            }}
          >
            <Ionicons name="volume-high-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.wordSelected}>{wordSelected}</Text>
          <TouchableOpacity
            style={{ padding: 24 }}
            onPress={() => {
              triggerVibration("medium");
              setModalVisible(true);
            }}
          >
            <Ionicons name="book-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {isModalVisible && (
        <ModalDragger
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        >
          <SidePanelModalWord wordSelected={wordSelected} />
        </ModalDragger>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black.black900,
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  wordActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: Colors.black.black300,
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: "center",
  },
  wordSelected: {
    textTransform: "capitalize",
    fontWeight: "bold",
    color: Colors.white.white300,
    fontSize: 24,
  },
});
