import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import Markdown from "react-native-markdown-display";
import { useLocalSearchParams } from "expo-router";
import { markdownText } from "@/data/markdown";
import Ionicons from "@expo/vector-icons/Ionicons";// Importamos el icono de Ionicons


const DOUBLE_PRESS_DELAY = 300;

export default function DetailsScreen() {
  // Access the ID parameter from the route
  const { id } = useLocalSearchParams();
  const lastTap = useRef<number>(0);

  const [wordSelected, setWordSelected] = useState("");

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
            key={`word_${index}`} // Clave única
            onPress={() => {
              // remove dots and commas from the word
              const wordClean = words[index].replace(/[.,-]+$/g, "");
              setWordSelected(wordClean);
              
              const now = Date.now();
              if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
                speakWord(word);
              }
              lastTap.current = now;
            }}
          >
            {word}
            {"  "}
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
        <TouchableOpacity onPress={() => console.log("Buscar definición")}>
          <Ionicons name="book-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
});
