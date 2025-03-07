import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Lecture } from "@/interfaces/models/Lectures";
import { useLectureStore } from "@/store/useLectureStore";
import { ModalDragger } from "@/components/shared/ModalDragger";
import { MarkDownRender } from "@/components/Pages/Details/MarkDownRender";
import { Loading } from "@/components/shared/Loading";

export default function DetailsScreen() {
  const [lecture, setLecture] = useState<Lecture>();
  const [isLoading, setIsLoading] = useState(true);
  const [wordSelected, setWordSelected] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const { id } = useLocalSearchParams();

  const getLectureById = useLectureStore((state) => state.getLectureById);

  useEffect(() => {
    setIsLoading(true);
    const fetchedLecture = getLectureById(String(id));
    setLecture(fetchedLecture);
    setIsLoading(false);
  }, [id]);

  const speakWord = useCallback((word: string) => {
    if (word) {
      Speech.speak(word, {
        language: "en-US",
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
            onPress={() => speakWord(wordSelected)}
          >
            <Ionicons name="volume-high-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.wordSelected}>{wordSelected}</Text>
          <TouchableOpacity
            style={{ padding: 24 }}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="book-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {isModalVisible && (
        <ModalDragger
          wordSelected={wordSelected}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  wordActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: "center",
  },
  wordSelected: {
    textTransform: "capitalize",
    fontWeight: "bold",
    color: "#eeeeee",
    fontSize: 24,
  },
});
