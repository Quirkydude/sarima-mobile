import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Share } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useSelection } from "../context/SelectionContext";
import { COMMODITIES, MARKETS, PERIODS } from "../constants/data";
import { getForecastDetail, ForecastDetail } from "../services/forecast";
import { ApiError } from "../services/api";
import Card from "../components/Card";
import BigButton from "../components/BigButton";

export default function ForecastDetailScreen() {
  const router = useRouter();
  const { colors, spacing, fonts, radius } = useTheme();
  const { commodityId, marketId, period } = useSelection();

  const [detail, setDetail] = useState<ForecastDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const commodity = COMMODITIES.find((c) => c.id === commodityId)!;
  const market = MARKETS.find((m) => m.id === marketId)!;
  const periodLabel = PERIODS.find((p) => p.id === period)?.label ?? "this period";

  function load() {
    setLoading(true);
    setError(null);
    getForecastDetail(commodityId, marketId, period)
      .then(setDetail)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load the detailed forecast."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [commodityId, marketId, period]);

  const directionColor = detail
    ? detail.direction === "UP"
      ? colors.up
      : detail.direction === "DOWN"
      ? colors.down
      : colors.goldText
    : colors.textMuted;

  const styles = makeStyles(colors, spacing, fonts, radius);

  async function handleShare() {
    if (!detail) return;
    const msg =
      `${commodity.emoji} ${commodity.name} — ${market.name}\n` +
      `Today: ${detail.todayPrice} GHS/${detail.unit}\n` +
      `${periodLabel}: ${detail.forecastLow}–${detail.forecastHigh} GHS/${detail.unit} ` +
      `(${detail.pctChangeLow > 0 ? "+" : ""}${detail.pctChangeLow}% to ${detail.pctChangeHigh > 0 ? "+" : ""}${detail.pctChangeHigh}%)\n` +
      `Recommendation: ${detail.recommendation.title}\n\nvia GAPIP`;
    try {
      await Share.share({ message: msg });
    } catch {
      // user cancelled — nothing to do
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {commodity.emoji} {commodity.name} · {market.name}
        </Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error || !detail ? (
        <View style={{ padding: spacing.md }}>
          <Card>
            <Text style={styles.errorTitle}>Couldn't load this forecast</Text>
            <Text style={styles.errorBody}>{error}</Text>
            <BigButton title="Try Again" onPress={load} variant="outline" style={{ marginTop: spacing.sm }} />
          </Card>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
          <Card>
            <Text style={styles.sectionLabel}>CURRENT STATUS</Text>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusMuted}>Today</Text>
                <Text style={styles.statusPrice}>
                  {detail.todayPrice} <Text style={styles.statusUnit}>GHS/{detail.unit}</Text>
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.statusMuted}>{periodLabel}</Text>
                <Text style={[styles.statusRange, { color: directionColor }]}>
                  {detail.forecastLow}–{detail.forecastHigh}
                </Text>
              </View>
            </View>
            <View style={[styles.changePill, { backgroundColor: directionColor }]}>
              <Text style={styles.changePillText}>
                Change: {detail.pctChangeLow > 0 ? "+" : ""}
                {detail.pctChangeLow}% to {detail.pctChangeHigh > 0 ? "+" : ""}
                {detail.pctChangeHigh}%  ·  Confidence: {detail.confidencePct}%
              </Text>
            </View>
            {detail.unitNote ? <Text style={styles.unitNote}>{detail.unitNote}</Text> : null}
          </Card>

          <Card>
            <Text style={styles.sectionLabel}>PRICE TREND</Text>
            {detail.trendPoints.map((pt, i) => {
              const isLast = i === detail.trendPoints.length - 1;
              return (
                <View key={pt.label} style={styles.trendRow}>
                  <View style={styles.trendLeft}>
                    <View
                      style={[
                        styles.trendDot,
                        { backgroundColor: isLast ? directionColor : colors.border },
                      ]}
                    />
                    {i < detail.trendPoints.length - 1 ? (
                      <View style={[styles.trendLine, { backgroundColor: colors.border }]} />
                    ) : null}
                  </View>
                  <Text style={styles.trendLabel}>{pt.label}</Text>
                  <Text style={[styles.trendPrice, isLast && { color: directionColor, fontFamily: fonts.bodyBold }]}>
                    {pt.price} GHS/{detail.unit}
                  </Text>
                </View>
              );
            })}
          </Card>

          <Card>
            <Text style={styles.sectionLabel}>WHY THIS FORECAST</Text>
            {detail.factors.map((f) => (
              <View key={f.label} style={styles.factorRow}>
                <Text style={[styles.factorMark, { color: f.positive ? colors.up : colors.down }]}>
                  {f.positive ? "✓" : "✗"}
                </Text>
                <Text style={styles.factorLabel}>{f.label}</Text>
              </View>
            ))}
            <Text style={styles.modelNote}>
              Model: {detail.modelUsed}
              {detail.monthsOfData ? ` · ${detail.monthsOfData} months of data` : ""}
              {detail.mape ? ` · ~${detail.mape}% typical error` : ""}
            </Text>
          </Card>

          <Card style={{ backgroundColor: colors.gold + "22", borderWidth: 1.5, borderColor: colors.gold }}>
            <Text style={styles.sectionLabel}>RECOMMENDATION</Text>
            <Text style={styles.recTitle}>{detail.recommendation.title}</Text>
            <Text style={styles.recDetail}>{detail.recommendation.detail}</Text>
          </Card>

          <BigButton title="Share This Forecast" onPress={handleShare} variant="outline" style={{ marginTop: spacing.sm }} />
        </ScrollView>
      )}
    </View>
  );
}

function makeStyles(colors: any, spacing: any, fonts: any, radius: any) {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 56,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: { minWidth: 60, minHeight: 32, justifyContent: "center" },
    backBtnText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.primary },
    headerTitle: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.textDark, flex: 1, textAlign: "center" },
    loadingBox: { flex: 1, alignItems: "center", justifyContent: "center" },
    errorTitle: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.down, marginBottom: 6, textAlign: "center" },
    errorBody: { fontFamily: fonts.body, fontSize: 15, color: colors.textMuted, textAlign: "center" },
    sectionLabel: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 0.6, color: colors.textMuted, marginBottom: 12 },
    statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    statusMuted: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted, marginBottom: 2 },
    statusPrice: { fontFamily: fonts.display, fontSize: 26, color: colors.primary },
    statusUnit: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.textMuted },
    statusRange: { fontFamily: fonts.display, fontSize: 22 },
    changePill: { marginTop: 14, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12 },
    changePillText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.white, textAlign: "center" },
    unitNote: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, marginTop: 10 },
    trendRow: { flexDirection: "row", alignItems: "center", minHeight: 36 },
    trendLeft: { width: 20, alignItems: "center" },
    trendDot: { width: 10, height: 10, borderRadius: 5 },
    trendLine: { width: 2, flex: 1, minHeight: 18 },
    trendLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.textDark, flex: 1, marginLeft: 10 },
    trendPrice: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.textDark },
    factorRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
    factorMark: { fontFamily: fonts.bodyBold, fontSize: 16, width: 24 },
    factorLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.textDark, flex: 1 },
    modelNote: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, marginTop: 4, fontStyle: "italic" },
    recTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.textDark, marginBottom: 4 },
    recDetail: { fontFamily: fonts.body, fontSize: 14, color: colors.textDark },
  });
}
