import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

/**
 * TicketCard — the app's one signature visual element.
 *
 * Two stacked surfaces (a "stub" on top, the body below) meet at a seam
 * that reads as a torn perforation: a row of small punched dots plus two
 * bite notches on the outer edges, all colored to match the page
 * background so they look cut through, not painted on.
 *
 * Used ONLY for the hero forecast on the Home screen — restraint is the
 * point. Everywhere else uses the plain Card component.
 */
export default function TicketCard({
  stub,
  body,
  style,
}: {
  stub: React.ReactNode;
  body: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, radius } = useTheme();
  const [stubHeight, setStubHeight] = useState(0);

  function onStubLayout(e: LayoutChangeEvent) {
    setStubHeight(e.nativeEvent.layout.height);
  }

  const holeCount = 16;
  const holes = Array.from({ length: holeCount });

  return (
    <View style={[styles.wrapper, style]}>
      <View
        onLayout={onStubLayout}
        style={[
          styles.segment,
          {
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.card,
            borderTopRightRadius: radius.card,
            shadowColor: colors.cardShadow,
          },
        ]}
      >
        {stub}
      </View>

      <View
        style={[
          styles.segment,
          styles.bodySegment,
          {
            backgroundColor: colors.surface,
            borderBottomLeftRadius: radius.card,
            borderBottomRightRadius: radius.card,
            shadowColor: colors.cardShadow,
          },
        ]}
      >
        {body}
      </View>

      {stubHeight > 0 && (
        <>
          <View style={[styles.perfRow, { top: stubHeight - 6 }]} pointerEvents="none">
            {holes.map((_, i) => (
              <View key={i} style={[styles.hole, { backgroundColor: colors.background }]} />
            ))}
          </View>
          <View
            pointerEvents="none"
            style={[styles.biteLeft, { top: stubHeight - 10, backgroundColor: colors.background }]}
          />
          <View
            pointerEvents="none"
            style={[styles.biteRight, { top: stubHeight - 10, backgroundColor: colors.background }]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  segment: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  bodySegment: { paddingTop: 22, alignItems: "center" },
  perfRow: {
    position: "absolute",
    left: 14,
    right: 14,
    height: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hole: { width: 7, height: 7, borderRadius: 4 },
  biteLeft: { position: "absolute", left: -10, width: 20, height: 20, borderRadius: 10 },
  biteRight: { position: "absolute", right: -10, width: 20, height: 20, borderRadius: 10 },
});
