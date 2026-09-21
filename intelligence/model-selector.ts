import type { PromptInput } from "./prompt-engine.js";

export type ModelName = "cogvideox2b" | "mochi1" | "ltx-video" | "animate-diff";

interface ModelSpec {
  name: ModelName;
  minVram: number;
  quality: number;
  speed: number;
  bestFor: string[];
}

const MODELS: ModelSpec[] = [
  { name: "cogvideox2b", minVram: 16, quality: 9, speed: 5, bestFor: ["product", "educational", "founder"] },
  { name: "mochi1", minVram: 12, quality: 7, speed: 8, bestFor: ["social-short", "testimonial", "promo"] },
  { name: "ltx-video", minVram: 8, quality: 6, speed: 9, bestFor: ["social-short", "quick-clips"] },
  { name: "animate-diff", minVram: 8, quality: 5, speed: 10, bestFor: ["backgrounds", "b-roll"] },
];

export function selectModel(input: PromptInput): ModelName {
  const availableVram = getAvailableVram();
  const candidates = MODELS.filter((m) => m.minVram <= availableVram);

  if (candidates.length === 0) return "mochi1";

  const scored = candidates.map((m) => {
    const qualityMatch = m.bestFor.includes(input.type) ? 2 : 1;
    const moodMatch = input.mood === "calm" && m.name === "cogvideox2b" ? 1.5 : 1;
    return { ...m, score: m.quality * qualityMatch * moodMatch / m.speed };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].name;
}

function getAvailableVram(): number {
  const vram = process.env.KAGGLE_GPU_VRAM || process.env.COLAB_GPU_VRAM;
  return vram ? parseFloat(vram) : 16;
}

export function getModelSpecs(): ModelSpec[] {
  return MODELS;
}