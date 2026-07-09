import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSelection } from "../../context/SelectionContext";
import { COMMODITIES, MARKETS, PERIODS } from "../../constants/data";
import { getPriceForecast, PriceForecast } from "../../services/forecast";
import { fetchWeatherSummary, WeatherSummary } from "../../services/weather";
import { ApiError } from "../../services/api";
import Card from "../../components/Card";
import TicketCard from "../../components/TicketCard";
import SelectorChips from "../../components/SelectorChips";
import TrendArrow from "../../components/TrendArrow";
import ConfidenceBar from "../../components/ConfidenceBar";
import BigButton from "../../components/BigButton";

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors, spacing, typography, fonts } = useTheme();
  const router = useRouter();
  const { commodityId, marketId, period, setPeriod } = useSelection();

  const [forecast, setForecast] = useState<PriceForecast | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const market = useMemo(() => MARKETS.find((m) => m.id === marketId)!, [marketId]);
  const commodity = useMemo(() => COMMODITIES.find((c) => c.id === commodityId)!, [commodityId]);

  async function loadData() {
    setWeatherError(false);
    setForecastError(null);
    try {
      const fc = await getPriceForecast(commodityId, marketId, period);
      setForecast(fc);
    } catch (e) {
      setForecast(null);
      setForecastError(e instanceof ApiError ? e.message : "Couldn't load the forecast.");
    }

    try {
      const days = period === "1w" ? 7 : 14;
      const w = await fetchWeatherSummary(market.latitude, market.longitude, days);
      setWeather(w);
    } catch (e) {
      setWeatherError(true);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [commodityId, marketId, period]);

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  const direction = forecast?.direction ?? "STABLE";
  const bannerColor = direction === "UP" ? colors.up : direction === "DOWN" ? colors.down : colors.gold;
  // Gold reads fine with white text on green/red, but needs dark text on itself.
  const bannerTextColor = direction === "STABLE" ? colors.textDark : colors.white;

  const directionText =
    direction === "UP" ? "Price will go up" : direction === "DOWN" ? "Price will go down" : "Price will stay stable";

  const recommendation =
    direction === "UP"
      ? { title: "Hold your produce", variant: "primary" as const }
      : direction === "DOWN"
      ? { title: "Sell now", variant: "danger" as const }
      : { title: "Wait & watch", variant: "secondary" as const };

  const styles = makeStyles(colors, spacing, typography, fonts);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
    >
      <Text style={styles.greeting}>Hi{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋</Text>

      <Pressable onPress={() => router.push("/picker")} style={styles.selectionBar}>
        <Text style={styles.selectionText}>
          {commodity.emoji} {commodity.name} · {market.name}
        </Text>
        <Text style={styles.changeText}>Change ›</Text>
      </Pressable>

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
      ) : forecastError || !forecast ? (
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.errorTitle}>Couldn't load the forecast</Text>
          <Text style={styles.errorBody}>{forecastError || "Please try again."}</Text>
          <BigButton title="Try Again" onPress={loadData} variant="outline" style={{ marginTop: spacing.sm }} />
        </Card>
      ) : (
        <>
          <TicketCard
            style={{ marginTop: spacing.lg }}
            stub={
              <View style={{ alignItems: "center" }}>
                <Text style={styles.todayLabel}>TODAY'S PRICE — {market.name.toUpperCase()}</Text>
                <Text style={styles.todayPrice}>
                  {forecast.todayPrice}
                  <Text style={styles.todayUnit}> GHS/{forecast.unit}</Text>
                </Text>
                {forecast.unitNote ? <Text style={styles.unitNote}>{forecast.unitNote}</Text> : null}
              </View>
            }
            body={
              <View style={{ alignItems: "center", width: "100%" }}>
                <TrendArrow direction={forecast.direction} />
                <Text style={styles.forecastHeadline}>{directionText}</Text>
                <View style={[styles.rangePill, { backgroundColor: bannerColor }]}>
                  <Text style={[styles.forecastRange, { color: bannerTextColor }]}>
                    {PERIODS.find((p) => p.id === period)?.label}: {forecast.forecastLow}–{forecast.forecastHigh} GHS/
                    {forecast.unit}
                  </Text>
                </View>
                <View style={{ marginTop: spacing.md, width: "85%" }}>
                  <ConfidenceBar percent={forecast.confidencePct} showLabel />
                </View>
                <Text style={styles.reason}>{forecast.reason}</Text>
              </View>
            }
          />

          <BigButton
            title={recommendation.title}
            onPress={() => {}}
            variant={recommendation.variant}
            style={{ marginTop: spacing.md }}
          />

          <Pressable onPress={() => router.push("/forecast-detail")} style={styles.detailLink}>
            <Text style={styles.detailLinkText}>See detailed forecast & why →</Text>
          </Pressable>

          <Card style={{ marginTop: spacing.sm }}>
            <Text style={styles.weatherTitle}>🌦️ Weather — {market.name}</Text>
            {weatherError ? (
              <Text style={styles.weatherMuted}>Couldn't load weather right now.</Text>
            ) : !weather ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Text style={styles.weatherLine}>
                  Outlook: <Text style={{ fontFamily: fonts.bodyBold }}>{weather.outlook}</Text>
                </Text>
                <Text style={styles.weatherLine}>Average high: {weather.avgTempC}°C</Text>
                <Text style={styles.weatherLine}>
                  Rainy days: {weather.rainyDays} of {weather.totalDays}
                </Text>
              </>
            )}
          </Card>

          <Text style={styles.commodityFooter}>Next update tomorrow 6:00 AM</Text>
        </>
      )}
    </ScrollView>
  );
}

