import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
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
  TouchableWithoutFeedback,
  StyleProp,
  TextStyle,
} from "react-native";
import * as Speech from "expo-speech";
import Markdown from "react-native-markdown-display";
import { useLocalSearchParams } from "expo-router";
import { markdownText } from "@/data/markdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Lecture } from "@/interfaces/models/Lectures";
import { BACKURL } from "@/api/backurl";
import { SidePanelModalWord } from "@/components/Pages/Details/SidePanelModalWord";

const { height } = Dimensions.get("window");

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [lecture, setLecture] = useState<Lecture>();

  const [wordSelected, setWordSelected] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // Animación para el modal
  const slideAnim = useRef(new Animated.Value(0)).current;

  const getLecture = async () => {
    try {
      const response = await fetch(`${BACKURL}/api/lectures/${id}`);
      const data: Lecture = await response.json();
      setLecture(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLecture();
  }, []);

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
        <Text key={content} style={styles.espaciado}>
          {content.split(/\s+/).map((word, index) => {
            const wordClean = word.replace(
              /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,
              ""
            );

            return (
              <Pressable
                key={`word_${index}`}
                onPress={() => {
                  setWordSelected(wordClean);
                  speakWord(wordClean);
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
      heading3: (node: any, children: any, parent: any, styles: any) => {
        const content = node.children[0].children[0].content || "";
        return renderWords(content, styles.heading2);
      },
      list_item: (node: any, children: any, parent: any, styles:any) => {
        const isOrdered = parent.type === "ordered_list";
        const index = parent.indexOf(node);
        const bullet = isOrdered ? `${index + 1}.` : "•";

        return (
          <View key={node.key} style={styles.listItem}>
          <Text style={styles.bullet}>{bullet}</Text>
          <Text style={styles.listItemText}>{children}</Text>
        </View>
        );
      },
    }),
    [renderWords]
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.markdownContainer}>
        <Markdown style={styles} rules={rules}>
          {lecture?.content || `# No lecture found with id ${id}`}
        </Markdown>
      </ScrollView>

      {wordSelected.length > 0 && (
        <View style={styles.wordActionContainer}>
          <TouchableOpacity
            style={{ padding: 24 }}
            onPress={() => speakWord(wordSelected)}
          >
            <Ionicons name="volume-high-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.wordSelected}>{wordSelected}</Text>
          <TouchableOpacity style={{ padding: 24 }} onPress={openModal}>
            <Ionicons name="book-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal deslizante */}
      {isModalVisible && (
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.overlayBackground} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.modal,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View
              {...panResponder.panHandlers}
              style={{ width: "100%", paddingVertical: 4 }}
            >
              <View style={styles.modalHandle} />
            </View>
            <SidePanelModalWord
              isVisible={isModalVisible}
              wordSelected={wordSelected}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  text: {
    color: "#eeeeee",
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 32,
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
  markdownContainer: {
    flex: 1,
    width: "100%",
  },
  espaciado: {
    marginBottom: 24,
  },
  heading1: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  heading2: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  heading3: {
    fontSize: 22,
    color: "#b6b6b6ff",
    fontWeight: "semibold",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 8,
    marginVertical: 6,
  },
  bullet: {
    color: "white",
    fontSize: 42,
    paddingRight: 8,
    position: "relative",
    bottom: 12,
  },
  listItemText: {
    flex: 1,
    color: "white",
    fontSize: 18,
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "88%",
    backgroundColor: "#333",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
    color: "#eeeee",
  },
});
