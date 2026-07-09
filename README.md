# GAPIP — Ghana Agricultural Price Intelligence Platform

Mobile app for checking crop price forecasts and market rankings in Ghana.

This guide is written for someone new to Expo. Follow the steps in order — you should be able to open the app on your **real phone** using **Expo Go** in about 15 minutes.

---

## Before you start (checklist)

You will need all of the following:

| What | Why |
|------|-----|
| A **computer** (Windows, Mac, or Linux) | Runs the app code and the API backend |
| **Node.js** (version 18 or newer) | Installs and runs the project |
| A **smartphone** (Android or iPhone) | Where you will view the app |
| **Expo Go** app installed on that phone | Loads the app without building a full install |
| The **GAPIP backend** running on your computer | Login, forecasts, and markets all come from the API |
| Phone and computer on the **same Wi‑Fi network** | Required for Expo Go and for the app to reach your computer |

> **Important:** This folder is only the **mobile app**. It does not work by itself — the **backend API** must also be running (usually on port `8000`). If you do not have the backend yet, ask whoever gave you this project for the backend repo and its setup steps.

---

## Step 1 — Install Node.js

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (the big green button).
3. Run the installer — accept the defaults.
4. Open a **terminal**:
   - **Windows:** press `Win + R`, type `cmd`, press Enter  
   - **Mac:** open **Terminal** from Applications → Utilities
5. Check it worked:

```bash
node --version
npm --version
```

You should see version numbers (e.g. `v20.x.x` and `10.x.x`). If you get “not recognized”, close the terminal, open a new one, and try again.

---

## Step 2 — Install Expo Go on your phone

