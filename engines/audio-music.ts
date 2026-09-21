import fs from "fs";
import path from "path";

interface MusicGenOptions {
  prompt: string;
  duration: number;
  outputPath: string;
  mood?: "calm" | "energetic" | "premium" | "trust" | "inspiring";
  genre?: "ambient" | "meditation" | "corporate" | "emotional";
}

export async function generateBackgroundMusic(opts: MusicGenOptions): Promise<string | undefined> {
  const { prompt, duration, outputPath, mood = "calm", genre = "ambient" } = opts;

  const moodLabels = {
    calm: "peaceful, soft, meditative",
    energetic: "upbeat, dynamic, lively",
    premium: "elegant, luxurious, cinematic",
    trust: "warm, sincere, honest",
    inspiring: "uplifting, hopeful, motivational",
  };

  const fullPrompt = `${moodLabels[mood] || moodLabels.calm}, ${genre} music, no vocals, clean production, ${duration}s`;

  console.log(`🎵 Generating music: ${fullPrompt.slice(0, 80)}...`);

  // MusicGen (Meta)
  const cmd = "python";
  const args = [
    "-m", "musicgen",
    "--prompt", fullPrompt,
    "--duration", String(duration),
    "--output", outputPath,
    "--sample-rate", "44100",
    "--bitrate", "192k",
  ];

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = require("child_process").execFile(cmd, args, { timeout: 600000 }, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (fs.existsSync(outputPath)) {
      console.log(`✅ Music: ${outputPath}`);
      return outputPath;
    }
  } catch (err: any) {
    console.error(`❌ Music generation failed: ${err.message}`);
  }

  return undefined;
}

export async function generateDJSamsiStyleMusic(opts: {
  worldType: string;
  seed: number;
  duration: number;
  outputPath: string;
}): Promise<string | undefined> {
  // Reuse DJSamsi engine for ambient music
  const { execFile } = require("child_process");
  const args = [
    "node", "src/engine/audio-renderer.ts",
    "--world", opts.worldType,
    "--seed", String(opts.seed),
    "--duration", String(opts.duration),
    "--output", opts.outputPath,
  ];

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = execFile("npx", ["tsx", ...args], { timeout: 600000 }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (fs.existsSync(opts.outputPath)) {
      console.log(`✅ DJSamsi music: ${opts.outputPath}`);
      return opts.outputPath;
    }
  } catch (err: any) {
    console.error(`❌ DJSamsi music failed: ${err.message}`);
  }

  return undefined;
}