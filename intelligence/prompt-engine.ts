import { BRAND } from "../config/brand.js";

interface PromptInput {
  type: "founder" | "product" | "educational" | "testimonial" | "promo";
  subject: string;
  description: string;
  mood: "calm" | "energetic" | "premium" | "trust" | "inspiring";
  style: "cinematic" | "lifestyle" | "studio" | "natural";
  duration?: number;
}

const MOOD_PROMPTS: Record<string, string> = {
  calm: "serene, peaceful, soft lighting, warm tones, meditative atmosphere",
  energetic: "dynamic, vibrant, bright lighting, active movement, fresh energy",
  premium: "luxurious, high-end, cinematic lighting, shallow depth of field, elegant",
  trust: "honest, warm, natural light, authentic, grounded, sincere",
  inspiring: "uplifting, golden hour, expansive, hopeful, bright, motivational",
};

const STYLE_PROMPTS: Record<string, string> = {
  cinematic: "cinematic film look, widescreen, professional color grading, anamorphic",
  lifestyle: "real-life settings, natural environments, authentic moments, candid",
  studio: "clean studio background, professional lighting, product-focused, minimal",
  natural: "outdoor natural light, green surroundings, herbal ingredients, earthy",
};

export function generateVideoPrompt(input: PromptInput): string {
  const mood = MOOD_PROMPTS[input.mood] || MOOD_PROMPTS.calm;
  const style = STYLE_PROMPTS[input.style] || STYLE_PROMPTS.cinematic;

  const typePrompts: Record<string, string> = {
    founder: `Portrait of a calm, confident Indian entrepreneur speaking directly to camera, ${mood}, ${style}, warm lighting, professional background with plants and natural elements, 4K`,
    product: `Product showcase of ${input.subject}, ${input.description}, ${mood}, ${style}, clean studio or natural setting, herbal ingredients visible, warm golden lighting, professional product photography, 4K`,
    educational: `Educational visual about ${input.subject}, ${mood}, ${style}, animated infographics style, natural ingredients, warm earthy tones, informative and engaging, 4K`,
    testimonial: `Happy customer reviewing ${input.subject}, ${mood}, ${style}, authentic setting, warm lighting, genuine expression, natural background, 4K`,
    promo: `Promotional video for ${input.subject}, ${input.description}, ${mood}, ${style}, dynamic cuts, product highlights, call-to-action elements, vibrant yet premium feel, 4K`,
  };

  return typePrompts[input.type] || typePrompts.product;
}

export function generateScript(input: PromptInput): string {
  const templates: Record<string, (i: PromptInput) => string> = {
    founder: (i) => `Opening: "${i.subject}" — a brief personal introduction. The story: why this brand exists. The challenge: what problem was solved. The solution: the vision. The call-to-action: invite the audience to join the journey. Tone: warm, honest, inspiring. Duration: ${i.duration || 60}s.`,
    product: (i) => `Opening hook: attention-grabbing benefit. Product介绍: name, key ingredients, traditional use. How to use: simple instructions. Social proof: reviews or ratings. Call-to-action: shop now or learn more. Tone: informative, trustworthy. Duration: ${i.duration || 30}s.`,
    educational: (i) => `Hook: surprising fact or myth-busting question. Body: explain the ingredient or practice. Benefit: what it does for wellness. Closing: call-to-learn-more. Tone: knowledgeable, accessible. Duration: ${i.duration || 45}s.`,
    testimonial: (i) => `Opening: customer's story or result. Middle: specific benefit experienced. Closing: recommendation and trust signal. Tone: authentic, relatable. Duration: ${i.duration || 30}s.`,
    promo: (i) => `Hook: limited-time offer or new launch. Body: what's included, key benefits, urgency. CTA: shop now, link in description. Tone: exciting, premium. Duration: ${i.duration || 30}s.`,
  };

  return templates[input.type]?.(input) || templates.product(input);
}