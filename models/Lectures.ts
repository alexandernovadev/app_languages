export interface Lecture {
  id?: number;
  title?: string;
  content?: string;
  duration?: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  level?: level;
  language?: language;
}

type level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type language = "es" | "en" | "pt";
