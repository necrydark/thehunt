import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://thehunt-virid.vercel.app/"
    : "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [adminClient()],
});
