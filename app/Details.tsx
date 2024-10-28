import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
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
  const slideAnim = useRef(new Animated.Value(height)).current;

  // PanResponder para manejar el gesto de arrastre
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Solo permitir el gesto si es un movimiento hacia abajo
        return gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        // Animar el modal según el desplazamiento
        slideAnim.setValue(height * 0.12 + gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        // Si se arrastra más de 150px hacia abajo, cierra el modal
        if (gestureState.dy > 150) {
          closeModal();
        } else {
          // Si no, vuelve a la posición inicial
          Animated.spring(slideAnim, {
            toValue: height * 0.12,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Función para abrir el modal
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.12, // Ubicación desde la parte superior
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Función para cerrar el modal
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Fuera de la pantalla
      duration: 300,
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  // Función para manejar el clic de cada palabra
  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: "en-US",
    });
  };

  // Función para renderizar palabras con interactividad
  const renderWords = (content: string, textStyles: any) => {
    const words = content.split(/\s+/);

    return (
      <Text style={textStyles}>
        {words.map((word, index) => (
          <Text
            key={`word_${index}`}
            onPress={() => {
              const wordClean = words[index].replace(/[.,-]+$/g, "");
              setWordSelected(wordClean);

              const now = Date.now();
              if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
                speakWord(word);
              }
              lastTap.current = now;
            }}
          >
            {word}{" "}
          </Text>
        ))}
      </Text>
    );
  };

  // Reglas personalizadas para renderizar Markdown
  const rules = {
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
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.markdownContainer}>
        <Markdown style={styles} rules={rules}>
          {markdownText}
        </Markdown>
      </ScrollView>
      <View style={styles.wordActionContainer}>
        <TouchableOpacity onPress={() => speakWord(wordSelected)}>
          <Ionicons name="volume-high-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.wordSelected}>{wordSelected}</Text>
        <TouchableOpacity onPress={openModal}>
          <Ionicons name="book-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal deslizante */}
      {isModalVisible && (
        <Animated.View style={[styles.modal, { top: slideAnim }]}>
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
    alignItems: "center",
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
});
