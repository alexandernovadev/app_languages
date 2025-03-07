import { create } from "zustand";

import { BACKURL } from "@/api/backurl";
import { Word } from "@/interfaces/models/Word";

interface WordState {
  words: Word[];
  wordActive: Word | null;
  loading: boolean;
  error: string | null;

  fetchRecentHardOrMediumWords: () => Promise<void>;
  updateWordLevel: (wordId: string, level: string) => Promise<void>;
  setActiveWord: (word: Word) => void;
  getWord: (word: string) => Promise<void>;
  generateWord: (word: string) => Promise<void>;
}

export const useWordStore = create<WordState>((set) => ({
  words: [],
  wordActive: null,
  loading: false,
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

  updateWordLevel: async (wordId, level) => {
    set({ loading: true });
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
          loading: false,
        }));
      } else {
        set({ error: "Error updating word level", loading: false });
      }
    } catch (error) {
      set({ error: "Error updating word level", loading: false });
    }
  },

  setActiveWord: (word) => set({ wordActive: word }),

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
}));
