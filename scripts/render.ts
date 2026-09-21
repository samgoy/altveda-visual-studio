#!/usr/bin/env node
// AltVeda Visual Studio — Main CLI
// Usage: tsx scripts/render.ts --template founder-story --duration 60

import "dotenv/config";
import { parseArgs } from "node:util";
import { checkClaims, assertSafeScript } from "../engines/claim-checker";
import { scrapeBrandAssets } from "../engines/asset-scraper";
import { generateVideoPrompt, generateScript } from "../intelligence/prompt-engine";
import { segmentScript } from "../intelligence/scene-segmenter";
import { selectModel } from "../intelligence/model-selector";

const args = parseArgs({
  options: {
    template: { type: "string", default: "product-showcase" },
    duration: { type: "string", default: "30" },
    "product-id": { type: "string", default: "" },
    script: { type: "string", default: "" },
  },
});

const template = args.values.template as string;
const duration = parseInt(args.values.duration as string, 10);

async function main() {
  console.log(`🎬 AltVeda Visual Studio — ${template}`);

  // 1. Scrape brand assets
  console.log("📦 Scraping brand assets...");
  const assets = await scrapeBrandAssets();
  console.log(`   ${assets.products.length} products found`);

  // 2. Generate script (or use provided)
  let script = args.values.script as string;
  if (!script) {
    console.log("✍️  Generating script...");
    const prompt = generateScript({ type: template as any, subject: "AltVeda Product", description: "", mood: "calm", style: "cinematic", duration });
    script = prompt;
    console.log(`   ${script.slice(0, 80)}...`);
  }

  // 3. Claim check (legal compliance)
  console.log("🔍 Checking claims...");
  try {
    assertSafeScript(script);
    console.log("   ✅ All claims cleared");
  } catch (err: any) {
    console.log(`   ⚠️  Flags: ${err.claims?.join(", ") || "unknown"}`);
    console.log(`   💡 Suggestions: ${err.suggestions?.join(", ") || "review manually"}`);
    console.log("   Using sanitized version...");
    const result = checkClaims(script);
    script = result.sanitized;
  }

  // 4. Segment into scenes
  console.log("🎬 Segmenting into scenes...");
  const scenes = segmentScript(script);
  console.log(`   ${scenes.length} scenes generated`);

  // 5. Select AI model
  console.log("🤖 Selecting AI model...");
  const model = selectModel({ type: template as any, subject: "", description: "", mood: "calm", style: "cinematic" });
  console.log(`   Model: ${model}`);

  // 6. Render via Remotion
  console.log("🎥 Rendering...");
  const composition = {
    id: template,
    width: 1920,
    height: 1080,
    fps: 24,
    durationInFrames: duration * 24,
    label: `AltVeda — ${template}`,
  };
  await renderComposition(composition);

  console.log("✅ Render complete!");
}

async function renderComposition(comp: any) {
  console.log(`   Rendering ${comp.id} (${comp.durationInFrames} frames)...`);
  // Remotion rendering would go here
  // For now, log the composition config
  console.log(`   Config: ${comp.width}x${comp.height}, ${comp.fps}fps, ${comp.durationInFrames} frames`);
}

main().catch(console.error);