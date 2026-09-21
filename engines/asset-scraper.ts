const BRAND_ASSETS = {
  logo: {
    url: "https://altveda.in/logo.png",
    formats: ["png", "svg"],
    description: "AltVeda logo with tagline",
  },
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
};

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Ashwagandha Capsules", description: "Premium Ashwagandha for stress relief and stamina", price: "₹499", images: ["https://altveda.in/images/ashwagandha.jpg"] },
  { id: 2, name: "Amla Capsules", description: "Natural Amla for Vitamin C and immunity", price: "₹399", images: ["https://altveda.in/images/amla.jpg"] },
  { id: 3, name: "Curcumin (Turmeric) Extract", description: "Anti-inflammatory, joint health support", price: "₹549", images: ["https://altveda.in/images/curcumin.jpg"] },
  { id: 4, name: "Moringa Capsules", description: "Nutrition, energy, immunity boost", price: "₹449", images: ["https://altveda.in/images/moringa.jpg"] },
  { id: 5, name: "Shatavari Capsules", description: "Women's wellness, hormonal balance", price: "₹499", images: ["https://altveda.in/images/shatavari.jpg"] },
  { id: 6, name: "Triphala", description: "Digestion, gut health", price: "₹299", images: ["https://altveda.in/images/triphala.jpg"] },
  { id: 7, name: "Brahmi", description: "Memory, cognitive function", price: "₹399", images: ["https://altveda.in/images/brahmi.jpg"] },
  { id: 8, name: "Neem Capsules", description: "Skin, blood purification", price: "₹299", images: ["https://altveda.in/images/neem.jpg"] },
  { id: 9, name: "Giloy", description: "Immunity, fever management", price: "₹349", images: ["https://altveda.in/images/giloy.jpg"] },
  { id: 10, name: "Guduchi + Andrographis", description: "Antiviral, immunity", price: "₹399", images: ["https://altveda.in/images/guduchi.jpg"] },
];

interface BrandAssetResult {
  logo: typeof BRAND_ASSETS.logo;
  products: typeof FALLBACK_PRODUCTS;
  brand: typeof BRAND_ASSETS;
  source: "woocommerce" | "fallback";
}

export async function scrapeBrandAssets(): Promise<BrandAssetResult> {
  const wcUrl = process.env.WOOCOMMERCE_URL || "https://altveda.in";
  const wcKey = process.env.WOOCOMMERCE_KEY || "";
  const wcSecret = process.env.WOOCOMMERCE_SECRET || "";

  if (!wcKey || !wcSecret) {
    console.warn("WooCommerce credentials not set, using fallback product data");
    return { logo: BRAND_ASSETS.logo, products: FALLBACK_PRODUCTS, brand: BRAND_ASSETS, source: "fallback" };
  }

  const auth = Buffer.from(`${wcKey}:${wcSecret}`).toString("base64");

  try {
    const productsRes = await fetch(`${wcUrl}/wp-json/wc/v3/products?per_page=100&status=publish`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (productsRes.ok) {
      const products = await productsRes.json();
      console.log(`   ✅ WooCommerce: ${products.length} products`);
      return { logo: BRAND_ASSETS.logo, products, brand: BRAND_ASSETS, source: "woocommerce" };
    }
  } catch (err) {
    console.warn("WooCommerce API failed, using fallback data");
  }

  // Try Cloudflare Worker API
  try {
    const workerRes = await fetch("https://api.altveda.in/woo-products", {
      headers: { Authorization: `Bearer ${process.env.CF_API_TOKEN || ""}` },
    });
    if (workerRes.ok) {
      const products = await workerRes.json();
      console.log(`   ✅ Cloudflare Worker API: ${products.length} products`);
      return { logo: BRAND_ASSETS.logo, products, brand: BRAND_ASSETS, source: "woocommerce" };
    }
  } catch {
    // Fall through
  }

  console.warn("⚠️  Using fallback product data");
  return { logo: BRAND_ASSETS.logo, products: FALLBACK_PRODUCTS, brand: BRAND_ASSETS, source: "fallback" };
}

export async function getProductImages(productId: number): Promise<string[]> {
  const wcUrl = process.env.WOOCOMMERCE_URL || "https://altveda.in";
  const wcKey = process.env.WOOCOMMERCE_KEY || "";
  const wcSecret = process.env.WOOCOMMERCE_SECRET || "";

  if (!wcKey || !wcSecret) {
    const product = FALLBACK_PRODUCTS.find((p) => p.id === productId);
    return product?.images || [];
  }

  const auth = Buffer.from(`${wcKey}:${wcSecret}`).toString("base64");
  const res = await fetch(`${wcUrl}/wp-json/wc/v3/products/${productId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    const product = FALLBACK_PRODUCTS.find((p) => p.id === productId);
    return product?.images || [];
  }

  const product = await res.json();
  return product.images?.map((img: any) => img.src) || [];
}