import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import TextField from "../../components/TextField";
import BigButton from "../../components/BigButton";
import AuthHeader from "../../components/AuthHeader";

export default function LoginScreen() {
  const { login, lastError } = useAuth();
  const { colors, spacing, fonts } = useTheme();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (!phone.trim() || !password) {
      setError("Please enter your phone number and password.");
      return;
    }
    setLoading(true);
    try {
      const ok = await login(phone.trim(), password);
      if (!ok) {
        setError(lastError || "Phone number or password is incorrect.");
      }
    } finally {
      setLoading(false);
    }
  }

  const styles = makeStyles(colors, spacing, fonts);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AuthHeader title="Welcome back" subtitle="Log in to see your price forecasts" />

        <View style={styles.form}>
          <TextField
            label="Phone Number"
            placeholder="e.g. 024 123 4567"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <BigButton title="Log In" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

          <Link href="/(auth)/signup" asChild>
            <BigButton title="Create New Account" onPress={() => {}} variant="outline" style={{ marginTop: 14 }} />
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: any, spacing: any, fonts: any) {
  return StyleSheet.create({
    container: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
    form: { width: "100%", maxWidth: 420 },
    error: { color: colors.down, fontFamily: fonts.bodySemi, fontSize: 15, marginBottom: 12, textAlign: "center" },
  });
}
