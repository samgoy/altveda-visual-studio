export const BRAND = {
  name: "AltVeda",
  tagline: "Nature's Wisdom",
  colors: {
    sageGreen: "#7C9A7E",
    gold: "#C9A962",
    terracotta: "#C67B5C",
    cream: "#FAF7F2",
    dark: "#1A1A2E",
    light: "#F5F0E8",
  },
  fonts: {
    heading: "Lora",
    body: "Inter",
  },
  tone: "Warm, knowledgeable, honest. Not clinical. Not hippie. Premium wellness editorial.",
  website: "https://altveda.in",
  email: "care@altveda.in",
  categories: ["Capsule supplements", "Herbal powders", "Ayurvedic soaps"],
  priceRange: { min: 99, max: 799 },
  aov: 494,
} as const;

export const PRODUCT_CATEGORIES = {
  supplements: ["Ashwagandha", "Amla", "Curcumin", "Moringa", "Shatavari", "Triphala", "Brahmi", "Neem", "Giloy", "Guduchi", "Andrographis"],
  powders: ["Turmeric", "Ashwagandha", "Amla", "Neem", "Shilajit"],
  soaps: ["Neem", "Turmeric", "Sandalwood", "Rose", "Kumkumadi", "Detox"],
} as const;

export const PLATFORMS = {
  youtube: { width: 1920, height: 1080, fps: 24, codec: "h264" },
  instagram: { width: 1080, height: 1080, fps: 30, codec: "h264" },
  instagramReel: { width: 1080, height: 1920, fps: 30, codec: "h264" },
  linkedin: { width: 1920, height: 1080, fps: 24, codec: "h264" },
  youtubeShort: { width: 1080, height: 1920, fps: 30, codec: "h264" },
  amazon: { width: 1920, height: 1080, fps: 24, codec: "h264" },
} as const;