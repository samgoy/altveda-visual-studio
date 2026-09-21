import { PLATFORM_SPECS } from "../config/platforms.js";
import fs from "fs";
import path from "path";

interface FormatOutput {
  platform: string;
  width: number;
  height: number;
  outputPath: string;
}

export async function formatForAllPlatforms(inputPath: string, outputDir: string): Promise<FormatOutput[]> {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input video not found: ${inputPath}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const outputs: FormatOutput[] = [];
  const platforms = Object.entries(PLATFORM_SPECS);

  for (const [key, spec] of platforms) {
    const outputPath = path.join(outputDir, `altveda-${key}.mp4`);
    await convertVideo(inputPath, outputPath, spec.width, spec.height, spec.fps);
    outputs.push({ platform: key, width: spec.width, height: spec.height, outputPath });
    console.log(`✅ ${key}: ${spec.width}x${spec.height} @ ${spec.fps}fps`);
  }

  return outputs;
}

async function convertVideo(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number,
  fps: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { execFile } = require("child_process");
    const args = [
      "-y",
      "-i", inputPath,
      "-vf", `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
      "-r", String(fps),
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", "23",
      "-c:a", "aac",
      "-b:a", "192k",
      "-movflags", "+faststart",
      outputPath,
    ];

    execFile("ffmpeg", args, { timeout: 600000 }, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function generateThumbnail(videoPath: string, outputPath: string, timeSec: number = 3): Promise<string> {
  return new Promise((resolve, reject) => {
    const { execFile } = require("child_process");
    execFile("ffmpeg", [
      "-y",
      "-i", videoPath,
      "-ss", String(timeSec),
      "-vframes", "1",
      "-q:v", "2",
      outputPath,
    ], { timeout: 60000 }, (err: Error | null) => {
      if (err) reject(err);
      else resolve(outputPath);
    });
  });
}