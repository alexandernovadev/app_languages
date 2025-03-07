import { Colors } from "@/constants/Colors";

export const getLevelColor = (level: string) => {
  switch (level) {
    case "easy":
      return Colors.green.green800;
    case "medium":
      return Colors.blue.blue600;
    case "hard":
      return Colors.red.red500;
    default:
      return Colors.orange.orange400;
  }
};
