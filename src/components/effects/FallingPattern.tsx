"use client";

/**
 * FallingPattern — Pure CSS animated background (GPU-composited)
 * No framer-motion for the animation loop = zero JS per frame
 */

interface FallingPatternProps {
  color?: string;
  backgroundColor?: string;
  duration?: number;
  className?: string;
}

export default function FallingPattern({
  color = "#ffaa00",
  backgroundColor = "#0a0a0a",
  duration = 150,
  className = "",
}: FallingPatternProps) {
  // Reduced to 6 rows for performance (was 12)
  const rows = [235, 150, 204, 179, 215, 158];

  const backgroundImage = rows
    .map((h) => {
      const half = h / 2;
      return [
        `radial-gradient(3px 80px at 0px ${h}px, ${color}, transparent)`,
        `radial-gradient(3px 80px at 300px ${h}px, ${color}, transparent)`,
        `radial-gradient(1.5px 1.5px at 150px ${half}px, ${color} 100%, transparent 150%)`,
      ].join(", ");
    })
    .join(", ");

  const backgroundSize = rows
    .map((h) => `300px ${h}px, 300px ${h}px, 300px ${h}px`)
    .join(", ");

  // Pre-computed start/end positions for 6 rows (18 layers)
  const startPos =
    "0px 220px, 3px 220px, 151.5px 337.5px, 50px 16px, 53px 16px, 201.5px 91px, 100px 19px, 103px 19px, 251.5px 121px, 150px 31px, 153px 31px, 301.5px 120.5px, 200px 121px, 203px 121px, 351.5px 228.5px, 250px 26px, 253px 26px, 401.5px 105px";
  const endPos =
    "0px 6800px, 3px 6800px, 151.5px 6917.5px, 50px 5416px, 53px 5416px, 201.5px 5491px, 100px 5119px, 103px 5119px, 251.5px 5221px, 150px 9876px, 153px 9876px, 301.5px 9965.5px, 200px 14741px, 203px 14741px, 351.5px 14848.5px, 250px 5082px, 253px 5082px, 401.5px 5161px";

  const animationName = "fallingPattern";

  return (
    <div className={`relative h-full w-full ${className}`}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ${animationName} {
              from { background-position: ${startPos}; }
              to { background-position: ${endPos}; }
            }
          `,
        }}
      />
      <div
        className="size-full"
        style={{
          backgroundColor,
          backgroundImage,
          backgroundSize,
          animation: `${animationName} ${duration}s linear infinite`,
          willChange: "background-position",
        }}
      />
    </div>
  );
}
