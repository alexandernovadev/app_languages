import React, { useRef, useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
} from "react-native";
import * as Speech from "expo-speech";
import Markdown from "react-native-markdown-display";
import { useLocalSearchParams } from "expo-router";
import { markdownText } from "@/data/markdown";
import Ionicons from "@expo/vector-icons/Ionicons";

const DOUBLE_PRESS_DELAY = 300;
const { height } = Dimensions.get("window");

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const lastTap = useRef<number>(0);
  const [wordSelected, setWordSelected] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // Animación para el modal
  const slideAnim = useRef(new Animated.Value(0)).current;

  // PanResponder para manejar el gesto de arrastre
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Limitar el valor máximo y mínimo de desplazamiento
        const newValue = Math.max(0, gestureState.dy);
        slideAnim.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          closeModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Función para abrir el modal
  const openModal = useCallback(() => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // Función para cerrar el modal
  const closeModal = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  }, [slideAnim]);

  // Función para manejar el clic de cada palabra
  const speakWord = useCallback((word: string) => {
    if (word) {
      Speech.speak(word, {
        language: "en-US",
      });
    }
  }, []);

  // Función para renderizar palabras con interactividad
  const renderWords = useCallback(
    (content: string, textStyles: any) => {
      return (
        <Text>
          {content.split(/\s+/).map((word, index) => {
            const wordClean = word.replace(/[.,-]+$/g, "");
            return (
              <Pressable
                key={`word_${index}`}
                onPress={() => {
                  setWordSelected(wordClean);
                }}
                onLongPress={() => speakWord(wordClean)}
              >
                <Text style={textStyles}>{word} </Text>
              </Pressable>
            );
          })}
        </Text>
      );
    },
    [speakWord]
  );

  // Reglas personalizadas para renderizar Markdown
  const rules = useMemo(
    () => ({
      text: (node: any, children: any, parent: any, styles: any) => {
        const content = node.content || "";
        return renderWords(content, styles.text);
      },
      heading1: (node: any, children: any, parent: any, styles: any) => {
        const content = node.children[0].children[0].content || "";
        return renderWords(content, styles.heading1);
      },
      heading2: (node: any, children: any, parent: any, styles: any) => {
        const content = node.children[0].children[0].content || "";
        return renderWords(content, styles.heading2);
      },
    }),
    [renderWords]
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.markdownContainer}>
        <Markdown style={styles} rules={rules}>
          {markdownText}
        </Markdown>
      </ScrollView>

      {wordSelected.length > 0 && (
        <View style={styles.wordActionContainer}>
          <TouchableOpacity onPress={() => speakWord(wordSelected)}>
            <Ionicons name="volume-high-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.wordSelected}>{wordSelected}</Text>
          <TouchableOpacity onPress={openModal}>
            <Ionicons name="book-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal deslizante */}
      {isModalVisible && (
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={{ width: "100%" }}>
            <View style={styles.modalHandle} />
          </View>
          <Text style={styles.modalTitle}>Definición de "{wordSelected}"</Text>
          <Text style={styles.modalText}>
            Aquí puedes mostrar la definición o información adicional sobre la
            palabra seleccionada.
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    paddingHorizontal: 8,
    paddingTop: 20,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 42,
  },
  wordActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    padding: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    marginVertical: 20,
    alignSelf: "center",
  },
  wordSelected: {
    textTransform: "capitalize",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 24,
  },
  markdownContainer: {
    flex: 1,
    width: "100%",
  },
  heading1: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  heading2: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "88%",
    backgroundColor: "#333",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    bottom: 0,
  },
  modalHandle: {
    width: 60,
    height: 5,
    backgroundColor: "gray",
    alignSelf: "center",
    borderRadius: 3,
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 18,
    color: "white",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#555",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  word: {
    color: "#fff",
  },
});
