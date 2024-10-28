import React, { useRef } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import * as Speech from "expo-speech";
import Markdown from "react-native-markdown-display";
import { useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams
import { markdownText } from "@/data/markdown";

const DOUBLE_PRESS_DELAY = 300;

export default function DetailsScreen() {
  // Access the ID parameter from the route
  const { id } = useLocalSearchParams();
  const lastTap = useRef<number>(0);

  // Función para manejar el clic de cada palabra
  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: "en-US", // Especifica el idioma inglés (Estados Unidos)
    });
  };

  // Función para renderizar palabras con interactividad
  const renderWords = (content: string, textStyles: any) => {
    const words = content.split(/\s+/);

    return (
      <Text style={textStyles}>
        {words.map((word, index) => (
          <Text
            key={index + word}
            onPress={() => {
              const now = Date.now();
              if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
                // Doble toque detectado
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
    // Puedes agregar más reglas para heading3, heading4, etc., si lo necesitas
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ID de la tarjeta: {id}</Text>
      <ScrollView style={styles.markdownContainer}>
        <Markdown style={styles} rules={rules}>
          {markdownText}
        </Markdown>
      </ScrollView>
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
  markdownContainer: {
    flex: 1,
    width: "100%",
  },
  // Markdown text styles
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
