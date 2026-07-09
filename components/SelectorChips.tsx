import React from "react";
import { ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export type ChipOption = { id: string; label: string };

export default function SelectorChips({
  options,
  selectedId,
  onSelect,
}: {
  options: ChipOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { colors, radius, fonts } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((opt) => {
        const selected = opt.id === selectedId;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={[
              styles.chip,
              {
                borderRadius: radius.pill,
                backgroundColor: selected ? colors.primary : colors.surface,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: selected ? colors.textOnPrimary : colors.textDark, fontFamily: fonts.bodySemi },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 10, paddingVertical: 4 },
  chip: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { fontSize: 15 },
});
