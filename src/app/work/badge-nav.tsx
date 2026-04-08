"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";

const sorted = [...projects].reverse();

export default function WorkBadgeNav() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const match = pathname.match(/^\/work\/([^/]+)$/);
  const slug = match?.[1] ?? null;
  const isVisible = slug !== null;

  useEffect(() => {
    if (!slug || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(`[data-project="${slug}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [slug]);

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm">
      <div className="flex items-center gap-4 px-6 md:px-12 pt-20 pb-6">
        {/* Back button - matches header style */}
        <button
          onClick={() => router.push("/work")}
          data-cursor="hover"
          className="shrink-0 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border border-foreground/15 hover:border-accent hover:text-accent transition-all duration-200 text-muted"
          style={{ borderRadius: 10 }}
          aria-label="Retour timeline"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Badges */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 flex-1 py-2 px-3"
        >
          {sorted.map((p) => {
            const isActive = p.id === slug;
            return (
              <button
                key={p.id}
                data-project={p.id}
                data-cursor="hover"
                onClick={() => router.push(`/work/${p.id}`)}
                className="shrink-0 group"
                style={{
                  marginLeft: isActive ? 6 : 0,
                  marginRight: isActive ? 6 : 0,
                  transition: "margin 250ms cubic-bezier(0.33, 1, 0.68, 1)",
                }}
              >
                <div
                  className={`relative ${!isActive ? "overflow-hidden group-hover:brightness-125" : ""}`}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: "none",
                    outline: isActive ? `2px solid ${p.color}` : `1px solid #2a2a2a`,
                    outlineOffset: isActive ? 4 : 0,
                    boxShadow: isActive ? `0 0 24px ${p.color}25` : "none",
                    background: p.id === "yeetbg" ? "#ffffff" : undefined,
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    transition: "transform 250ms cubic-bezier(0.33, 1, 0.68, 1), outline-color 200ms ease-out, outline-offset 200ms ease-out, outline-width 200ms ease-out, box-shadow 200ms ease-out",
                  }}
                >
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-mono text-[10px] font-bold"
                      style={{ color: p.color, background: "#141414" }}
                    >
                      {p.title.slice(0, 2)}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active project name */}
        {slug && (() => {
          const active = projects.find(p => p.id === slug);
          return active ? (
            <span className="shrink-0 hidden md:block font-mono text-[10px] text-muted/50 uppercase tracking-[0.2em]">
              {active.title}
            </span>
          ) : null;
        })()}
      </div>
    </div>
  );
}
