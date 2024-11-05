import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Speech from "expo-speech";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Lecture } from "@/interfaces/models/Lectures";
import { useLectureStore } from "@/store/useLectureStore";
import { ModalDragger } from "@/components/shared/ModalDragger";
import { MarkDownRender } from "@/components/Pages/Details/MarkDownRender";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [lecture, setLecture] = useState<Lecture>();
  const [isLoading, setIsLoading] = useState(true); // Agrega el estado isLoading

  const [wordSelected, setWordSelected] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // Cargar la lectura desde el store
  const getLectureById = useLectureStore((state) => state.getLectureById);

  useEffect(() => {
    setIsLoading(true); // Activar indicador de carga
    const fetchedLecture = getLectureById(String(id));
    setLecture(fetchedLecture);
    setIsLoading(false); // Desactivar indicador de carga
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
        <ActivityIndicator
          size="large"
          color="#1bcd2a"
          style={styles.loadingIndicator}
        />
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
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
