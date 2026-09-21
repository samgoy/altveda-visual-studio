import { makeSceneComposition, Composition } from "remotion";
import { BRAND } from "../config/brand.js";

interface FounderVideoProps {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaUrl: string;
  backgroundUrl?: string;
  duration: number;
}

export function createFounderStory(props: FounderVideoProps): Composition {
  return {
    id: "founder-story",
    component: "FounderStory",
    durationInFrames: props.duration * 24,
    fps: 24,
    width: 1920,
    height: 1080,
    defaultProps: props,
    label: `Founder Story — ${props.title}`,
  };
}

export const FounderStory: React.FC<FounderVideoProps> = ({
  title,
  subtitle,
  description,
  cta,
  ctaUrl,
  backgroundUrl,
  duration,
}) => {
  return (
    <div style={styles.container}>
      {backgroundUrl && <img src={backgroundUrl} style={styles.background} alt="" />}
      <div style={styles.overlay}>
        <h1 style={{ ...styles.title, fontFamily: BRAND.fonts.heading }}>{title}</h1>
        <h2 style={{ ...styles.subtitle, fontFamily: BRAND.fonts.body }}>{subtitle}</h2>
        <p style={{ ...styles.description, fontFamily: BRAND.fonts.body }}>{description}</p>
        <a href={ctaUrl} style={styles.cta}>
          {cta}
        </a>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BRAND.colors.dark,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.6,
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "60px",
    maxWidth: "1200px",
  },
  title: {
    fontSize: "72px",
    color: BRAND.colors.gold,
    marginBottom: "20px",
    fontWeight: 600,
  },
  subtitle: {
    fontSize: "36px",
    color: BRAND.colors.cream,
    marginBottom: "30px",
    fontWeight: 400,
  },
  description: {
    fontSize: "24px",
    color: BRAND.colors.light,
    marginBottom: "40px",
    lineHeight: 1.6,
  },
  cta: {
    display: "inline-block",
    padding: "16px 48px",
    backgroundColor: BRAND.colors.terracotta,
    color: BRAND.colors.cream,
    fontSize: "24px",
    fontFamily: BRAND.fonts.body,
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: 600,
  },
};