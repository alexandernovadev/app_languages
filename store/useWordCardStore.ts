import { create } from "zustand";
import { BACKURL } from "@/api/backurl";
import { Word } from "@/interfaces/models/Word";

interface WordState {
  words: Word[];
  loading: boolean;
  error: string | null;
  fetchRecentHardOrMediumWords: () => Promise<void>;
}

export const useWordCardStore = create<WordState>((set) => ({
  words: [],
  loading: false,
  error: null,

  fetchRecentHardOrMediumWords: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${BACKURL}/api/words/get-cards-anki`);
      const { data } = await response.json();

      set({
        words: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: "Failed to fetch recent hard or medium words",
        loading: false,
      });
    }
  },
}));
