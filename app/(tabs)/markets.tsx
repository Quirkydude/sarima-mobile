import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { COMMODITIES, PERIODS } from "../../constants/data";
import { getBestMarkets, MarketPrice } from "../../services/forecast";
import { ApiError } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import Card from "../../components/Card";
import SelectorChips from "../../components/SelectorChips";
import BigButton from "../../components/BigButton";

export default function MarketsScreen() {
  const { colors, spacing, typography, fonts, radius } = useTheme();
  const [commodityId, setCommodityId] = useState(COMMODITIES[0].id);
  const [period, setPeriod] = useState<"1w" | "2w">("1w");

  const [markets, setMarkets] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const commodity = COMMODITIES.find((c) => c.id === commodityId)!;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await getBestMarkets(commodityId, period);
      setMarkets(result);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Couldn't load market prices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [commodityId, period]);

  const highest = markets[0]?.price ?? 0;
  const lowest = markets[markets.length - 1]?.price ?? 0;
  const unit = markets[0]?.unit ?? "kg";

  function tierColor(price: number) {
    const range = highest - lowest || 1;
    const pos = (price - lowest) / range;
    if (pos > 0.66) return colors.up;
    if (pos > 0.33) return colors.goldText;
    return colors.down;
  }

  const styles = makeStyles(colors, spacing, typography, fonts, radius);

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Best Markets to Sell</Text>
      <Text style={styles.subtitle}>Ranked by forecast price — highest first</Text>

      <Text style={styles.label}>COMMODITY</Text>
      <SelectorChips
        options={COMMODITIES.map((c) => ({ id: c.id, label: `${c.emoji} ${c.name}` }))}
        selectedId={commodityId}
        onSelect={setCommodityId}
      />

      <Text style={[styles.label, { marginTop: spacing.md }]}>PERIOD</Text>
      <SelectorChips
        options={PERIODS.map((p) => ({ id: p.id, label: p.label }))}
        selectedId={period}
        onSelect={(id) => setPeriod(id as "1w" | "2w")}
      />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.errorTitle}>Couldn't load market prices</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <BigButton title="Try Again" onPress={load} variant="outline" style={{ marginTop: spacing.sm }} />
        </Card>
      ) : (
        <>
          <View style={{ marginTop: spacing.lg }}>
            {markets.map((m, i) => (
              <Card key={m.marketId} style={styles.marketRow}>
                <View style={[styles.rankBadge, { backgroundColor: tierColor(m.price) }]}>
                  <Text style={styles.rankText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.marketName}>{m.marketName}</Text>
                  {i === 0 ? <Text style={styles.bestTag}>Best price this period</Text> : null}
                </View>
                <Text style={[styles.price, { color: tierColor(m.price) }]}>
                  {m.price} GHS/{m.unit}
                </Text>
              </Card>
            ))}
          </View>

          <Text style={styles.note}>
            Note: this ranks markets by forecast price for {commodity.name.toLowerCase()} (GHS/{unit}). It reflects
            where prices are expected to be highest, not a direct measure of buyer demand.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

function makeStyles(colors: any, spacing: any, typography: any, fonts: any, radius: any) {
  return StyleSheet.create({
    container: { padding: spacing.md, paddingBottom: spacing.xl },
    title: { ...typography.h2, color: colors.textDark, marginBottom: 4 },
    subtitle: { fontSize: 15, fontFamily: fonts.body, color: colors.textMuted, marginBottom: spacing.md },
    label: { ...typography.label, color: colors.textMuted, marginBottom: 8 },
    loadingBox: { paddingVertical: 60, alignItems: "center" },
    errorTitle: { fontSize: 18, fontFamily: fonts.bodyBold, color: colors.down, marginBottom: 6, textAlign: "center" },
    errorBody: { fontSize: 15, fontFamily: fonts.body, color: colors.textMuted, textAlign: "center" },
    marketRow: { flexDirection: "row", alignItems: "center", gap: 14 },
    rankBadge: { width: 36, height: 36, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
    rankText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 },
    marketName: { fontSize: 17, fontFamily: fonts.bodyBold, color: colors.textDark },
    bestTag: { fontSize: 13, fontFamily: fonts.bodySemi, color: colors.up, marginTop: 2 },
    price: { fontSize: 17, fontFamily: fonts.display },
    note: { fontSize: 13, fontFamily: fonts.body, color: colors.textMuted, marginTop: spacing.sm, textAlign: "center", paddingHorizontal: 10 },
  });
}
