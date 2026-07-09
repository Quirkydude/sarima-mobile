import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import TextField from "../../components/TextField";
import BigButton from "../../components/BigButton";
import AuthHeader from "../../components/AuthHeader";

export default function SignupScreen() {
  const { startSignup } = useAuth();
  const { colors, spacing, fonts } = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");
    if (!name.trim() || !phone.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await startSignup(name.trim(), phone.trim(), password);
      router.push("/(auth)/verify-otp");
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const styles = makeStyles(colors, spacing, fonts);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AuthHeader title="Create account" subtitle="We'll text you a code to confirm your number" />

        <View style={styles.form}>
          <TextField label="Your Name" placeholder="e.g. Kwame Mensah" value={name} onChangeText={setName} />
          <TextField
            label="Phone Number"
            placeholder="e.g. 024 123 4567"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextField
            label="Create Password"
            placeholder="At least 4 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextField
            label="Confirm Password"
            placeholder="Type it again"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <BigButton title="Send Code" onPress={handleSignup} loading={loading} style={{ marginTop: 8 }} />

          <Link href="/(auth)/login" asChild>
            <BigButton title="I Already Have an Account" onPress={() => {}} variant="outline" style={{ marginTop: 14 }} />
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
