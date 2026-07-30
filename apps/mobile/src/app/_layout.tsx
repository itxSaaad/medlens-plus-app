import "@/global.css";

import { Newsreader_500Medium, Newsreader_600SemiBold } from "@expo-google-fonts/newsreader";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Static weights matching web's Newsreader / Plus Jakarta Sans / JetBrains Mono.
  // RN can't load variable fonts the way next/font does, so we subset to the
  // weights the single MedLens+ screen actually renders.
  const [fontsLoaded] = useFonts({
    Newsreader_500Medium,
    Newsreader_600SemiBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Keep the splash up until fonts are ready — no flash of system font.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Light mode only — no dark palette anywhere (see app.json userInterfaceStyle).
  return <Stack screenOptions={{ headerShown: false }} />;
}
