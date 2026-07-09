import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const { colors, fonts } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 13, fontFamily: fonts.bodySemi },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Forecast", tabBarIcon: () => <TabIcon emoji="🌾" /> }} />
      <Tabs.Screen name="markets" options={{ title: "Markets", tabBarIcon: () => <TabIcon emoji="📍" /> }} />
      <Tabs.Screen name="alerts" options={{ title: "Alerts", tabBarIcon: () => <TabIcon emoji="🔔" /> }} />
    </Tabs>
  );
}
