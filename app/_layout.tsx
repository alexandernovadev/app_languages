import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import "react-native-reanimated";
import * as NavigationBar from "expo-navigation-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DARKMODE } from "@/constants/themeMain";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
  NoTabsScreen: undefined;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar hidden style={DARKMODE} />

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Details" options={{ headerShown: false }} />
        <Stack.Screen name="NoTabsScreen" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
