import { ReactNode, useCallback, useMemo } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import Markdown, { ASTNode } from "react-native-markdown-display";
import * as Speech from "expo-speech";
import { Lecture } from "@/interfaces/models/Lectures";
import { FontAwesome } from "@expo/vector-icons";

interface PropsMarkDownRender {
  lecture: Lecture | undefined;
  id: string;
  setWordSelected: (word: string) => void;
}

export const MarkDownRender = ({
  lecture,
  id,
  setWordSelected,
}: PropsMarkDownRender) => {
  const speakWord = useCallback((word: string) => {
    if (word) {
      Speech.speak(word, {
        language: "en-US",
      });
    }
  }, []);

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
      strong: (
        node: ASTNode,
        children: ReactNode[],
        parentNodes: ASTNode[],
        styles: any
      ) => (
        <Text key={node.key} style={styles.strong}>
          {children}
        </Text>
      ),
      list_item: (
        node: ASTNode,
        children: ReactNode[],
        parentNodes: any[],
        styles: any
      ) => {
        const isOrdered = parentNodes[0].type === "ordered_list";
        const index = parentNodes[0].children.indexOf(node);
        const bullet = isOrdered ? `${index + 1}.` : "•";

        return (
          <View key={node.key} style={styles.listItem}>
            <Text style={styles.bullet}>{bullet}</Text>
            <View style={[styles.listItemText]}>
              {children.map((child, i) => (
                <Text key={`${node.key}_${i}`}>{child}</Text>
              ))}
            </View>
          </View>
        );
      },
    }),
    [renderWords]
  );

  return (
    <ScrollView style={styles.markdownContainer}>
      <View style={styles.infoContainer}>
        <View style={styles.badgeContainer}>
          <FontAwesome name="clock-o" size={16} color="#4CAF50" />
          <Text style={styles.badgeText}>{lecture?.time} min</Text>
        </View>
        <View style={[styles.badgeContainer, styles.levelBadge]}>
          <Text style={styles.badgeText}>
            <Text style={{ fontWeight: 900 }}>Level </Text>
            {lecture?.level}
          </Text>
        </View>
        <View style={[styles.badgeContainer, styles.languageBadge]}>
          <Text style={styles.badgeText}>🇺🇸</Text>
        </View>
      </View>

      {lecture?.img && (
        <Image
          source={{ uri: lecture.img }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Markdown style={styles} rules={rules}>
        {lecture?.content || `# No lecture found with id ${id}`}
      </Markdown>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  markdownContainer: {
    flex: 1,
    width: "100%",
  },
  espaciado: {
    marginBottom: 24,
    marginTop: 24,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  badgeText: {
    color: "#eeeeee",
    fontSize: 16,
    marginLeft: 4,
  },
  levelBadge: {
    borderColor: "#2196F3",
  },
  languageBadge: {
    borderColor: "#333",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    color: "#eeeeee",
    fontSize: 18,
    lineHeight: 32,
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
});
