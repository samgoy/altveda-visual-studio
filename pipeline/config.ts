import { BRAND } from "../config/brand.js";

interface PipelineConfig {
  wooCommerce: {
    url: string;
    key: string;
    secret: string;
  };
  gemini: {
    apiKey: string;
    model: "gemini-2.5-flash" | "gemini-2.5-pro";
  };
  kaggle: {
    gpu: "t4" | "a100" | "p100";
    maxHours: number;
  };
  github: {
    actionsMinutes: number;
  };
  cloudflare: {
    accountId: string;
    apiToken: string;
  };
  output: {
    directory: string;
    formats: string[];
  };
}

export const DEFAULT_PIPELINE_CONFIG: PipelineConfig = {
  wooCommerce: {
    url: process.env.WOOCOMMERCE_URL || "https://altveda.in",
    key: process.env.WOOCOMMERCE_KEY || "",
    secret: process.env.WOOCOMMERCE_SECRET || "",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: "gemini-2.5-flash",
  },
  kaggle: {
    gpu: "t4",
    maxHours: 12,
  },
  github: {
    actionsMinutes: 2000,
  },
  cloudflare: {
    accountId: process.env.CF_ACCOUNT_ID || "",
    apiToken: process.env.CF_API_TOKEN || "",
  },
  output: {
    directory: "./output",
    formats: ["mp4", "webm"],
  },
};

export async function validateConfig(): Promise<{ valid: boolean; missing: string[] }> {
  const missing: string[] = [];

  if (!DEFAULT_PIPELINE_CONFIG.wooCommerce.key) missing.push("WOOCOMMERCE_KEY");
  if (!DEFAULT_PIPELINE_CONFIG.wooCommerce.secret) missing.push("WOOCOMMERCE_SECRET");
  if (!DEFAULT_PIPELINE_CONFIG.gemini.apiKey) missing.push("GEMINI_API_KEY");
  if (!DEFAULT_PIPELINE_CONFIG.cloudflare.accountId) missing.push("CF_ACCOUNT_ID");
  if (!DEFAULT_PIPELINE_CONFIG.cloudflare.apiToken) missing.push("CF_API_TOKEN");

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getConfig(): PipelineConfig {
  return DEFAULT_PIPELINE_CONFIG;
}