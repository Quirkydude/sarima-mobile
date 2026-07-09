import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function TrendArrow({
  direction,
  size = 64,
}: {
  direction: "UP" | "DOWN" | "STABLE";
  size?: number;
}) {
  const { colors, fonts } = useTheme();
  const color = direction === "UP" ? colors.up : direction === "DOWN" ? colors.down : colors.gold;
  const glyphColor = direction === "STABLE" ? colors.textDark : colors.white;
  const symbol = direction === "UP" ? "\u2191" : direction === "DOWN" ? "\u2193" : "\u2192";
  const outerSize = size * 1.55;

  return (
    <View
      style={[
        styles.circle,
        { width: outerSize, height: outerSize, borderRadius: outerSize / 2, backgroundColor: color },
      ]}
    >
      <Text style={[styles.symbol, { fontSize: size * 0.85, color: glyphColor, fontFamily: fonts.display }]}>
        {symbol}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: "center", justifyContent: "center" },
  symbol: { fontWeight: "900" },
});
