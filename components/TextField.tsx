import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function TextField({
  label,
  error,
  style,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const { colors, radius, fonts } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textDark, fontFamily: fonts.bodySemi }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderRadius: radius.button,
            backgroundColor: colors.surface,
            color: colors.textDark,
            borderColor: error ? colors.down : focused ? colors.primary : colors.border,
            fontFamily: fonts.body,
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error ? <Text style={[styles.error, { color: colors.down, fontFamily: fonts.body }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%", marginBottom: 18 },
  label: { fontSize: 15, marginBottom: 6 },
  input: {
    minHeight: 54,
    borderWidth: 2,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  error: { fontSize: 14, marginTop: 4 },
});