function makeStyles(colors: any, spacing: any, typography: any, fonts: any) {
  return StyleSheet.create({
    container: { padding: spacing.md, paddingBottom: spacing.xl },
    greeting: { ...typography.h2, color: colors.textDark, marginBottom: spacing.md },
    selectionBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      minHeight: 52,
    },
    selectionText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.textDark },
    changeText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.primary },
    label: { ...typography.label, color: colors.textMuted, marginBottom: 8 },
    loadingBox: { paddingVertical: 60, alignItems: "center" },
    todayLabel: { ...typography.label, color: colors.textMuted, marginBottom: 6 },
    todayPrice: { fontSize: 40, lineHeight: 46, fontFamily: fonts.display, color: colors.primary },
    todayUnit: { fontSize: 18, fontFamily: fonts.bodySemi, color: colors.textMuted },
    unitNote: { fontSize: 12, fontFamily: fonts.body, color: colors.textMuted, marginTop: 8, textAlign: "center", paddingHorizontal: 8 },
    errorTitle: { fontSize: 18, fontFamily: fonts.bodyBold, color: colors.down, marginBottom: 6, textAlign: "center" },
    errorBody: { fontSize: 15, fontFamily: fonts.body, color: colors.textMuted, textAlign: "center" },
    forecastHeadline: { fontSize: 22, fontFamily: fonts.display, color: colors.textDark, marginTop: spacing.sm },
    rangePill: { marginTop: spacing.sm, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
    forecastRange: { fontSize: 16, fontFamily: fonts.bodyBold },
    reason: { fontSize: 14, fontFamily: fonts.body, color: colors.textMuted, marginTop: spacing.md, textAlign: "center" },
    detailLink: { alignItems: "center", paddingVertical: 12 },
    detailLinkText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.primary },
    weatherTitle: { fontSize: 17, fontFamily: fonts.bodyBold, color: colors.textDark, marginBottom: 8 },
    weatherLine: { fontSize: 15, fontFamily: fonts.body, color: colors.textDark, marginBottom: 2 },
    weatherMuted: { fontSize: 15, fontFamily: fonts.body, color: colors.textMuted },
    commodityFooter: { textAlign: "center", fontFamily: fonts.body, color: colors.textMuted, marginTop: spacing.md, fontSize: 13 },
  });
}
