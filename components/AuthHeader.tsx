import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { colors, fonts } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <Text style={styles.badgeEmoji}>🌾</Text>
      </View>
      <Text style={[styles.wordmark, { color: colors.primary, fontFamily: fonts.display }]}>GAPIP</Text>
      <Text style={[styles.tagline, { color: colors.textMuted, fontFamily: fonts.body }]}>
        Ghana Agricultural Price Intelligence
      </Text>

      <Text style={[styles.title, { color: colors.textDark, fontFamily: fonts.display }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: fonts.body }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", marginBottom: 28 },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  badgeEmoji: { fontSize: 32 },
  wordmark: { fontSize: 22, letterSpacing: 2 },
  tagline: { fontSize: 12, marginTop: 2, marginBottom: 20 },
  title: { fontSize: 24, marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 15, textAlign: "center" },
});
