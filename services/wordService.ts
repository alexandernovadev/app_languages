import { BACKURL } from "@/api/backurl";
import { Word } from "@/interfaces/models/Word";

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "API Error");
  return data.data;
};

export const wordService = {
  fetchRecentHardOrMediumWords: async (): Promise<Word[]> => {
    const res = await fetch(`${BACKURL}/api/words/get-cards-anki`);
    return await handleResponse(res);
  },

  getWord: async (word: string): Promise<Word> => {
    const res = await fetch(`${BACKURL}/api/words/word/${word.toLowerCase()}`);
    return await handleResponse(res);
  },

  generateWord: async (word: string): Promise<Word> => {
    const res = await fetch(`${BACKURL}/api/ai/generate-wordJson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: word, language: "en" }),
    });
    return await handleResponse(res);
  },

  fetchWords: async (
    search: string,
    page: number
  ): Promise<{
    data: Word[];
    pages: number;
    total: number;
  }> => {
    const query = search ? `&wordUser=${search.toLowerCase()}` : "";
    const res = await fetch(`${BACKURL}/api/words?page=${page}${query}`);
    return await handleResponse(res);
  },

  incrementSeenCount: async (wordId: string): Promise<Word> => {
    const res = await fetch(`${BACKURL}/api/words/${wordId}/increment-seen`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse(res);
  },

  updateWordLevel: async (wordId: string, level: string): Promise<Word> => {
    const res = await fetch(`${BACKURL}/api/words/${wordId}/level`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level }),
    });
    return await handleResponse(res);
  },

  updateExamples: async (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ): Promise<Word> => {
    const res = await fetch(
      `${BACKURL}/api/ai/generate-word-examples/${wordId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, language, oldExamples }),
      }
    );
    return await handleResponse(res);
  },

  updateCodeSwitching: async (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ): Promise<Word> => {
    const res = await fetch(
      `${BACKURL}/api/ai/generate-code-switching/${wordId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, language, oldExamples }),
      }
    );
    return await handleResponse(res);
  },

  updateSynonyms: async (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ): Promise<Word> => {
    const res = await fetch(
      `${BACKURL}/api/ai/generate-code-synonyms/${wordId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, language, oldExamples }),
      }
    );
    return await handleResponse(res);
  },

  updateWordTypes: async (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ): Promise<Word> => {
    const res = await fetch(
      `${BACKURL}/api/ai/generate-word-wordtypes/${wordId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, language, oldExamples }),
      }
    );
    return await handleResponse(res);
  },

  updateImage: async (
    wordId: string,
    word: string,
    imgOld: string = ""
  ): Promise<Word> => {
    const res = await fetch(`${BACKURL}/api/ai/generate-image/${wordId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, imgOld }),
    });
    return await handleResponse(res);
  },
};
