import { apiRequest } from "./api";

export type PriceForecast = {
  commodityId: string;
  marketId: string;
  todayPrice: number;
  forecastLow: number;
  forecastHigh: number;
  /** e.g. "kg", "bunch", "100 tubers" — always show this next to the price. */
  unit: string;
  /** Non-null only when the number needs a caveat (currently: Yam). */
  unitNote: string | null;
  direction: "UP" | "DOWN" | "STABLE";
  confidencePct: number;
  reason: string;
};

export type MarketPrice = {
  marketId: string;
  marketName: string;
  price: number;
  unit: string;
};

export type TrendPoint = { label: string; price: number };

export type ForecastDetail = {
  commodityId: string;
  marketId: string;
  unit: string;
  unitNote: string | null;
  todayPrice: number;
  trendPoints: TrendPoint[];
  forecastLow: number;
  forecastHigh: number;
  pctChangeLow: number;
  pctChangeHigh: number;
  direction: "UP" | "DOWN" | "STABLE";
  confidencePct: number;
  recommendation: { title: string; detail: string };
  factors: { label: string; positive: boolean }[];
  modelUsed: string;
  monthsOfData: number | null;
  mape: number | null;
};

export function getForecastDetail(
  commodityId: string,
  marketId: string,
  period: "1w" | "2w"
): Promise<ForecastDetail> {
  const params = new URLSearchParams({ commodity: commodityId, market: marketId, period });
  return apiRequest<ForecastDetail>(`/forecast/detail?${params.toString()}`, { auth: true });
}

export type MarketMeta = {
  marketId: string;
  marketName: string;
  monthsOfData: number | null;
  available: boolean;
};

export function getMarketsMeta(commodityId: string): Promise<MarketMeta[]> {
  const params = new URLSearchParams({ commodity: commodityId });
  return apiRequest<MarketMeta[]>(`/markets/meta?${params.toString()}`, { auth: true });
}

/**
 * Real forecast, from the SARIMA/SARIMAX backend (see sarima.py +
 * PROJECT_HANDOFF.md for the modeling side). Requires the user to be
 * logged in — apiRequest attaches the bearer token automatically.
 */
export function getPriceForecast(
  commodityId: string,
  marketId: string,
  period: "1w" | "2w"
): Promise<PriceForecast> {
  const params = new URLSearchParams({ commodity: commodityId, market: marketId, period });
  return apiRequest<PriceForecast>(`/forecast?${params.toString()}`, { auth: true });
}

/**
 * Markets ranked by forecast price for a commodity — the "best markets to
 * sell" view. Deliberately a price ranking, not "demand": the underlying
 * datasets don't include volume/demand data.
 */
export function getBestMarkets(commodityId: string, period: "1w" | "2w"): Promise<MarketPrice[]> {
  const params = new URLSearchParams({ commodity: commodityId, period });
  return apiRequest<MarketPrice[]>(`/markets?${params.toString()}`, { auth: true });
}
