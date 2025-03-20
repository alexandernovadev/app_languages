import { create } from "zustand";

import { BACKURL } from "@/api/backurl";
import { Word } from "@/interfaces/models/Word";

interface WordState {
  words: Word[];
  wordActive: Word | null;
  wordsList: {
    words: Word[];
    totalPages: number;
    page: number;
    search: string;
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
  },
  loading: false,
  loadingUpdate: false,
  error: null,

  fetchRecentHardOrMediumWords: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BACKURL}/api/words/get-cards-anki`);
      const { data } = await response.json();
      set({ words: data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch recent hard or medium words",
        loading: false,
      });
    }
  },
  getWord: async (word) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${BACKURL}/api/words/word/${word.toLowerCase()}`
      );
      const { data } = await response.json();
      set({ wordActive: data, loading: false });
    } catch (error) {
      set({ error: "Error fetching word", loading: false });
    }
  },

  generateWord: async (word) => {
    if (!word.trim()) return;
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BACKURL}/api/ai/generate-wordJson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: word, language: "en" }),
      });
      const { data } = await response.json();
      set({ wordActive: data, loading: false });
    } catch (error) {
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
      const data = await response.json();
      if (data.success) {
        set({
          wordsList: {
            words: data.data,
            totalPages: data.pagination.pages,
            page,
            search,
          },
          loading: false,
        });
      }
    } catch (error) {
      set({ error: "Error fetching words", loading: false });
    }
  },
  updateincrementWordSeenCount: async (wordId) => {
    set({ loadingUpdate: true, error: null });
    try {
      const response = await fetch(
        `${BACKURL}/api/words/${wordId}/increment-seen`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
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
      } else {
        set({ error: "Error incrementing word seen count" });
      }
    } catch (error) {
      set({ error: "Error incrementing word seen count CA" });
    } finally {
      set({ loadingUpdate: false });
    }
  },
  updateWordLevel: async (wordId, level) => {
    set({ loadingUpdate: true, error: null });

    try {
      const response = await fetch(`${BACKURL}/api/words/${wordId}/level`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      });

      const data = await response.json();
      if (data.success) {
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
      const response = await fetch(
        `${BACKURL}/api/ai/generate-word-examples/${wordId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word, language, oldExamples }),
        }
      );
      const data = await response.json();

      if (data.success) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  examples: data.data.examples,
                  updatedAt: data.data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  examples: data.data.examples,
                  updatedAt: data.data.updatedAt,
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
      const response = await fetch(
        `${BACKURL}/api/ai/generate-code-switching/${wordId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word, language, oldExamples }),
        }
      );
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  codeSwitching: data.data.codeSwitching,
                  updatedAt: data.data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  codeSwitching: data.data.codeSwitching,
                  updatedAt: data.data.updatedAt,
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
      const response = await fetch(
        `${BACKURL}/api/ai/generate-code-synonyms/${wordId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word, language, oldExamples }),
        }
      );
      const data = await response.json();

      if (data.success) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  sinonyms: data.data.sinonyms,
                  updatedAt: data.data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  sinonyms: data.data.sinonyms,
                  updatedAt: data.data.updatedAt,
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
      const response = await fetch(
        `${BACKURL}/api/ai/generate-word-wordtypes/${wordId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word, language, oldExamples }),
        }
      );
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  type: data.data.type,
                  updatedAt: data.data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  type: data.data.type,
                  updatedAt: data.data.updatedAt,
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
      const response = await fetch(
        `${BACKURL}/api/ai/generate-image/${wordId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word, imgOld }),
        }
      );
      const data = await response.json();

      if (data.success) {
        set((state) => ({
          words: state.words.map((w) =>
            w._id === wordId
              ? {
                  ...w,
                  img: data.data.img,
                  updatedAt: data.data.updatedAt,
                }
              : w
          ),
          wordActive:
            state.wordActive && state.wordActive._id === wordId
              ? {
                  ...state.wordActive,
                  img: data.data.img,
                  updatedAt: data.data.updatedAt,
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
  setActiveWord: (word) => set({ wordActive: word }),
}));
