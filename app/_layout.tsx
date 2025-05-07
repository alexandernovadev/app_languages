import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import "react-native-reanimated";
import * as NavigationBar from "expo-navigation-bar";
import { Storage } from "expo-storage";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { DARKMODE } from "@/constants/themeMain";

// Evita que se oculte el splash automáticamente
SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Details: { id: string };
  NoTabsScreen: undefined;
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appReady, setAppReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const prepare = async () => {
      if (loaded) {
        try {
          const token = await Storage.getItem({ key: "token" });

          // Todo If token is invalid, remove it,

          if (token) {
            router.replace("/(tabs)");
          } else {
            router.replace("/Login");
          }
        } catch (e) {
          // console.error("Error leyendo token", e);
          router.replace("/Login");
        } finally {
          setAppReady(true);
          SplashScreen.hideAsync();
        }
      }
    };

    prepare();

    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, [loaded]);

  if (!appReady) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar hidden style={DARKMODE} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" />
        <Stack.Screen name="NoTabsScreen" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="Details" />
      </Stack>
    </ThemeProvider>
  );
}
