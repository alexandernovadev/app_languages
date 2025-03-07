import { RootStackParamList } from "@/app/_layout";
import { useNavigation as Un } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

// Deprecated because it's not used in the app.
export const useNavigation = Un<NativeStackNavigationProp<RootStackParamList>>();
