import { ImageResponse } from "next/og";
import { getProjectById } from "@/data/projects";
import {
  getOgAssets,
  OG_SIZE,
  OG_CONTENT_TYPE,
  fitDisplaySize,
  withAlpha,
  ogClamp,
} from "@/lib/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Adrien Thevon - Project";

const BG = SITE.colors.background;
const FG = SITE.colors.foreground;
const MUTED = SITE.colors.muted;
const PADDING = 68;

/** Un alt descriptif par projet, plutôt qu'un "Project Details" générique */
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectById(slug);

  return [
    {
      id: "og",
      alt: project
        ? `${project.title} - ${project.category} (${project.year}) par Adrien Thevon`
        : alt,
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectById(slug);
  const { fonts, logo } = await getOgAssets();

  const accent = project?.color ?? SITE.colors.accent;
  const title = project?.title ?? "ADRIEN THEVON";
  const category = project?.category ?? "PORTFOLIO";
  const year = project?.year ?? String(new Date().getFullYear());
  const description = ogClamp(
    project?.description ?? "Développeur créatif basé à Toulouse.",
    108
  );
  const tags = (project?.tags ?? []).slice(0, 3).join(" · ");

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

        {/* Halo teinté par la couleur du projet */}
        <div
          style={{
            position: "absolute",
            bottom: -300,
            right: -200,
            width: 820,
            height: 820,
            display: "flex",
            borderRadius: 820,
            backgroundImage: `radial-gradient(circle, ${withAlpha(accent, 0.28)} 0%, ${withAlpha(accent, 0)} 68%)`,
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
            backgroundColor: accent,
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
            <img src={logo} width={52} height={52} alt="" />
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: FG,
              }}
            >
              ATHEVON.DEV / WORK
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
            {year}
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
              style={{
                display: "flex",
                width: 14,
                height: 14,
                backgroundColor: accent,
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: accent,
              }}
            >
              {category}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Dela Gothic One",
              fontSize: fitDisplaySize(title),
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              color: FG,
              maxWidth: 1064,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              width: 104,
              height: 6,
              backgroundColor: accent,
              marginTop: 32,
              marginBottom: 24,
            }}
          />

          <div
            style={{
              display: "flex",
              fontSize: 24,
              lineHeight: 1.42,
              color: MUTED,
              maxWidth: 860,
            }}
          >
            {description}
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
            fontSize: 19,
            letterSpacing: "0.2em",
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>{tags}</div>
          <div style={{ display: "flex", color: withAlpha(FG, 0.75) }}>
            ADRIEN THEVON
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
