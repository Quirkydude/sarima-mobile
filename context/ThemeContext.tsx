import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightColors, DarkColors, ThemeColors, Spacing, Radius, Typography, Fonts } from "../constants/theme";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof Spacing;
  radius: typeof Radius;
  typography: typeof Typography;
  fonts: typeof Fonts;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "gapip_theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark" || saved === "system") {
          setModeState(saved);
        }
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  function setMode(next: ThemeMode) {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  const isDark = mode === "dark" || (mode === "system" && systemScheme === "dark");
  const colors = isDark ? DarkColors : LightColors;

  const value = useMemo(
    () => ({ mode, isDark, colors, spacing: Spacing, radius: Radius, typography: Typography, fonts: Fonts, setMode }),
    [mode, isDark, colors]
  );

  // Avoid a flash of the wrong theme while AsyncStorage is read.
  if (!loaded) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
