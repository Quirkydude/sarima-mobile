// Metro inlines EXPO_PUBLIC_* environment variables at build time (see
// services/api.ts). This is NOT a real Node.js process — React Native has
// no Node runtime — so we declare just the shimmed shape we actually use
// instead of installing @types/node, which would imply full Node API
// availability that doesn't exist here.
declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
    [key: string]: string | undefined;
  };
};
