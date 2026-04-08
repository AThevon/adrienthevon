"use client";

/**
 * Stylish loader for the /work page transitions.
 * Used as loading fallback for dynamic imports.
 */
export function CanvasLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background gap-6">
      {/* Accent line sweep */}
      <div className="w-48 h-px bg-foreground/10 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-accent"
          style={{ animation: "loader-line-sweep 1.5s ease-in-out infinite" }}
        />
      </div>
      {/* Label */}
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-[10px] text-muted/50 uppercase tracking-[0.3em]"
          style={{ animation: "loader-fade-pulse 1.5s ease-in-out infinite" }}
        >
          Loading timeline
        </span>
      </div>
    </div>
  );
}

export function ProjectLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {/* Three dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-accent/60 rounded-full"
            style={{
              animation: `loader-dot-bounce 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <span
        className="font-mono text-[10px] text-muted/40 uppercase tracking-[0.3em]"
        style={{ animation: "loader-fade-pulse 1.5s ease-in-out infinite" }}
      >
        Loading project
      </span>
    </div>
  );
}
