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
  loading: boolean; // Para operaciones generales
  loadingUpdate: boolean; // Para actualizar palabras
  error: string | null;

  fetchRecentHardOrMediumWords: () => Promise<void>;
  updateWordLevel: (wordId: string, level: string) => Promise<void>;
  setActiveWord: (word: Word) => void;
  getWord: (word: string) => Promise<void>;
  generateWord: (word: string) => Promise<void>;
  fetchWords: (search?: string, page?: number) => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
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
  loadingUpdate: false, // Inicialmente no está en carga
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

  setSearch: (search) =>
    set((state) => ({ wordsList: { ...state.wordsList, search, page: 1 } })),
  setPage: (page) =>
    set((state) => ({ wordsList: { ...state.wordsList, page } })),
}));
