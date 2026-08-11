import { ImageResponse } from "next/og";
import { getOgAssets, OG_SIZE, OG_CONTENT_TYPE, withAlpha } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = "Adrien Thevon - Creative Developer, Toulouse";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const ACCENT = SITE.colors.accent;
const BG = SITE.colors.background;
const FG = SITE.colors.foreground;
const MUTED = SITE.colors.muted;

const PADDING = 68;

export default async function Image() {
  const { fonts, logo } = await getOgAssets();
  const year = new Date().getFullYear();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BG,
          position: "relative",
          fontFamily: "Space Mono",
        }}
      >
        {/* Grille de fond */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `linear-gradient(${withAlpha(FG, 0.035)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(FG, 0.035)} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Halo accent */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -180,
            width: 760,
            height: 760,
            display: "flex",
            borderRadius: 760,
            backgroundImage: `radial-gradient(circle, ${withAlpha(ACCENT, 0.22)} 0%, ${withAlpha(ACCENT, 0)} 68%)`,
          }}
        />

        {/* Barre accent bord gauche */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 10,
            display: "flex",
            backgroundColor: ACCENT,
          }}
        />

        {/* ---------- Barre haute ---------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${PADDING - 16}px ${PADDING}px 26px ${PADDING}px`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img src={logo} width={58} height={58} alt="" />
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: FG,
              }}
            >
              ATHEVON.DEV
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.26em",
              color: MUTED,
            }}
          >
            {`PORTFOLIO / ${year}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 1,
            marginLeft: PADDING,
            marginRight: PADDING,
            backgroundColor: withAlpha(FG, 0.14),
          }}
        />

        {/* ---------- Bloc central ---------- */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: `0 ${PADDING}px`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 22,
            }}
          >
            <div
              style={{ display: "flex", width: 14, height: 14, backgroundColor: ACCENT }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: ACCENT,
              }}
            >
              CREATIVE DEVELOPER
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Dela Gothic One",
              fontSize: 112,
              lineHeight: 0.94,
              letterSpacing: "-0.02em",
            }}
          >
            <div style={{ display: "flex", color: FG }}>ADRIEN</div>
            <div style={{ display: "flex", color: ACCENT }}>THEVON</div>
          </div>

          <div
            style={{
              display: "flex",
              width: 104,
              height: 6,
              backgroundColor: ACCENT,
              marginTop: 30,
              marginBottom: 24,
            }}
          />

          {/* whiteSpace: nowrap -> la tagline doit tenir sur une ligne,
              sinon le bloc central déborde sur la barre du bas */}
          <div
            style={{
              display: "flex",
              fontSize: 23,
              lineHeight: 1.4,
              color: MUTED,
              whiteSpace: "nowrap",
            }}
          >
            Web, CLI and native. Interfaces built to move.
          </div>
        </div>

        {/* ---------- Barre basse ---------- */}
        <div
          style={{
            display: "flex",
            height: 1,
            marginLeft: PADDING,
            marginRight: PADDING,
            backgroundColor: withAlpha(FG, 0.14),
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `26px ${PADDING}px ${PADDING - 16}px ${PADDING}px`,
            fontSize: 20,
            letterSpacing: "0.22em",
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>TOULOUSE, FR</div>
          <div style={{ display: "flex" }}>
            REACT · THREE.JS · WEBGL · MOTION
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
