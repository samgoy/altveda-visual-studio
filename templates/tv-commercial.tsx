import { BRAND } from "../config/brand.js";

interface TvCommercialProps {
  hook: string;
  problem: string;
  solution: string;
  cta: string;
  ctaUrl: string;
  backgroundUrl?: string;
  duration: number;
  version: "15s" | "30s" | "60s";
}

export function createTvCommercial(props: TvCommercialProps) {
  return {
    id: "tv-commercial",
    component: "TvCommercial",
    durationInFrames: props.duration * 24,
    fps: 24,
    width: 1920,
    height: 1080,
    defaultProps: props,
    label: `TV Commercial ${props.version} — ${props.hook.slice(0, 30)}`,
  };
}

export const TvCommercial: React.FC<TvCommercialProps> = ({
  hook,
  problem,
  solution,
  cta,
  ctaUrl,
  backgroundUrl,
  duration,
  version,
}) => {
  const sections = version === "15s" ? [hook, cta] : version === "30s" ? [hook, problem, solution, cta] : [hook, problem, solution, cta];

  return (
    <div style={styles.container}>
      {backgroundUrl && <img src={backgroundUrl} style={styles.background} alt="" />}
      <div style={styles.overlay}>
        {sections.map((text, i) => (
          <div key={i} style={getSectionStyle(i, sections.length)}>
            <h1 style={{ ...styles.sectionTitle, fontFamily: BRAND.fonts.heading }}>{text}</h1>
          </div>
        ))}
        <a href={ctaUrl} style={styles.cta}>
          {cta}
        </a>
      </div>
    </div>
  );
};

function getSectionStyle(index: number, total: number): React.CSSProperties {
  const opacity = 1 - (index * 0.15);
  return {
    marginBottom: "20px",
    opacity: Math.max(opacity, 0.5),
  };
}

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
    opacity: 0.55,
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "80px",
  },
  sectionTitle: {
    fontSize: "48px",
    color: BRAND.colors.gold,
    marginBottom: "16px",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  cta: {
    display: "inline-block",
    padding: "16px 48px",
    backgroundColor: BRAND.colors.terracotta,
    color: BRAND.colors.cream,
    fontSize: "26px",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontFamily: BRAND.fonts.body,
    marginTop: "20px",
  },
};