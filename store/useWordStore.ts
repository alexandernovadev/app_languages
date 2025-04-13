import { create } from "zustand";
import { Word } from "@/interfaces/models/Word";
import { wordService } from "@/services/wordService";

interface State {
  words: Word[];
  pages: number;
  total: number;
  selectedWord: Word | null;
  loading: boolean;
  error: string | null;

  fetchWords: (search: string, page: number) => Promise<void>;
  fetchRecentHardOrMediumWords: () => Promise<void>;
  getWord: (word: string) => Promise<void>;
  generateWord: (word: string) => Promise<void>;
  updateLevel: (wordId: string, level: string) => Promise<void>;
  updateExamples: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<void>;
  updateCodeSwitching: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<void>;
  updateSynonyms: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<void>;
  updateWordTypes: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<void>;
  updateImage: (wordId: string, word: string, imgOld?: string) => Promise<void>;
}

export const useWordStore = create<State>((set) => ({
  words: [],
  pages: 0,
  total: 0,
  selectedWord: null,
  loading: false,
  error: null,

  fetchWords: async (search, page) => {
    try {
      set({ loading: true, error: null });
      const res = await wordService.fetchWords(search, page);
      set({ words: res.data, pages: res.pages, total: res.total });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchRecentHardOrMediumWords: async () => {
    try {
      set({ loading: true, error: null });
      const words = await wordService.fetchRecentHardOrMediumWords();
      set({ words });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  getWord: async (word) => {
    try {
      set({ loading: true, error: null });
      const res = await wordService.getWord(word);
      set({ selectedWord: res });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  generateWord: async (word) => {
    try {
      set({ loading: true, error: null });
      const newWord = await wordService.generateWord(word);
      set({ selectedWord: newWord });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateLevel: async (wordId, level) => {
    try {
      const updated = await wordService.updateWordLevel(wordId, level);
      set((state) => ({
        selectedWord:
          state.selectedWord?._id === updated._id
            ? updated
            : state.selectedWord,
        words: state.words.map((w) => (w._id === updated._id ? updated : w)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateExamples: async (wordId, word, language, oldExamples) => {
    try {
      const updated = await wordService.updateExamples(
        wordId,
        word,
        language,
        oldExamples
      );
      set({ selectedWord: updated });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateCodeSwitching: async (wordId, word, language, oldExamples) => {
    try {
      const updated = await wordService.updateCodeSwitching(
        wordId,
        word,
        language,
        oldExamples
      );
      set({ selectedWord: updated });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateSynonyms: async (wordId, word, language, oldExamples) => {
    try {
      const updated = await wordService.updateSynonyms(
        wordId,
        word,
        language,
        oldExamples
      );
      set({ selectedWord: updated });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateWordTypes: async (wordId, word, language, oldExamples) => {
    try {
      const updated = await wordService.updateWordTypes(
        wordId,
        word,
        language,
        oldExamples
      );
      set({ selectedWord: updated });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateImage: async (wordId, word, imgOld = "") => {
    try {
      const updated = await wordService.updateImage(wordId, word, imgOld);
      set({ selectedWord: updated });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
