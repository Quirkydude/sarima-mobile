/**
 * GAPIP design tokens.
 * ---------------------------------------------------------------------
 * DESIGN CONCEPT — "Market Ticket"
 * The core metaphor: a forecast is a slip a trader is handed before
 * deciding whether to sell. The signature visual element (see
 * components/TicketCard.tsx) gives the hero forecast a torn/perforated
 * ticket-stub edge — official-feeling, concrete, and legible to someone
 * who may not read English fluently: it looks like a thing you're handed,
 * not an abstract dashboard widget.
 *
 * TYPE PAIRING
 *   Display/numerals — Sora: geometric, warm, excellent large numerals.
 *     Used for prices, headlines, the UP/DOWN call.
 *   Body/UI — Inter: the most road-tested legible-at-small-sizes face,
 *     used everywhere else (labels, buttons, body copy).
 *
 * COLOR
 *   Rooted in the project brief's exact palette (dark green / gold /
 *   up-green / down-red). One deliberate deviation: the brief's raw
 *   #FFD700 gold fails WCAG AA as text/icon color on white (contrast
 *   ~1.6:1). We keep #FFD700 for solid fills (chips, STABLE badges) where
 *   only dark text sits on top of it, and use a deepened gold (goldText)
 *   for any case where gold itself needs to be legible as text or a thin
 *   stroke. Everything else follows the brief's hex values exactly.
 * ---------------------------------------------------------------------
 */

export const Fonts = {
  display: "Sora_700Bold",
  displaySemi: "Sora_600SemiBold",
  displayMedium: "Sora_500Medium",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemi: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
};

export type ThemeColors = {
  // brand
  primary: string;
  primaryDeep: string;
  primaryTint: string;
  gold: string;
  goldText: string;
  up: string;
  upTint: string;
  down: string;
  downTint: string;
  // surfaces
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  cardShadow: string;
  // text
  textDark: string;
  textMuted: string;
  textOnPrimary: string;
  white: string;
  black: string;
};

export const LightColors: ThemeColors = {
  primary: "#1A5C38",
  primaryDeep: "#123F27",
  primaryTint: "#E8F4EE",
  gold: "#FFD700",
  goldText: "#8A6D00",
  up: "#40A746",
  upTint: "#E4F5E5",
  down: "#DC3545",
  downTint: "#FBE8EA",
  background: "#F7FAF8",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  border: "#DCE6E0",
  cardShadow: "rgba(18, 40, 28, 0.14)",
  textDark: "#12241C",
  textMuted: "#5B6B62",
  textOnPrimary: "#FFFFFF",
  white: "#FFFFFF",
  black: "#000000",
};

export const DarkColors: ThemeColors = {
  primary: "#4CAF6E",
  primaryDeep: "#2E7A4A",
  primaryTint: "#16281D",
  gold: "#FFD700",
  goldText: "#FFD700",
  up: "#4CD97D",
  upTint: "#173323",
  down: "#FF6B6B",
  downTint: "#3A1A1D",
  background: "#0F1A14",
  surface: "#182A20",
  surfaceRaised: "#1F3628",
  border: "#2C3D33",
  cardShadow: "rgba(0, 0, 0, 0.45)",
  textDark: "#EAF3ED",
  textMuted: "#9DB0A4",
  textOnPrimary: "#0F1A14",
  white: "#FFFFFF",
  black: "#000000",
};

export const Spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 36 };

export const Radius = { button: 16, card: 20, pill: 999, chip: 14 };

export const Typography = {
  h1: { fontFamily: Fonts.display, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: Fonts.display, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: Fonts.displaySemi, fontSize: 18, lineHeight: 24 },
  bodyLg: { fontFamily: Fonts.body, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 21 },
  label: { fontFamily: Fonts.bodySemi, fontSize: 13, letterSpacing: 0.6 },
  numeral: { fontFamily: Fonts.display, fontSize: 40, lineHeight: 46 },
};

/**
 * Legacy static export — kept so any file that still imports `Colors`
 * directly (rather than via useTheme()) doesn't crash. Prefer
 * `const { colors } = useTheme()` in new/updated code; this always
 * reflects the LIGHT palette only.
 */
export const Colors = LightColors;
