import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useSelection } from "../context/SelectionContext";
import { COMMODITIES, MARKETS } from "../constants/data";
import { getMarketsMeta, MarketMeta } from "../services/forecast";
import { ApiError } from "../services/api";

type Step = "commodity" | "market";

export default function PickerScreen() {
  const router = useRouter();
  const { colors, spacing, fonts, radius } = useTheme();
  const { commodityId, marketId, setCommodityId, setMarketId } = useSelection();

  const [step, setStep] = useState<Step>("commodity");
  const [pendingCommodity, setPendingCommodity] = useState(commodityId);
  const [meta, setMeta] = useState<MarketMeta[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);

  const styles = makeStyles(colors, spacing, fonts, radius);

  useEffect(() => {
    if (step !== "market") return;
    setLoadingMeta(true);
    setMetaError(null);
    getMarketsMeta(pendingCommodity)
      .then(setMeta)
      .catch((e) => setMetaError(e instanceof ApiError ? e.message : "Couldn't load market info."))
      .finally(() => setLoadingMeta(false));
  }, [step, pendingCommodity]);

  function pickCommodity(id: string) {
    setPendingCommodity(id);
    setStep("market");
  }

  function pickMarket(id: string) {
    setCommodityId(pendingCommodity);
    setMarketId(id);
    router.back();
  }

  const commodity = COMMODITIES.find((c) => c.id === pendingCommodity)!;

  return (
    <View style={[styles.container, { paddingTop: 56 }]}>
      <View style={styles.header}>
        {step === "market" ? (
          <Pressable onPress={() => setStep("commodity")} hitSlop={12} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>‹ Back</Text>
          </Pressable>
        ) : (
          <View style={styles.headerBtn} />
        )}
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Close ✕</Text>
        </Pressable>
      </View>

      {step === "commodity" ? (
        <>
          <Text style={styles.title}>Select Commodity</Text>
          <Text style={styles.subtitle}>What are you buying or selling?</Text>
          <View style={styles.grid}>
            {COMMODITIES.map((c) => {
              const selected = c.id === commodityId;
              return (
                <Pressable key={c.id} onPress={() => pickCommodity(c.id)} style={styles.gridCellWrap}>
                  <View
                    style={[
                      styles.card,
                      { backgroundColor: colors.surface, borderColor: selected ? colors.primary : colors.border },
                    ]}
                  >
                    <Text style={styles.cardEmoji}>{c.emoji}</Text>
                    <Text style={styles.cardLabel}>{c.name}</Text>
                    {selected ? <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Select Market</Text>
          <Text style={styles.subtitle}>
            {commodity.emoji} {commodity.name} — where do you want the forecast for?
          </Text>

          {loadingMeta ? (
            <View style={{ paddingVertical: 50, alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : metaError ? (
            <Text style={styles.error}>{metaError}</Text>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
              {MARKETS.map((m) => {
                const info = meta.find((x) => x.marketId === m.id);
                const selected = m.id === marketId && pendingCommodity === commodityId;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => pickMarket(m.id)}
                    disabled={info ? !info.available : false}
                    style={[
                      styles.marketRow,
                      {
                        backgroundColor: colors.surface,
                        borderColor: selected ? colors.primary : colors.border,
                        opacity: info && !info.available ? 0.45 : 1,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.marketName}>{m.name}</Text>
                      <Text style={styles.marketMeta}>
                        {info?.available
                          ? info.monthsOfData
                            ? `${info.monthsOfData} months of price data`
                            : "Data available"
                          : "Not enough data yet"}
                      </Text>
                    </View>
                    {selected ? (
                      <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.checkBadgeText}>✓</Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

function makeStyles(colors: any, spacing: any, fonts: any, radius: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
    headerBtn: { minWidth: 70, minHeight: 32, justifyContent: "center" },
    headerBtnText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.primary },
    title: { fontFamily: fonts.display, fontSize: 24, color: colors.textDark, marginBottom: 4 },
    subtitle: { fontFamily: fonts.body, fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    gridCellWrap: { width: "48%", marginBottom: 14 },
    card: {
      borderRadius: radius.card,
      borderWidth: 2,
      paddingVertical: 22,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 110,
    },
    cardEmoji: { fontSize: 40, marginBottom: 8 },
    cardLabel: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.textDark },
    selectedDot: { position: "absolute", top: 10, right: 10, width: 10, height: 10, borderRadius: 5 },
    marketRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderRadius: radius.card,
      padding: 16,
      marginBottom: 12,
      minHeight: 64,
    },
    marketName: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.textDark },
    marketMeta: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },
    checkBadge: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    checkBadgeText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 15 },
    error: { fontFamily: fonts.body, color: colors.down, textAlign: "center", marginTop: 40 },
  });
}
