import { BRAND } from "../config/brand.js";

interface ProductVideoProps {
  productName: string;
  productDescription: string;
  price: string;
  imageUrl: string;
  cta: string;
  ctaUrl: string;
  duration: number;
}

export function createProductShowcase(props: ProductVideoProps) {
  return {
    id: "product-showcase",
    component: "ProductShowcase",
    durationInFrames: props.duration * 24,
    fps: 24,
    width: 1920,
    height: 1080,
    defaultProps: props,
    label: `Product — ${props.productName}`,
  };
}

export const ProductShowcase: React.FC<ProductVideoProps> = ({
  productName,
  productDescription,
  price,
  imageUrl,
  cta,
  ctaUrl,
  duration,
}) => {
  return (
    <div style={styles.container}>
      <img src={imageUrl} style={styles.productImage} alt={productName} />
      <div style={styles.overlay}>
        <h1 style={{ ...styles.productName, fontFamily: BRAND.fonts.heading }}>{productName}</h1>
        <p style={{ ...styles.description, fontFamily: BRAND.fonts.body }}>{productDescription}</p>
        <div style={styles.priceRow}>
          <span style={styles.price}>{price}</span>
          <a href={ctaUrl} style={styles.cta}>
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: BRAND.colors.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.7,
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "60px",
  },
  productName: {
    fontSize: "56px",
    color: BRAND.colors.gold,
    marginBottom: "16px",
    fontWeight: 600,
  },
  description: {
    fontSize: "24px",
    color: BRAND.colors.cream,
    marginBottom: "24px",
    lineHeight: 1.6,
    maxWidth: "800px",
    margin: "0 auto 24px",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
  },
  price: {
    fontSize: "36px",
    color: BRAND.colors.gold,
    fontWeight: 700,
    fontFamily: BRAND.fonts.heading,
  },
  cta: {
    display: "inline-block",
    padding: "12px 36px",
    backgroundColor: BRAND.colors.terracotta,
    color: BRAND.colors.cream,
    fontSize: "22px",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontFamily: BRAND.fonts.body,
  },
};