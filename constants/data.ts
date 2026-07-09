export type Commodity = {
  id: string;
  name: string;
  emoji: string;
};

export const COMMODITIES: Commodity[] = [
  { id: "maize", name: "Maize", emoji: "🌽" },
  { id: "rice", name: "Rice", emoji: "🍚" },
  { id: "cassava", name: "Cassava", emoji: "🥔" },
  { id: "yam", name: "Yam", emoji: "🍠" },
  { id: "sorghum", name: "Sorghum", emoji: "🌾" },
  { id: "plantain", name: "Plantain", emoji: "🍌" },
];

// Mirrors backend/app/units.py — used for labels before a live forecast has
// loaded (e.g. the alert threshold field). The live forecast response is
// always the source of truth; this is just a same-day fallback/hint.
export const COMMODITY_UNIT_HINT: Record<string, string> = {
  maize: "kg",
  rice: "kg",
  cassava: "kg",
  sorghum: "kg",
  plantain: "bunch",
  yam: "100 tubers",
};

export type Market = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export const MARKETS: Market[] = [
  { id: "kumasi", name: "Kumasi", latitude: 6.6885, longitude: -1.6244 },
  { id: "accra", name: "Accra", latitude: 5.6037, longitude: -0.187 },
  { id: "tamale", name: "Tamale", latitude: 9.4075, longitude: -0.8393 },
  { id: "takoradi", name: "Takoradi", latitude: 4.8845, longitude: -1.7554 },
  { id: "tema", name: "Tema", latitude: 5.6698, longitude: -0.0166 },
];

export const PERIODS = [
  { id: "1w", label: "Next Week" },
  { id: "2w", label: "Next 2 Weeks" },
];
