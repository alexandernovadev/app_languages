export interface Word {
  spanish: Spanish;
  _id?: string;
  word: string;
  language: string;
  definition: string;
  examples: string[];
  type: string[];
  IPA: string;
  seen: number;
  img?: string;
  level: string;
  codeSwitching: string[];
  sinonyms: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Spanish {
  definition: string;
  word: string;
}
