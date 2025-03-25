import React, { useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import Markdown from "react-native-markdown-display";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { triggerVibration } from "@/utils/vibrationHaptic";
import { Lecture } from "@/interfaces/models/Lectures";

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
  const [wordSelectedU, setWordSelectedU] = useState("");

  const speakWord = useCallback((word: string) => {
    if (word) {
      Speech.speak(word, { language: "en-US", rate: 0.9 });
    }
  }, []);

  const handleWordPress = useCallback(
    (word: string, idWord: string) => {
      const wordClean = word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
      setWordSelected(wordClean);
      speakWord(wordClean);
      triggerVibration();
    },
    [setWordSelected, speakWord]
  );

  const getTextFromNode = useCallback((node: any): string => {
    if (node.content) return node.content;
    if (node.children && node.children.length) {
      return node.children.map((child: any) => getTextFromNode(child)).join("");
    }
    return "";
  }, []);

  const renderWords = useCallback(
    (node: any, customStyle: any) => {
      const content = getTextFromNode(node);
      const wordsArray = content.split(/\s+/).filter((w) => w.length > 0);
      return (
        <View key={node.key} style={styles.wordsContainer}>
          {wordsArray.map((word: string, index: number) => {
            const idWord = `${word}-${index}`;

            return (
              <Pressable
                key={idWord}
                onPress={() => {
                  handleWordPress(word, idWord);
                }}
              >
                <Text style={[customStyle]}>{word} </Text>
              </Pressable>
            );
          })}
        </View>
      );
    },
    [getTextFromNode, handleWordPress]
  );

  const renderNestedList = useCallback(
    (node: any, customStyle: any) => {
      let isOrdered = node.type === "ordered_list";
      return (
        <View key={node.key} style={stylesMD.listContainer}>
          {node.children.map((child: any, index: number) => (
            <View
              key={`${child.key}-${index}`}
              style={stylesMD.listItemContainer}
            >
              <Text style={stylesMD.bullet}>
                {isOrdered ? `${index + 1}.` : "•"}
              </Text>
              <View style={styles.wordsContainer}>
                {child.children.map((grandChild: any, grandIndex: number) => {
                  const content = getTextFromNode(grandChild);
                  const wordsArray = content
                    .split(/\s+/)
                    .filter((w) => w.length > 0);

                  return wordsArray.map((word: string, wordIndex: number) => {
                    const idWord = `${word}-${grandIndex}-${wordIndex}`;
                    return (
                      <Pressable
                        key={idWord}
                        onPress={() => {
                          handleWordPress(word, idWord);
                        }}
                      >
                        {grandChild.type === "strong" ? (
                          <Text
                            style={[stylesMD.strongText, { marginRight: 4 }]}
                          >
                            {word}{" "}
                          </Text>
                        ) : (
                          <Text style={[stylesMD.listText, { marginRight: 4 }]}>
                            {word}{" "}
                          </Text>
                        )}
                      </Pressable>
                    );
                  });
                })}
              </View>
            </View>
          ))}
        </View>
      );
    },
    [getTextFromNode, handleWordPress]
  );

  const textStyles = useMemo(
    () => ({
      heading1: stylesMD.heading1,
      heading2: stylesMD.heading2,
      heading3: stylesMD.heading3,
      heading4: stylesMD.heading4,
      heading5: stylesMD.heading5,
      heading6: stylesMD.heading6,
      paragraph: stylesMD.paragraph,
      list: stylesMD.listItem,
    }),
    []
  );

  const rules = useMemo(
    () => ({
      heading1: (node: any) => renderWords(node, textStyles.heading1),
      heading2: (node: any) => renderWords(node, textStyles.heading2),
      heading3: (node: any) => renderWords(node, textStyles.heading3),
      heading4: (node: any) => renderWords(node, textStyles.heading4),
      heading5: (node: any) => renderWords(node, textStyles.heading5),
      heading6: (node: any) => renderWords(node, textStyles.heading6),
      paragraph: (node: any) => renderWords(node, textStyles.paragraph),
      list_item: (node: any) => renderNestedList(node, textStyles.list),
    }),
    [renderWords, renderNestedList, textStyles]
  );

  return (
    <ScrollView style={styles.markdownContainer}>
      <View style={styles.infoContainer}>
        <View style={styles.badgeContainer}>
          <FontAwesome name="clock-o" size={16} color={Colors.green.green900} />
          <Text style={styles.badgeText}>{lecture?.time} min</Text>
        </View>
        <View style={[styles.badgeContainer, styles.levelBadge]}>
          <Text style={styles.badgeText}>
            <Text style={{ fontWeight: "900" }}>Level </Text>
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
          resizeMode="stretch"
        />
      )}
      <Markdown style={stylesMD} rules={rules}>
        {lecture?.content || `# No lecture found with id ${id}`}
      </Markdown>
    </ScrollView>
  );
};

const stylesMD = StyleSheet.create({
  heading1: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.green.green400,
  },
  heading2: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.blue.blue800,
  },
  heading3: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.blue.blue700,
  },
  heading4: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.blue.blue600,
  },
  heading5: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.blue.blue500,
  },
  heading6: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.blue.blue400,
  },
  paragraph: {
    fontSize: 17,
    color: Colors.gray.gray200,
    lineHeight: 32,
  },
  listItem: {
    fontSize: 16,
    color: Colors.gray.gray200,
    lineHeight: 32,
  },
  listContainer: {
    paddingLeft: 16,
  },
  nestedListContainer: {
    paddingLeft: 24,
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 2,
    flexWrap: "wrap",
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
    color: Colors.gray.gray200,
    lineHeight: 32,
  },
  listText: {
    fontSize: 16,
    color: Colors.gray.gray200,
    lineHeight: 32,
  },
  strongText: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.blue.blue200,
    lineHeight: 32,
  },
});

const styles = StyleSheet.create({
  markdownContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 24,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    marginBottom: 24,
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
    backgroundColor: Colors.gray.gray850,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    borderColor: Colors.green.green500,
    borderWidth: 1,
  },
  badgeText: {
    color: Colors.white.white300,
    fontSize: 16,
    marginLeft: 4,
  },
  levelBadge: {
    borderColor: Colors.blue.blue800,
  },
  languageBadge: {
    borderColor: Colors.gray.gray300,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 420,
    borderRadius: 8,
    marginBottom: 16,
  },
});
