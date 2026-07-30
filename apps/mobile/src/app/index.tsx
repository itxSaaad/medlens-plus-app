import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { HeroBackground } from "@/components/hero-background";
import logo from "@/assets/images/logo-512.png";

// The mobile app has no native waitlist form yet, so the CTA deep-links to
// web's hero waitlist form (apps/web marketing home, #hero-waitlist anchor).
const WAITLIST_URL = "https://medlens.plus/#hero-waitlist";

// Staggered entrance: logo first, then each line of the value prop, then the
// anchored CTA. Mirrors web's hero FadeUp cascade (~80ms steps). Reanimated
// entering builders default to ReduceMotion.System, so the whole sequence is
// automatically skipped when the OS "reduce motion" setting is on.
const ENTER_DURATION = 500;
const enter = (delay: number) => FadeInDown.duration(ENTER_DURATION).delay(delay);

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <HeroBackground />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center gap-10 px-6 py-12">
            <Animated.View entering={enter(0)}>
              {/* Logo mark over a layered lens glow — a deliberate hero visual
                  rather than a flat 56px icon. Circles are decorative. */}
              <View className="h-24 w-24 items-center justify-center">
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  className="absolute h-24 w-24 rounded-full bg-lens opacity-10"
                />
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  className="absolute h-16 w-16 rounded-full bg-lens opacity-20"
                />
                <Image
                  source={logo}
                  style={{ width: 64, height: 64 }}
                  contentFit="contain"
                  accessibilityLabel="MedLens+ logo"
                />
              </View>
            </Animated.View>

            <View className="gap-4">
              <Animated.Text
                entering={enter(80)}
                className="font-body-semibold text-sm uppercase tracking-widest text-lens"
              >
                Public beta — join early access
              </Animated.Text>

              <Animated.Text
                entering={enter(160)}
                className="font-display text-4xl leading-tight text-ink"
              >
                Your lab history, finally in one timeline.
              </Animated.Text>

              <Animated.Text
                entering={enter(240)}
                className="font-body text-lg leading-relaxed text-muted"
              >
                Upload PDFs from any lab. MedLens+ pulls out the numbers, tracks what moved since
                your last visit, and helps you walk in with better questions.
              </Animated.Text>
            </View>
          </View>
        </ScrollView>

        {/* Anchored bottom CTA — the recognizable native onboarding/landing
            pattern: the primary action sits above the safe area, always
            reachable without scrolling. */}
        <Animated.View entering={enter(320)} className="gap-3 px-6 pb-2 pt-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Join the waitlist"
            onPress={() => Linking.openURL(WAITLIST_URL)}
            className="items-center rounded-lg bg-lens px-6 py-4 active:bg-lensHover"
          >
            <Text className="font-body-semibold text-base text-primaryForeground">
              Join the waitlist
            </Text>
          </Pressable>

          <Text className="text-center font-body text-sm text-muted">
            Opens the waitlist form on the web — no native sign-up yet.
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
