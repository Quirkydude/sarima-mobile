export type WeatherSummary = {
  avgTempC: number;
  totalRainMm: number;
  rainyDays: number;
  totalDays: number;
  outlook: "Dry" | "Some Rain" | "Heavy Rain";
};

/**
 * Fetches a daily forecast from Open-Meteo (no API key required) and
 * summarises it over the requested number of days (7 or 14).
 */
export async function fetchWeatherSummary(
  latitude: number,
  longitude: number,
  days: 7 | 14
): Promise<WeatherSummary> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&daily=temperature_2m_max,precipitation_sum` +
    `&forecast_days=${days}` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather request failed: ${res.status}`);
  }
  const json = await res.json();

  const temps: number[] = json?.daily?.temperature_2m_max ?? [];
  const rains: number[] = json?.daily?.precipitation_sum ?? [];

  const avgTempC =
    temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 0;
  const totalRainMm = rains.reduce((a, b) => a + b, 0);
  const rainyDays = rains.filter((r) => r > 1).length;

  let outlook: WeatherSummary["outlook"] = "Dry";
  if (totalRainMm > 40) outlook = "Heavy Rain";
  else if (totalRainMm > 5) outlook = "Some Rain";

  return {
    avgTempC: Math.round(avgTempC),
    totalRainMm: Math.round(totalRainMm),
    rainyDays,
    totalDays: rains.length,
    outlook,
  };
}
