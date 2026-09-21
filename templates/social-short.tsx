import { BRAND } from "../config/brand.js";

interface SocialShortProps {
  hook: string;
  body: string;
  cta: string;
  ctaUrl: string;
  imageUrl?: string;
  duration: number;
}

export function createSocialShort(props: SocialShortProps) {
  return {
    id: "social-short",
    component: "SocialShort",
    durationInFrames: props.duration * 30,
    fps: 30,
    width: 1080,
    height: 1920,
    defaultProps: props,
    label: `Social Short — ${props.hook.slice(0, 30)}`,
  };
}

export const SocialShort: React.FC<SocialShortProps> = ({
  hook,
  body,
  cta,
  ctaUrl,
  imageUrl,
  duration,
}) => {
  return (
    <div style={styles.container}>
      {imageUrl && <img src={imageUrl} style={styles.background} alt="" />}
      <div style={styles.overlay}>
        <h1 style={{ ...styles.hook, fontFamily: BRAND.fonts.heading }}>{hook}</h1>
        <p style={{ ...styles.body, fontFamily: BRAND.fonts.body }}>{body}</p>
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
    opacity: 0.5,
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "80px 40px",
  },
  hook: {
    fontSize: "48px",
    color: BRAND.colors.gold,
    marginBottom: "24px",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  body: {
    fontSize: "28px",
    color: BRAND.colors.cream,
    marginBottom: "32px",
    lineHeight: 1.5,
    fontFamily: BRAND.fonts.body,
  },
  cta: {
    display: "inline-block",
    padding: "14px 40px",
    backgroundColor: BRAND.colors.terracotta,
    color: BRAND.colors.cream,
    fontSize: "22px",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontFamily: BRAND.fonts.body,
  },
};