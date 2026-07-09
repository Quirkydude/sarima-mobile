import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import TextField from "../../components/TextField";
import BigButton from "../../components/BigButton";
import AuthHeader from "../../components/AuthHeader";

export default function VerifyOtpScreen() {
  const { pendingSignup, verifySignupOtp, startSignup } = useAuth();
  const { colors, spacing, fonts } = useTheme();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const styles = makeStyles(colors, spacing, fonts);

  async function handleVerify() {
    setError("");
    if (code.trim().length !== 4) {
      setError("Enter the 4-digit code we sent you.");
      return;
    }
    setLoading(true);
    try {
      const ok = await verifySignupOtp(code.trim());
      if (!ok) {
        setError("That code is not correct. Please try again.");
      }
      // On success, root layout will redirect to (tabs) automatically.
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!pendingSignup) return;
    setError("");
    try {
      await startSignup(pendingSignup.name, pendingSignup.phone, pendingSignup.password);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (e: any) {
      setError(e?.message || "Couldn't resend the code. Please try again.");
    }
  }

  if (!pendingSignup) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Session expired</Text>
        <BigButton title="Back to Sign Up" onPress={() => router.replace("/(auth)/signup")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AuthHeader title="Verify your number" subtitle={`We sent a 4-digit code by SMS to ${pendingSignup.phone}`} />

      <View style={styles.form}>
        <TextField
          label="Enter Code"
          placeholder="0000"
          keyboardType="number-pad"
          maxLength={4}
          value={code}
          onChangeText={setCode}
          style={{ textAlign: "center", fontSize: 28, letterSpacing: 8 }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {resent ? <Text style={styles.success}>New code sent!</Text> : null}

        <BigButton title="Verify & Continue" onPress={handleVerify} loading={loading} style={{ marginTop: 8 }} />
        <BigButton title="Resend Code" onPress={handleResend} variant="outline" style={{ marginTop: 14 }} />
      </View>
    </View>
  );
}

function makeStyles(colors: any, spacing: any, fonts: any) {
  return StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, backgroundColor: colors.background },
    emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, backgroundColor: colors.background },
    emptyTitle: { fontSize: 22, fontFamily: fonts.display, color: colors.textDark, marginBottom: 16, textAlign: "center" },
    form: { width: "100%", maxWidth: 420 },
    error: { color: colors.down, fontFamily: fonts.bodySemi, fontSize: 15, marginBottom: 12, textAlign: "center" },
    success: { color: colors.up, fontFamily: fonts.bodySemi, fontSize: 15, marginBottom: 12, textAlign: "center" },
  });
}
