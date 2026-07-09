# GAPIP — Ghana Agricultural Price Intelligence Platform

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or your Camera app (iOS).

## What's wired up

- **Auth** (`context/AuthContext.tsx`): phone + password login, OTP only at
  signup (mock SMS — logs the code to the console, see `mockSendOtp`).
  Swap that function for a real provider (Twilio, Hubtel, Africa's Talking)
  before shipping.
- **Home / Forecast** (`app/(tabs)/index.tsx`): pick commodity + market +
  period, see price forecast (mock, deterministic) and real weather from
  Open-Meteo for that market's coordinates.
- **Markets** (`app/(tabs)/markets.tsx`): ranks markets by forecast price —
  the honest version of "demand," since the datasets only have price data,
  not volume/demand data.
- **Alerts** (`app/(tabs)/alerts.tsx`): price threshold + daily summary
  toggle (UI only — not yet wired to push/SMS).

## Swapping in the real SARIMA/SARIMAX backend

Replace the body of `getPriceForecast` and `getBestMarkets` in
`services/forecast.ts` with calls to your model API. Keep the same return
shape (`PriceForecast`, `MarketPrice`) and no screens need to change.

## Known gaps before production

- OTP is mocked client-side — needs a real SMS backend + server-side OTP
  verification (currently trivially bypassable).
- Passwords are stored in AsyncStorage in plain text — fine for a prototype,
  not for production. Needs a real backend with hashed passwords.
- No offline caching yet (brief requires "last cached forecast" on no
  connection) — add with AsyncStorage or expo-sqlite.
