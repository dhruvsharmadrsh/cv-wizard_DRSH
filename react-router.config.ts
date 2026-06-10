import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  // SPA mode — this app is fully client-side (Puter.js handles auth, AI, storage)
  ssr: false,
  presets: [vercelPreset()],
} satisfies Config;
