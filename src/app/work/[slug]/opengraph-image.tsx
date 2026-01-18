import { ImageResponse } from "next/og";
import { getProjectById } from "@/data/projects";

// Image metadata
export const alt = "Project Details";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation with dynamic params
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "#0a0a0a",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fafafa",
            fontFamily: "monospace",
          }}
        >
          Project Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: project.color,
          position: "relative",
          padding: "80px",
        }}
      >
        {/* Dark overlay for better text contrast */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(10,10,10,0.85), rgba(10,10,10,0.6))",
            display: "flex",
          }}
        />

        {/* Diagonal grid pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%), linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%)",
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0, 30px 30px",
            display: "flex",
          }}
        />

        {/* Geometric accent shapes */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "8%",
            width: "180px",
            height: "180px",
            border: "3px solid rgba(255,255,255,0.15)",
            transform: "rotate(15deg)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "5%",
            width: "120px",
            height: "120px",
            border: "3px solid rgba(255,255,255,0.1)",
            transform: "rotate(-20deg)",
            display: "flex",
          }}
        />

        {/* Scanline effect */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            display: "flex",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Category & Year tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.7)",
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "8px 20px",
                border: "2px solid rgba(255,255,255,0.2)",
                display: "flex",
                letterSpacing: "0.2em",
              }}
            >
              {project.category}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.5)",
                display: "flex",
                letterSpacing: "0.2em",
              }}
            >
              {project.year}
            </div>
          </div>

          {/* Project title */}
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#fafafa",
              lineHeight: 0.95,
              marginBottom: "30px",
              display: "flex",
              textShadow: "4px 4px 0px rgba(0,0,0,0.3)",
            }}
          >
            {project.title}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: "400px",
              height: "4px",
              background: "rgba(255,255,255,0.8)",
              display: "flex",
            }}
          />
        </div>

        {/* Logo in top right corner */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            opacity: 0.9,
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            style={{ display: "flex" }}
          >
            {/* A shape (triangle) */}
            <polygon points="50,20 75,60 25,60" fill="#ffaa00" />
            <polygon points="50,32 60,50 40,50" fill="rgba(10,10,10,0.85)" />

            {/* T shape (cross) */}
            <rect x="20" y="45" width="60" height="8" fill="#fafafa" />
            <rect x="46" y="53" width="8" height="27" fill="#fafafa" />

            {/* F shape overlay */}
            <rect x="28" y="60" width="20" height="8" fill="#ffaa00" />
            <rect x="28" y="60" width="8" height="20" fill="#ffaa00" />
          </svg>
        </div>

        {/* Bottom corner accents */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "80px",
            height: "80px",
            borderBottom: "4px solid rgba(255,255,255,0.6)",
            borderRight: "4px solid rgba(255,255,255,0.6)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            width: "60px",
            height: "60px",
            borderTop: "4px solid rgba(255,255,255,0.4)",
            borderLeft: "4px solid rgba(255,255,255,0.4)",
            display: "flex",
          }}
        />

        {/* Decorative bars */}
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            right: "150px",
            display: "flex",
            gap: "12px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: "4px",
                height: i === 2 ? "60px" : "40px",
                background: "rgba(255,255,255,0.5)",
                display: "flex",
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
