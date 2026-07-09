import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Backend base URL.
 *
 * Set EXPO_PUBLIC_API_URL in a `.env` file at the project root (Expo inlines
 * any EXPO_PUBLIC_* var at build time — no extra config needed):
 *
 *   EXPO_PUBLIC_API_URL=http://192.168.1.42:8000
 *
 * Why you can't just use "localhost": when running in Expo Go on a real
 * phone, "localhost" means the phone itself, not your computer. Find your
 * computer's LAN IP with:
 *   - Mac/Linux: `ipconfig getifaddr en0`  (or `hostname -I` on Linux)
 *   - Windows:   `ipconfig` -> look for "IPv4 Address" under your active
 *                Wi-Fi adapter
 * Your phone and computer must be on the same Wi-Fi network. If you're
 * using an Android emulator (not Expo Go), use 10.0.2.2 instead of your
 * LAN IP — that's the emulator's alias for your host machine.
 */
const DEFAULT_DEV_URL = "http://localhost:8000";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_DEV_URL;

const TOKEN_KEY = "gapip_token";

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean; // attach Authorization header
};

/**
 * Thin fetch wrapper: JSON in/out, optional bearer auth, and error messages
 * pulled from FastAPI's {"detail": "..."} shape so screens can show them
 * directly.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new ApiError(
      0,
      `Can't reach the server at ${API_BASE_URL}. Check that the backend is running and ` +
        `EXPO_PUBLIC_API_URL points to your computer's LAN IP, not localhost.`
    );
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // some responses (rare) may not have a JSON body
  }

  if (!response.ok) {
    const message = data?.detail || `Request failed (${response.status}).`;
    throw new ApiError(response.status, message);
  }

  return data as T;
}
