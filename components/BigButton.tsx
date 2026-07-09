import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Variant = "primary" | "secondary" | "danger" | "outline";

export default function BigButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, radius, fonts } = useTheme();

  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
      ? colors.gold
      : variant === "danger"
      ? colors.down
      : "transparent";

  const textColor =
    variant === "secondary" ? colors.textDark : variant === "outline" ? colors.primary : colors.textOnPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, borderRadius: radius.button, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === "outline" && { borderWidth: 2, borderColor: colors.primary },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor, fontFamily: fonts.bodyBold }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  text: {
    fontSize: 17,
    letterSpacing: 0.2,
  },
});
