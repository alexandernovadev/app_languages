import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useWordStore } from "@/store/useWordStore";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { Colors } from "@/constants/Colors";
import WordCardRoot from "@/components/shared/WordCardRoot/WordCardRoot";

export default function AddWordPage() {
  const [word, setWord] = useState("");
  const { wordActive, loading, getWord, generateWord, setActiveWord } =
    useWordStore();

  // Todo : FIx Temp
  useEffect(() => {
    setActiveWord(null);
  }, []);

  useEffect(() => {
    if (word.trim()) {
      const delayDebounceFn = setTimeout(() => {
        getWord(word);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [word]);

  return (
    <MainLayoutView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Look up new word"
          placeholderTextColor={Colors.gray.gray850}
          value={word}
          onChangeText={setWord}
        />
        <TouchableOpacity
          style={[
            styles.button,
            (loading || wordActive) && styles.buttonDisabled,
          ]}
          onPress={() => generateWord(word)}
          disabled={!!loading || !!wordActive}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white.white400} />
          ) : (
            <Text style={styles.buttonText}>Make</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.wordContainer}>
        {wordActive ? (
          <WordCardRoot />
        ) : (
          <Text style={styles.noWordText}>
            Add new word to see its definition
          </Text>
        )}
      </ScrollView>
    </MainLayoutView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.black.black900,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.black.black800,
    color: Colors.white.white400,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.black.black500,
    marginRight: 10,
  },
  button: {
    backgroundColor: Colors.green.green700,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray.gray900,
  },
  buttonText: {
    color: Colors.white.white200,
    fontWeight: "bold",
  },
  wordContainer: {
    paddingBottom: 60,
  },
  noWordText: {
    fontSize: 18,
    color: Colors.gray.gray600,
    textAlign: "center",
    marginTop: 20,
  },
});
