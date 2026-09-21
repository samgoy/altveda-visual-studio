const PROHIBITED_CLAIMS = [
  /\bcure[s]?\b/i, /\btreat[s]?\b/i, /\bprevent[s]?\b/i, /\bheal[s]?\b/i,
  /\bdiagnos[es]?\b/i, /\bmiraculous?\b/i, /\bguarantee[d]?\b/i,
  /\binstant(ly)?\b/i, /\bimmediately\b/i, /\bmagic(al)?\b/i,
  /\bscientifically proven\b/i, /\bclinically proven\b/i,
  /\bdoctor recommended\b/i, /\bphysician recommended\b/i,
  /\bpharmaceutical\b/i, /\bprescription\b/i,
  /\bno side effects\b/i, /\b100% safe\b/i,
  /\breplace.*medication\b/i, /\binstead of.*medicine\b/i,
];

const SAFE_ALTERNATIVES: Record<string, string> = {
  "cure": "traditionally used for",
  "treat": "support wellness for",
  "prevent": "may help with",
  "heal": "support recovery of",
  "miracle": "natural",
  "guarantee": "may help",
  "scientifically proven": "traditional use supports",
  "clinically proven": "traditional use supports",
  "no side effects": "natural ingredients",
  "100% safe": "generally well-tolerated",
};

interface ClaimCheckResult {
  passed: boolean;
  flags: string[];
  suggestions: string[];
  original: string;
  sanitized: string;
}

export function checkClaims(text: string): ClaimCheckResult {
  const flags: string[] = [];
  let sanitized = text;

  for (const pattern of PROHIBITED_CLAIMS) {
    const matches = text.match(pattern);
    if (matches) {
      flags.push(`Prohibited claim detected: "${matches[0]}"`);
      const safe = SAFE_ALTERNATIVES[matches[0].toLowerCase()] || "may help with";
      sanitized = sanitized.replace(new RegExp(matches[0], "gi"), safe);
    }
  }

  return {
    passed: flags.length === 0,
    flags,
    suggestions: flags.map((f) => {
      const match = f.match(/Prohibited claim detected: "([^"]+)"/);
      if (!match) return f;
      const original = match[1];
      const safe = SAFE_ALTERNATIVES[original.toLowerCase()] || "review manually";
      return `Replace "${original}" with "${safe}"`;
    }),
    original: text,
    sanitized,
  };
}

export function assertSafeScript(script: string): void {
  const result = checkClaims(script);
  if (!result.passed) {
    const err = new Error(`Script contains prohibited claims:\n${result.flags.join("\n")}\n\nSuggested replacements:\n${result.suggestions.join("\n")}`);
    (err as any).claims = result.flags;
    (err as any).suggestions = result.suggestions;
    throw err;
  }
}