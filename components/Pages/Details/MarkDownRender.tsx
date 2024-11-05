import { useCallback, useMemo } from "react";
import { Text, View, Pressable, ScrollView, StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import * as Speech from "expo-speech";

interface PropsMarkDownRender {
  lecture: any;
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
      list_item: (node: any, children: any, parent: any, styles: any) => {
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
    <ScrollView style={styles.markdownContainer}>
      <Markdown style={styles} rules={rules}>
        {lecture?.content || `# No lecture found with id ${id}`}
      </Markdown>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  text: {
    color: "#eeeeee",
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 32,
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
});
