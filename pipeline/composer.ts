import { checkClaims } from "../engines/claim-checker.js";
import { scrapeBrandAssets } from "../engines/asset-scraper.js";
import { generateVideoPrompt, generateScript } from "../intelligence/prompt-engine.js";
import { segmentScript } from "../intelligence/scene-segmenter.js";
import { selectModel } from "../intelligence/model-selector.js";
import { generateAIVideo } from "../engines/ai-video-gen.js";
import { DEFAULT_PIPELINE_CONFIG, validateConfig } from "../pipeline/config.js";
import { BRAND } from "../config/brand.js";

interface PipelineOptions {
  type: "founder" | "product" | "educational" | "testimonial" | "promo";
  subject: string;
  description?: string;
  mood?: "calm" | "energetic" | "premium" | "trust" | "inspiring";
  style?: "cinematic" | "lifestyle" | "studio" | "natural";
  duration?: number;
  productId?: number;
}

export async function runPipeline(opts: PipelineOptions): Promise<{ success: boolean; videoPath?: string; errors: string[] }> {
  const errors: string[] = [];

  // 1. Validate config
  console.log("🔧 Validating config...");
  const configCheck = await validateConfig();
  if (!configCheck.valid) {
    errors.push(`Missing env vars: ${configCheck.missing.join(", ")}`);
    console.warn(`⚠️  Missing: ${configCheck.missing.join(", ")}`);
  }

  // 2. Scrape assets
  console.log("📦 Scraping brand assets...");
  const assets = await scrapeBrandAssets();

  // 3. Generate script
  console.log("✍️  Generating script...");
  const script = generateScript({
    type: opts.type,
    subject: opts.subject,
    description: opts.description || "",
    mood: opts.mood || "calm",
    style: opts.style || "cinematic",
    duration: opts.duration,
  });

  // 4. Claim check
  console.log("🔍 Checking claims...");
  const claimResult = checkClaims(script);
  if (!claimResult.passed) {
    console.warn(`⚠️  Claims flagged: ${claimResult.flags.join(", ")}`);
    errors.push(...claimResult.flags);
  }

  // 5. Segment
  console.log("🎬 Segmenting...");
  const scenes = segmentScript(claimResult.sanitized);

  // 6. Select model
  const model = selectModel({ type: opts.type, subject: opts.subject, description: opts.description || "", mood: opts.mood || "calm", style: opts.style || "cinematic" });

  // 7. Generate AI clips (one per scene)
  console.log(`🤖 Generating ${scenes.length} AI clips with ${model}...`);
  const clipPaths: string[] = [];

  for (const scene of scenes) {
    const prompt = generateVideoPrompt({
      type: opts.type,
      subject: scene.visual,
      description: opts.description || "",
      mood: opts.mood || "calm",
      style: opts.style || "cinematic",
    });

    const clipPath = await generateAIVideo({
      prompt,
      model: model as any,
      duration: scene.duration,
      outputPath: `output/clip-${scene.id}.mp4`,
    });

    if (clipPath) clipPaths.push(clipPath);
    else errors.push(`Failed to generate clip ${scene.id}`);
  }

  // 8. Remotion compose (placeholder — would use @remotion/renderer)
  console.log("🎥 Composing with Remotion...");
  // composeClips(clipPaths, scenes);

  return {
    success: errors.length === 0,
    videoPath: clipPaths.length > 0 ? clipPaths[clipPaths.length - 1] : undefined,
    errors,
  };
}