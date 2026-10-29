import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const alt = "Polyris — Data pipeline orchestration for AWS"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BRAND = "#6088f0"
const BG = "#0f1117"
const TEXT = "#f1f5f9"
const MUTED = "#64748b"
const DIVIDER = "#2e3350"
const DOMAIN = "#334155"
const BRAND_GLOW = "rgba(68, 114, 224, 0.15)"

// Satori (ImageResponse renderer) requires display:"flex" on every element.
// marginTop:-250 with top:"50%" centers the glow because Satori has no transform support.
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: BG,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px 80px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: -100,
          width: 700,
          height: 500,
          marginTop: -250,
          background: `radial-gradient(ellipse, ${BRAND_GLOW} 0%, transparent 70%)`,
          display: "flex",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${BRAND} 0%, rgba(96, 136, 240, 0.33) 55%, transparent 100%)`,
          display: "flex",
        }}
      />

      <div
        style={{
          fontSize: 76,
          fontWeight: 800,
          color: TEXT,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          maxWidth: 960,
          display: "flex",
        }}
      >
        AWS data pipelines without an always-on orchestrator.
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginTop: 40,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: BRAND,
            letterSpacing: "-0.01em",
            display: "flex",
          }}
        >
          Polyris
        </div>
        <div style={{ width: 1, height: 24, background: DIVIDER, display: "flex" }} />
        <div style={{ fontSize: 20, color: MUTED, display: "flex" }}>
          Open source · AWS Step Functions · Python 3.11+
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 80,
          fontSize: 18,
          color: DOMAIN,
          display: "flex",
        }}
      >
        polyris.dev
      </div>
    </div>,
    { ...size },
  )
}
