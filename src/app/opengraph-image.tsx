import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Adrien Thevon - Creative Developer Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            display: "flex",
          }}
        />

        {/* Geometric shapes */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "150px",
            height: "150px",
            border: "2px solid rgba(255,170,0,0.3)",
            transform: "rotate(45deg)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            right: "8%",
            width: "200px",
            height: "200px",
            border: "2px solid rgba(255,170,0,0.2)",
            transform: "rotate(12deg)",
            display: "flex",
          }}
        />

        {/* Accent lines */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "15%",
            width: "300px",
            height: "2px",
            background:
              "linear-gradient(90deg, rgba(255,170,0,0.6), transparent)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            left: "10%",
            width: "250px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,170,0,0.4))",
            display: "flex",
          }}
        />

        {/* Logo in top left corner */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          {/* Recreate logo with simple shapes */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            style={{ display: "flex" }}
          >
            {/* A shape (triangle) */}
            <polygon
              points="50,20 75,60 25,60"
              fill="#ffaa00"
            />
            <polygon
              points="50,32 60,50 40,50"
              fill="#0a0a0a"
            />

            {/* T shape (cross) */}
            <rect x="20" y="45" width="60" height="8" fill="#fafafa" />
            <rect x="46" y="53" width="8" height="27" fill="#fafafa" />

            {/* F shape overlay */}
            <rect x="28" y="60" width="20" height="8" fill="#ffaa00" />
            <rect x="28" y="60" width="8" height="20" fill="#ffaa00" />
          </svg>
        </div>

        {/* Corner accent - moved to right */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "60px",
            height: "60px",
            borderTop: "3px solid #ffaa00",
            borderRight: "3px solid #ffaa00",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "80px",
            height: "80px",
            borderBottom: "3px solid #ffaa00",
            borderRight: "3px solid #ffaa00",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: "128px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#fafafa",
              lineHeight: 0.9,
              marginBottom: "20px",
              display: "flex",
            }}
          >
            ADRIEN THEVON
          </div>

          {/* Separator */}
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
                width: "60px",
                height: "2px",
                background: "#ffaa00",
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: "20px",
                color: "#888888",
                fontFamily: "monospace",
                letterSpacing: "0.3em",
                display: "flex",
              }}
            >
              PORTFOLIO 2025
            </div>
            <div
              style={{
                width: "60px",
                height: "2px",
                background: "#ffaa00",
                display: "flex",
              }}
            />
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 600,
              color: "#ffaa00",
              display: "flex",
              fontFamily: "monospace",
            }}
          >
            CREATIVE DEVELOPER
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "15px",
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: i % 2 === 0 ? "40px" : "30px",
                background:
                  i === 3 ? "#ffaa00" : "rgba(250,250,250,0.2)",
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
