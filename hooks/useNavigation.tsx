import { RootStackParamList } from "@/app/_layout";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
