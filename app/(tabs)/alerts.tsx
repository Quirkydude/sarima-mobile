import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Pressable } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme, ThemeMode } from "../../context/ThemeContext";
import { COMMODITIES, COMMODITY_UNIT_HINT } from "../../constants/data";
import { apiRequest, ApiError } from "../../services/api";
import Card from "../../components/Card";
import SelectorChips from "../../components/SelectorChips";
import TextField from "../../components/TextField";
import BigButton from "../../components/BigButton";

const THEME_OPTIONS: { id: ThemeMode; label: string }[] = [
  { id: "light", label: "☀️ Light" },
  { id: "dark", label: "🌙 Dark" },
  { id: "system", label: "📱 Auto" },
];

export default function AlertsScreen() {
  const { user, logout } = useAuth();
  const { colors, spacing, typography, fonts, mode, setMode } = useTheme();

  const [commodityId, setCommodityId] = useState(COMMODITIES[0].id);
  const [threshold, setThreshold] = useState("");
  const [dailyEnabled, setDailyEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const unit = COMMODITY_UNIT_HINT[commodityId] ?? "kg";

  async function handleSave() {
    setError("");
    const price = parseFloat(threshold);
    if (!threshold || Number.isNaN(price) || price <= 0) {
      setError("Enter a valid price to be notified at.");
      return;
    }
    setSaving(true);
    try {
      await apiRequest("/alerts", {
        method: "POST",
        auth: true,
        body: {
          phone: user?.phone,
          commodity: commodityId,
          threshold_price: price,
          daily_summary: dailyEnabled,
        },
      });
      setSaved(true);
      setThreshold("");
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Couldn't save your alert. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout },
    ]);
  }

  const styles = makeStyles(colors, spacing, typography, fonts);

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings & Alerts</Text>
      <Text style={styles.subtitle}>
        {user?.name} · {user?.phone}
      </Text>

      <Card>
        <Text style={styles.cardTitle}>Notify me when price reaches...</Text>
        <Text style={styles.label}>COMMODITY</Text>
        <SelectorChips
          options={COMMODITIES.map((c) => ({ id: c.id, label: `${c.emoji} ${c.name}` }))}
          selectedId={commodityId}
          onSelect={setCommodityId}
        />
        <View style={{ marginTop: spacing.sm }}>
          <TextField
            label={`Price (GHS/${unit})`}
            placeholder="e.g. 30"
            keyboardType="numeric"
            value={threshold}
            onChangeText={setThreshold}
          />
        </View>
      </Card>

      <Card style={styles.rowCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Daily Forecast Summary</Text>
          <Text style={styles.rowSubtitle}>
            Sent every day at 6:00 AM once a real SMS/push backend is connected — for now this just saves your
            preference.
          </Text>
        </View>
        <Switch
          value={dailyEnabled}
          onValueChange={setDailyEnabled}
          trackColor={{ true: colors.primary, false: colors.border }}
        />
      </Card>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {saved ? <Text style={styles.saved}>Preferences saved ✓</Text> : null}
      <BigButton title="Save Preferences" onPress={handleSave} loading={saving} style={{ marginTop: spacing.sm }} />

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>Appearance</Text>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((opt) => {
            const selected = mode === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setMode(opt.id)}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: selected ? colors.primary : colors.background,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.themeChipText, { color: selected ? colors.textOnPrimary : colors.textDark }]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <BigButton title="Log Out" onPress={handleLogout} variant="outline" style={{ marginTop: spacing.md }} />
    </ScrollView>
  );
}

function makeStyles(colors: any, spacing: any, typography: any, fonts: any) {
  return StyleSheet.create({
    container: { padding: spacing.md, paddingBottom: spacing.xl },
    title: { ...typography.h2, color: colors.textDark, marginBottom: 4 },
    subtitle: { fontSize: 15, fontFamily: fonts.body, color: colors.textMuted, marginBottom: spacing.md },
    cardTitle: { fontSize: 17, fontFamily: fonts.bodyBold, color: colors.textDark, marginBottom: 10 },
    label: { ...typography.label, color: colors.textMuted, marginBottom: 8 },
    rowCard: { flexDirection: "row", alignItems: "center" },
    rowSubtitle: { fontSize: 14, fontFamily: fonts.body, color: colors.textMuted, marginTop: 2 },
    error: { color: colors.down, fontFamily: fonts.bodySemi, fontSize: 15, textAlign: "center", marginTop: spacing.sm },
    saved: { textAlign: "center", color: colors.up, fontFamily: fonts.bodyBold, marginTop: spacing.sm },
    themeRow: { flexDirection: "row", gap: 10 },
    themeChip: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    themeChipText: { fontFamily: fonts.bodySemi, fontSize: 14 },
  });
}
