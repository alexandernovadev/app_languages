import { create } from "zustand";
import { BACKURL } from "@/api/backurl";
import { Lecture } from "@/interfaces/models/Lectures";

export interface LectureResponse {
  data: Lecture[];
  total: number;
  page: number;
  pages: number;
}

interface LectureState {
  lectures: Lecture[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  fetchLectures: (page?: number, limit?: number) => Promise<void>;
  getLectureById: (id: string) => Lecture | undefined;
}

export const useLectureStore = create<LectureState>((set, get) => ({
  lectures: [],
  loading: false,
  error: null,
  page: 1,
  total: 0,

  fetchLectures: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(
        `${BACKURL}/api/lectures?page=${page}&limit=${limit}`
      );
      const { data } = await response.json();

      const currentLectures = get().lectures;

      set({
        lectures: page === 1 ? data.data : [...currentLectures, ...data.data],
        page: data.page,
        total: data.total,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch lectures", loading: false });
    }
  },
  getLectureById: (id: string) => {
    return get().lectures.find((lecture) => lecture._id === id);
  },
}));
