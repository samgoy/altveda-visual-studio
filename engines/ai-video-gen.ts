import { execFile } from "child_process";
import fs from "fs";
import path from "path";

interface AIVideoGenOptions {
  prompt: string;
  model: "cogvideox2b" | "mochi1" | "ltx-video" | "animate-diff";
  duration: number;
  outputPath: string;
  gpu?: boolean;
}

export async function generateAIVideo(opts: AIVideoGenOptions): Promise<string | undefined> {
  const { prompt, model, duration, outputPath, gpu = true } = opts;

  console.log(`🤖 Generating video with ${model}...`);
  console.log(`   Prompt: ${prompt.slice(0, 100)}...`);
  console.log(`   Duration: ${duration}s`);

  const modelCommands: Record<string, string[]> = {
    cogvideox2b: [
      "python", "-m", "cogvideox",
      "--prompt", prompt,
      "--num-frames", String(duration * 24),
      "--fps", "24",
      "--output", outputPath,
    ],
    mochi1: [
      "python", "-m", "mochi",
      "--prompt", prompt,
      "--frames", String(duration * 24),
      "--output", outputPath,
    ],
    "ltx-video": [
      "python", "-m", "ltx",
      "--prompt", prompt,
      "--duration", String(duration),
      "--output", outputPath,
    ],
    "animate-diff": [
      "python", "-m", "animate_diff",
      "--prompt", prompt,
      "--output", outputPath,
      "--frames", String(duration * 24),
    ],
  };

  const cmd = modelCommands[model];
  if (!cmd) {
    console.error(`Unknown model: ${model}`);
    return undefined;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = execFile(cmd[0], cmd.slice(1), { timeout: 3600000 }, (err) => {
        if (err) reject(err);
        else resolve();
      });
      proc.stdout?.on("data", (d) => process.stdout.write(d));
      proc.stderr?.on("data", (d) => process.stderr.write(d));
    });

    if (fs.existsSync(outputPath)) {
      const sizeMB = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(1);
      console.log(`✅ Generated: ${outputPath} (${sizeMB}MB)`);
      return outputPath;
    }
  } catch (err: any) {
    console.error(`❌ Generation failed: ${err.message}`);
  }

  return undefined;
}

export async function generateImageToVideo(opts: {
  imagePath: string;
  prompt: string;
  model: "stable-video-diffusion" | "cogvideox-img";
  outputPath: string;
}): Promise<string | undefined> {
  const { imagePath, prompt, model, outputPath } = opts;

  if (!fs.existsSync(imagePath)) {
    console.error(`Image not found: ${imagePath}`);
    return undefined;
  }

  console.log(`🎨 Image-to-video with ${model}...`);

  const cmd = model === "stable-video-diffusion"
    ? ["python", "-m", "svd", "--image", imagePath, "--prompt", prompt, "--output", outputPath]
    : ["python", "-m", "cogvideox", "--image", imagePath, "--prompt", prompt, "--output", outputPath];

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = execFile(cmd[0], cmd.slice(1), { timeout: 1800000 }, (err) => {
        if (err) reject(err);
        else resolve();
      });
      proc.stdout?.on("data", (d) => process.stdout.write(d));
      proc.stderr?.on("data", (d) => process.stderr.write(d));
    });

    if (fs.existsSync(outputPath)) {
      console.log(`✅ Image-to-video: ${outputPath}`);
      return outputPath;
    }
  } catch (err: any) {
    console.error(`❌ Image-to-video failed: ${err.message}`);
  }

  return undefined;
}