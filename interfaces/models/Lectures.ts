export interface Lecture {
  _id: string;
  time: number;
  level: string;
  typeWrite: string;
  language: string;
  img: string;
  content: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// type level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
// type language = "es" | "en" | "pt";