| Phone | What to do |
|-------|------------|
| **Android** | [Expo Go on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| **iPhone** | [Expo Go on the App Store](https://apps.apple.com/app/expo-go/id982107779) |

Install it and leave it on your home screen — you will open it in Step 7.

---

## Step 3 — Open the project folder in a terminal

1. Unzip or clone this project if you have not already.
2. Open a terminal **inside** the project folder (the one that contains `package.json`).

**Windows (easy way):**

1. Open File Explorer and go to the project folder.
2. Click the address bar, type `cmd`, press Enter.  
   A terminal opens already in the right place.

**Mac / Linux:**

```bash
cd path/to/gapip-app
```

---

## Step 4 — Install project dependencies

In that terminal, run:

```bash
npm install
```

Wait until it finishes (can take a few minutes the first time). You should see a `node_modules` folder appear with no red error messages.

---

## Step 5 — Start the backend API

The app talks to a server on your computer. **Start the backend first** (ask your teammate for the exact commands if you have a separate `gapip-backend` repo).

Typical pattern:

```bash
# In the BACKEND project folder (not this app folder):
# e.g. uvicorn main:app --host 0.0.0.0 --port 8000
```

Leave that terminal window **open** while you use the app.

**Quick check:** in your browser on the computer, open `http://localhost:8000/docs` (or whatever URL your backend README says). If you see API documentation, the backend is up.

---

## Step 6 — Point the app at your computer (`.env` file)

When you use Expo Go on a **real phone**, `localhost` means the **phone**, not your laptop. You must tell the app your computer’s **Wi‑Fi IP address**.

### 6a. Find your computer’s IP address

**Windows**

1. Open Command Prompt.
2. Run:

```bash
ipconfig
```

3. Under your active **Wi‑Fi** adapter, find **IPv4 Address** — something like `192.168.1.42`. Copy it.

**Mac**

```bash
ipconfig getifaddr en0
```

**Linux**

```bash
hostname -I
```

### 6b. Create the `.env` file

1. In the **app** project folder, copy the example file:
   - **Windows (cmd):** `copy .env.example .env`
   - **Mac / Linux:** `cp .env.example .env`
2. Open `.env` in Notepad (or any text editor).
3. Replace `localhost` with your IP from step 6a:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.42:8000
```

Use **your** IP and keep port `8000` unless the backend uses a different port.

4. Save the file.

> If you change `.env` later, stop Expo (Ctrl+C) and start it again (Step 7). Use `npx expo start -c` to clear the cache if the app still uses the old URL.

---

## Step 7 — Start Expo and open the app on your phone

In the **app** project folder (same terminal as Step 4, or a new one):

```bash
npx expo start
```

After a few seconds you should see a **QR code** in the terminal (and often in the browser).

### Connect your phone

| Phone | How to scan |
|-------|-------------|
| **Android** | Open **Expo Go** → tap **Scan QR code** → scan the code in the terminal |
| **iPhone** | Open the **Camera** app → point at the QR code → tap the banner → opens in Expo Go |

**Rules:**

- Phone and computer must be on the **same Wi‑Fi** (not mobile data).
- Keep the terminal running — closing it stops the app.
- The first load can take 30–60 seconds; that is normal.

### If the QR code does not work

In the Expo terminal, press `s` to switch connection mode and try **Tunnel** (slower but works across tricky networks). Or press `?` to see other keys.

---

## Step 8 — Create an account and log in

1. When the app opens, tap **Create New Account**.
2. Fill in name, phone number, and password (at least 4 characters).
3. You will be asked for a **4-digit OTP** sent during signup.  
   In development, the code is usually printed in the **backend terminal** (not the Expo terminal) — check the window where the API is running.
4. After verification, you land on the **Home** tab with forecasts.

To log in later: use the same phone number and password on the **Log In** screen.

---

## What each screen does

| Screen | What it shows |
|--------|----------------|
| **Home** | Pick a commodity, market, and period → price forecast + weather |
| **Markets** | Markets ranked by forecast price for a commodity |
| **Alerts** | Price alert settings (UI only — push/SMS not wired yet) |

---

## Troubleshooting

### “Can’t reach the server” / login or forecasts fail

1. Is the **backend** still running? Check `http://YOUR_IP:8000` from your computer.
2. Is `.env` using your **Wi‑Fi IP**, not `localhost`?
3. Are phone and computer on the **same Wi‑Fi**?
4. Did you **restart Expo** after editing `.env`? Try `npx expo start -c`.
5. Windows firewall may block port 8000 — allow Python/your backend when prompted, or ask IT.

### Expo Go cannot connect / endless loading

1. Same Wi‑Fi on both devices.
2. Try tunnel mode: in the Expo terminal, press `s` → choose **Tunnel**.
3. Restart Expo: Ctrl+C, then `npx expo start -c`.

### `npm install` errors

1. Confirm Node 18+: `node --version`.
2. Delete `node_modules` and `package-lock.json`, then run `npm install` again.
3. On Windows, run the terminal as a normal user (not always required, but helps with permissions).

### OTP never arrives

There is no real SMS in development. Look at the **backend server logs** for the 4-digit code. If nothing appears, the signup request may not be reaching the API — fix the connection issues above first.

### Red error screen in Expo Go

Read the message at the top. Often it is a network or missing backend issue. Shake the phone (or press `m` in the Expo terminal) to open the developer menu → **Reload**.

---

## Useful commands (reference)

```bash
npm install          # Install dependencies (first time, or after pulling updates)
npx expo start       # Start dev server + show QR code
npx expo start -c    # Start with cache cleared (after .env changes)
npm run android      # Open on Android emulator (optional; not needed for Expo Go)
npm run ios          # Open on iOS simulator (Mac only; not needed for Expo Go)
```

---

## For developers

### Architecture

- **Auth** (`context/AuthContext.tsx`): signup → OTP verify → login; all via `/auth/*` API routes.
- **Forecasts** (`services/forecast.ts`): `/forecast`, `/forecast/detail`, `/markets` — backed by the SARIMA/SARIMAX API.
- **Weather** (`services/weather.ts`): Open-Meteo (no API key).
- **API client** (`services/api.ts`): base URL from `EXPO_PUBLIC_API_URL`.

### Known gaps before production

- OTP is mocked on the server in dev — needs real SMS + server-side verification for production.
- Alerts tab is UI-only until push/SMS is connected.
- No offline forecast cache yet.

---

## Still stuck?

1. Note the **exact error message** (screenshot helps).
2. Confirm: Node installed, `npm install` done, backend running, `.env` has your LAN IP, same Wi‑Fi, Expo Go installed.
3. Ask the person who shared this repo — they can verify your backend URL and OTP logs.
