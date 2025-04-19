import { create } from "zustand";

import { BACKURL } from "@/api/backurl";
import { Word } from "@/interfaces/models/Word";
import { wordService } from "@/services/wordService";

interface WordState {
  words: Word[];
  wordActive: Word | null;
  wordsList: {
    words: Word[];
    totalPages: number;
    page: number;
    search: string;
    total: number;
  };
  loading: boolean;
  loadingUpdate: boolean;
  error: string | null;

  setSearch: (search: string) => void;
  setActiveWord: (word: Word | null) => void;
  setPage: (page: number) => void;

  getWord: (word: string) => Promise<void>;
  generateWord: (word: string) => Promise<void>;
  fetchRecentHardOrMediumWords: () => Promise<void>;
  fetchWords: (search?: string, page?: number) => Promise<void>;
  updateWordLevel: (wordId: string, level: string) => Promise<void>;

  // Methods AI
  updateWordExamples: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<void>;
  updateWordCodeSwitching: (
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
  updateWordSynonyms: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<void>;
  updateWordImage: (
    wordId: string,
    word: string,
    imgOld: string
  ) => Promise<void>;
  updateincrementWordSeenCount: (wordId: string) => Promise<void>;
}

export const useWordStore = create<WordState>((set, get) => ({
  words: [],
  wordActive: null,
  wordsList: {
    words: [],
    totalPages: 1,
    page: 1,
    search: "",
    total: 0,
  },
  loading: false,
  loadingUpdate: false,
  error: null,

  fetchRecentHardOrMediumWords: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BACKURL}/api/words/get-cards-anki`);
      const data = await response.json();
      if (data.success) {
        set({ words: data.data, loading: false });
      } else {
        set({ error: "Failed to fetch words", loading: false });
      }
    } catch {
      set({ error: "Failed to fetch words", loading: false });
    }
  },
  getWord: async (word) => {
    set({ loading: true, error: null });
    try {
      const data = await wordService.getWord(word);
      get().setActiveWord(data);
      set({ loading: false });
    } catch {
      set({ error: "Error fetching word", loading: false });
    }
  },
  generateWord: async (word) => {
    if (!word.trim()) return;
    set({ loading: true, error: null });
    try {
      const data = await wordService.generateWord(word);
      set({ wordActive: data, loading: false });
    } catch {
      set({ error: "Error generating word", loading: false });
    }
  },

  fetchWords: async (
    search = get().wordsList.search,
    page = get().wordsList.page
  ) => {
    set({ loading: true, error: null });
    try {
      const query = search ? `&wordUser=${search.toLowerCase()}` : "";
      const response = await fetch(`${BACKURL}/api/words?page=${page}${query}`);
      const data = await wordService.fetchWords(search, page);

      set({
        wordsList: {
          words: data.data,
          totalPages: data.pages,
          page,
          search,
          total: data.total,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: "Error fetching words", loading: false });
    }
  },
  updateincrementWordSeenCount: async (wordId) => {
    set({ loadingUpdate: true, error: null });
    try {
      await wordService.incrementSeenCount(wordId);
      // Update words list and active word with incremented seen count
      set((state) => ({
        words: state.words.map((word) =>
          word._id === wordId ? { ...word, seen: word.seen + 1 } : word
        ),
        wordActive:
          state.wordActive && state.wordActive._id === wordId
            ? {
                ...state.wordActive,
                seen: state.wordActive.seen + 1,
              }
            : state.wordActive,
      }));
    } catch (error) {
      set({ error: "Error incrementing word seen count CA" });
    } finally {
      set({ loadingUpdate: false });
    }
  },
  updateWordLevel: async (wordId, level) => {
    set({ loadingUpdate: true, error: null });

    try {
      const data = await wordService.updateWordLevel(wordId, level);
      if (data) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId ? { ...w, level } : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? { ...state.wordActive, level }
              : state.wordActive,
        }));
      } else {
        set({ error: "Error updating word level" });
      }
    } catch (error) {
      set({ error: "Error updating word level" });
    } finally {
      set({ loadingUpdate: false });
    }
  },
  // Metodos AI
  updateWordExamples: async (wordId, word, language, oldExamples) => {
    set({ loadingUpdate: true, error: null });

    try {
      const data = await wordService.updateExamples(
        wordId,
        word,
        language,
        oldExamples
      );

      if (data) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  examples: data.examples,
                  updatedAt: data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  examples: data.examples,
                  updatedAt: data.updatedAt,
                }
              : state.wordActive,
        }));
      } else {
        set({ error: "Error updating word examples" });
      }
    } catch (error) {
      set({ error: "Error updating word examples TC" + error });
    } finally {
      set({ loadingUpdate: false });
    }
  },

  updateWordCodeSwitching: async (wordId, word, language, oldExamples) => {
    set({ loadingUpdate: true, error: null });
    try {
      const data = await wordService.updateCodeSwitching(
        wordId,
        word,
        language,
        oldExamples
      );
      if (data) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  codeSwitching: data.codeSwitching,
                  updatedAt: data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  codeSwitching: data.codeSwitching,
                  updatedAt: data.updatedAt,
                }
              : state.wordActive,
        }));
      } else {
        set({ error: "Error updating word code-switching examples" });
      }
    } catch (error) {
      set({ error: "Error updating word code-switching examples" + error });
    } finally {
      set({ loadingUpdate: false });
    }
  },
  updateWordSynonyms: async (wordId, word, language, oldExamples) => {
    set({ loadingUpdate: true, error: null });

    try {
      const data = await wordService.updateSynonyms(
        wordId,
        word,
        language,
        oldExamples
      );

      if (data) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  sinonyms: data.sinonyms,
                  updatedAt: data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  sinonyms: data.sinonyms,
                  updatedAt: data.updatedAt,
                }
              : state.wordActive,
        }));
      } else {
        set({ error: "Error updating word synonyms" });
      }
    } catch (error) {
      set({ error: "Error updating word synonyms" + error });
    } finally {
      set({ loadingUpdate: false });
    }
  },

  updateWordTypes: async (wordId, word, language, oldExamples) => {
    set({ loadingUpdate: true, error: null });
    try {
      const data = await wordService.updateWordTypes(
        wordId,
        word,
        language,
        oldExamples
      );

      if (data) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  type: data.type,
                  updatedAt: data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  type: data.type,
                  updatedAt: data.updatedAt,
                }
              : state.wordActive,
        }));
      } else {
        set({ error: "Error updating word types" });
      }
    } catch (error) {
      set({ error: "Error updating word types" + error });
    } finally {
      set({ loadingUpdate: false });
    }
  },

  updateWordImage: async (wordId, word, imgOld = "") => {
    set({ loadingUpdate: true, error: null });
    try {
      const data = await wordService.updateImage(wordId, word, imgOld);

      if (data) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  img: data.img,
                  updatedAt: data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  img: data.img,
                  updatedAt: data.updatedAt,
                }
              : state.wordActive,
        }));
      } else {
        set({ error: "Error updating word image" });
      }
    } catch (error) {
      set({ error: "Error updating word image" + error });
    } finally {
      set({ loadingUpdate: false });
    }
  },

  setSearch: (search) =>
    set((state) => ({ wordsList: { ...state.wordsList, search, page: 1 } })),
  setPage: (page) =>
    set((state) => ({ wordsList: { ...state.wordsList, page } })),
  setActiveWord: (word) => {
    const { wordActive, updateincrementWordSeenCount } = get();

    if (wordActive?._id !== word?._id) {
      set({ wordActive: word });
      if (word !== null && word._id) {
        updateincrementWordSeenCount(word._id);
      }
    }
  },
}));
