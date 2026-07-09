import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ConfidenceBar({
  percent,
  showLabel = false,
}: {
  percent: number;
  showLabel?: boolean;
}) {
  const { colors, radius, fonts } = useTheme();
  const clamped = Math.max(0, Math.min(100, percent));
  const color = clamped >= 70 ? colors.up : clamped >= 45 ? colors.goldText : colors.down;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.track, { borderRadius: radius.pill, backgroundColor: colors.primaryTint }]}>
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color, borderRadius: radius.pill }]} />
      </View>
      {showLabel ? (
        <Text style={[styles.label, { color: colors.textMuted, fontFamily: fonts.bodySemi }]}>
          Confidence: {clamped}%
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  track: { height: 14, overflow: "hidden" },
  fill: { height: "100%" },
  label: { marginTop: 6, fontSize: 13 },
});
