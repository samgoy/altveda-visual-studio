import fs from "fs";
import path from "path";

interface VoiceGenOptions {
  text: string;
  voice?: string;
  language?: "en" | "hi";
  outputPath: string;
  speed?: number;
}

export async function generateVoice(opts: VoiceGenOptions): Promise<string | undefined> {
  const { text, voice = "sangam", language = "en", outputPath, speed = 1.0 } = opts;

  console.log(`🎙️  Generating voice: ${language}, ${voice}`);

  // XTTS v2 for multilingual (Hindi + English)
  const cmd = "python";
  const args = [
    "-m", "torchtalk",
    "--text", text,
    "--language", language,
    "--output", outputPath,
    "--speed", String(speed),
  ];

  // Fallback to edge-tts if XTTS not available
  const fallbackArgs = [
    "-m", "edge_tts",
    "--text", text,
    "--voice", language === "hi" ? "hi-IN-SwaraNeural" : "en-IN-PrabhatNeural",
    "--write-media", outputPath,
  ];

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = require("child_process").execFile(cmd, args, { timeout: 300000 }, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
      proc.stdout?.on("data", (d: Buffer) => process.stdout.write(d));
      proc.stderr?.on("data", (d: Buffer) => process.stderr.write(d));
    });

    if (fs.existsSync(outputPath)) {
      console.log(`✅ Voice: ${outputPath}`);
      return outputPath;
    }
  } catch {
    console.warn("⚠️  XTTS not available, trying edge-tts fallback...");
    try {
      await new Promise<void>((resolve, reject) => {
        const proc = require("child_process").execFile(cmd, fallbackArgs, { timeout: 300000 }, (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        });
      });
      if (fs.existsSync(outputPath)) {
        console.log(`✅ Voice (fallback): ${outputPath}`);
        return outputPath;
      }
    } catch (e) {
      console.error("❌ Voice generation failed");
    }
  }

  return undefined;
}

export async function cloneVoice(audioSamples: string[], outputModel: string): Promise<boolean> {
  console.log("🎭 Cloning voice from samples...");
  // OpenVoice or XTTS voice cloning
  // Requires 3-10 min of audio samples
  return false; // Placeholder — implement when samples available
}