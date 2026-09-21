export interface Scene {
  id: number;
  start: number;
  end: number;
  duration: number;
  visual: string;
  audio: string;
  text?: string;
  transition: "cut" | "fade" | "crossfade" | "zoom";
}

export function segmentScript(script: string): Scene[] {
  const sentences = script.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const durationPerSentence = 5;
  const scenes: Scene[] = [];

  sentences.forEach((sentence, i) => {
    const trimmed = sentence.trim();
    const mood = detectMood(trimmed);
    const transition = i === 0 ? "cut" : i === sentences.length - 1 ? "fade" : "crossfade";

    scenes.push({
      id: i + 1,
      start: i * durationPerSentence,
      end: (i + 1) * durationPerSentence,
      duration: durationPerSentence,
      visual: trimmed,
      audio: mood === "calm" ? "soft" : "energetic",
      text: trimmed.length > 50 ? trimmed.slice(0, 50) + "..." : trimmed,
      transition,
    });
  });

  return scenes;
}

function detectMood(text: string): "calm" | "energetic" | "premium" | "trust" | "inspiring" {
  const lower = text.toLowerCase();
  if (/calm|peace|serene|meditative|gentle|soft/.test(lower)) return "calm";
  if (/energy|vibrant|dynamic|power|strong|bold/.test(lower)) return "energetic";
  if (/luxury|premium|elegant|sophisticated|premium/.test(lower)) return "premium";
  if (/trust|honest|authentic|sincere|real|genuine/.test(lower)) return "trust";
  if (/inspire|uplift|motivate|hope|dream|future/.test(lower)) return "inspiring";
  return "calm";
}