"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";

const sorted = [...projects].reverse();

export default function WorkBadgeNav() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract slug from pathname: /work/worktigre -> worktigre
  const match = pathname.match(/^\/work\/([^/]+)$/);
  const slug = match?.[1] ?? null;
  const isVisible = slug !== null;

  // Scroll active badge into view
  useEffect(() => {
    if (!slug || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(`[data-project="${slug}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [slug]);

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-30 bg-background border-b border-foreground/5">
      <div
        ref={scrollRef}
        className="flex items-center justify-center gap-3 px-8 py-4 overflow-x-auto scrollbar-hide max-w-full"
      >
        {sorted.map((p) => {
          const isActive = p.id === slug;
          return (
            <button
              key={p.id}
              data-project={p.id}
              data-cursor="hover"
              onClick={() => router.push(`/work/${p.id}`)}
              className="shrink-0"
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: isActive ? 44 : 32,
                  height: isActive ? 44 : 32,
                  borderRadius: isActive ? 12 : 8,
                  borderWidth: isActive ? 2 : 1,
                  borderStyle: "solid",
                  borderColor: isActive ? p.color : "#2a2a2a",
                  boxShadow: isActive ? `0 0 20px ${p.color}30` : "none",
                  background: p.id === "yeetbg" ? "#ffffff" : undefined,
                  transition: "all 250ms cubic-bezier(0.33, 1, 0.68, 1)",
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

      {/* Back to timeline */}
      <div className="flex justify-center -mt-1 pb-2">
        <button
          onClick={() => router.push("/work")}
          data-cursor="hover"
          className="w-7 h-7 flex items-center justify-center border border-foreground/10 hover:border-accent hover:text-accent transition-colors text-muted"
          aria-label="Retour timeline"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
