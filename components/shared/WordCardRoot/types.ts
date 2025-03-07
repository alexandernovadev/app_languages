import { ReactNode } from "react";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";

// Definición de interfaces para los componentes internos
export interface SectionContainerProps {
  children: ReactNode;
  hasBox?: boolean;
  style?: ViewStyle;
}

export interface SectionHeaderProps {
  title: string;
  onRefresh?: () => void;
}

// Tipos para el estilo
export type StylesType = {
  card: ViewStyle;
  scrollContent: ViewStyle;
  rowContainer: ViewStyle;
  sectionContainer: ViewStyle;
  boxedContainer: ViewStyle;
  buttonsLevelContainer: ViewStyle;
  datesContainer: ViewStyle;
  spanishContainer: ViewStyle;
  textWord: TextStyle;
  textSeen: TextStyle;
  pronunciation: TextStyle;
  levelText: TextStyle;
  cardIndexText: TextStyle;
  speakerIcon: ViewStyle;
  speakersIcons: TextStyle;
  definition: TextStyle;
  spanishWord: TextStyle;
  spanisDefinition: TextStyle;
  titleBox: TextStyle;
  itemText: TextStyle;
  synonymList: TextStyle;
  typeText: TextStyle;
  dates: TextStyle;
  image: ImageStyle;
  levelButton: ViewStyle;
  easyButton: ViewStyle;
  mediumButton: ViewStyle;
  hardButton: ViewStyle;
  buttonLevelText: TextStyle;
  [key: string]: ViewStyle | TextStyle | ImageStyle; // Para permitir acceso dinámico a estilos de botones
};
