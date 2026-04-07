'use client';

import { useEffect, useRef, useCallback } from 'react';

function GithubIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

export interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface FloatingSocialIconsProps {
  asciiBoundsRef: React.RefObject<BoundingBox | null>;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

interface FloatingIcon {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const ICON_SIZE = 52;
const HALF = 26;
const DAMPING_IDLE = 0.998;
const DAMPING_HOVER = 0.8;
const RESTITUTION = 0.7;
const MIN_VELOCITY = 0.15;
const JITTER = 0.015;
const DRAG_THRESHOLD = 5;
const REPULSE_DIST = 80;
const REPULSE_FORCE = 0.4;
const MARGIN = 8; // extra margin around boxes for bounce

const ICONS_DATA = [
  { id: 'github', url: 'https://github.com/AThevon', label: 'GitHub', icon: GithubIcon, iconSize: 22 },
  { id: 'linkedin', url: 'https://linkedin.com/in/adrien-thevon-74b134100', label: 'LinkedIn', icon: LinkedinIcon, iconSize: 18 },
] as const;

// Bounce icon off a bounding box. Handles both edge collision and fully-inside case.
function bounceOffBox(icon: FloatingIcon, box: BoundingBox) {
  const expandedBox = {
    left: box.left - MARGIN,
    top: box.top - MARGIN,
    right: box.right + MARGIN,
    bottom: box.bottom + MARGIN,
  };

  // Check if icon center is inside the expanded box
  const insideX = icon.x > expandedBox.left && icon.x < expandedBox.right;
  const insideY = icon.y > expandedBox.top && icon.y < expandedBox.bottom;

  if (insideX && insideY) {
    // Icon is inside the box - push it out via nearest edge
    const distLeft = icon.x - expandedBox.left;
    const distRight = expandedBox.right - icon.x;
    const distTop = icon.y - expandedBox.top;
    const distBottom = expandedBox.bottom - icon.y;
    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    if (minDist === distLeft) {
      icon.x = expandedBox.left - HALF;
      icon.vx = -Math.abs(icon.vx) * RESTITUTION - 0.5;
    } else if (minDist === distRight) {
      icon.x = expandedBox.right + HALF;
      icon.vx = Math.abs(icon.vx) * RESTITUTION + 0.5;
    } else if (minDist === distTop) {
      icon.y = expandedBox.top - HALF;
      icon.vy = -Math.abs(icon.vy) * RESTITUTION - 0.5;
    } else {
      icon.y = expandedBox.bottom + HALF;
      icon.vy = Math.abs(icon.vy) * RESTITUTION + 0.5;
    }
    return;
  }

  // Edge collision (icon outside but close)
  const closestX = Math.max(expandedBox.left, Math.min(icon.x, expandedBox.right));
  const closestY = Math.max(expandedBox.top, Math.min(icon.y, expandedBox.bottom));
  const dx = icon.x - closestX;
  const dy = icon.y - closestY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < HALF && dist > 0) {
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = HALF - dist;
    icon.x += nx * (overlap + 1);
    icon.y += ny * (overlap + 1);

    const dot = icon.vx * nx + icon.vy * ny;
    if (dot < 0) {
      icon.vx -= 2 * dot * nx * RESTITUTION;
      icon.vy -= 2 * dot * ny * RESTITUTION;
    }
  }
}

// Push icon out of a box after drag release
function pushOutOfBox(icon: FloatingIcon, box: BoundingBox) {
  const expanded = { left: box.left - HALF, top: box.top - HALF, right: box.right + HALF, bottom: box.bottom + HALF };
  if (icon.x > expanded.left && icon.x < expanded.right && icon.y > expanded.top && icon.y < expanded.bottom) {
    bounceOffBox(icon, box);
  }
}

export default function FloatingSocialIcons({ asciiBoundsRef, gridRef }: FloatingSocialIconsProps) {
  const iconsRef = useRef<FloatingIcon[]>([]);
  const elRefs = useRef<(HTMLAnchorElement | null)[]>([null, null]);
  const hoveredRef = useRef<number>(-1);
  const dragRef = useRef<{
    index: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    isDragging: boolean;
    history: { x: number; y: number; t: number }[];
  } | null>(null);
  const rafRef = useRef<number>(0);
  const mountedRef = useRef(false);

  // Initialize positions
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x1 = vw * (0.45 + Math.random() * 0.15);
    const y1 = vh * (0.2 + Math.random() * 0.15);

    iconsRef.current = [
      { x: x1, y: y1, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8 },
      { x: x1 + 90, y: y1 + 50, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8 },
    ];

    for (let i = 0; i < 2; i++) {
      const el = elRefs.current[i];
      if (el) el.style.transform = `translate(${iconsRef.current[i].x - HALF}px, ${iconsRef.current[i].y - HALF}px)`;
    }
  }, []);

  // Physics loop
  useEffect(() => {
    const loop = () => {
      const icons = iconsRef.current;
      if (icons.length < 2) { rafRef.current = requestAnimationFrame(loop); return; }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const asciiBounds = asciiBoundsRef.current;
      const gridBox = gridRef.current?.getBoundingClientRect() ?? null;

      for (let i = 0; i < 2; i++) {
        const icon = icons[i];
        const isDragging = dragRef.current?.index === i && dragRef.current.isDragging;
        if (isDragging) continue;

        const isHovered = hoveredRef.current === i;
        const damping = isHovered ? DAMPING_HOVER : DAMPING_IDLE;

        // Jitter (only when idle, not hovered)
        if (!isHovered) {
          icon.vx += (Math.random() - 0.5) * 2 * JITTER;
          icon.vy += (Math.random() - 0.5) * 2 * JITTER;
        }

        // Damping
        icon.vx *= damping;
        icon.vy *= damping;

        // Re-inject velocity if too slow and not hovered
        if (!isHovered) {
          const speed = Math.sqrt(icon.vx * icon.vx + icon.vy * icon.vy);
          if (speed < MIN_VELOCITY) {
            const angle = Math.random() * Math.PI * 2;
            icon.vx += Math.cos(angle) * 0.4;
            icon.vy += Math.sin(angle) * 0.4;
          }
        }

        // Update position
        icon.x += icon.vx;
        icon.y += icon.vy;

        // Viewport bounce
        if (icon.x - HALF < 0) { icon.x = HALF; icon.vx = Math.abs(icon.vx) * RESTITUTION; }
        else if (icon.x + HALF > vw) { icon.x = vw - HALF; icon.vx = -Math.abs(icon.vx) * RESTITUTION; }
        if (icon.y - HALF < 0) { icon.y = HALF; icon.vy = Math.abs(icon.vy) * RESTITUTION; }
        else if (icon.y + HALF > vh) { icon.y = vh - HALF; icon.vy = -Math.abs(icon.vy) * RESTITUTION; }

        // Bounce off ASCII content bounds
        if (asciiBounds) bounceOffBox(icon, asciiBounds);

        // Bounce off grid
        if (gridBox) bounceOffBox(icon, gridBox);
      }

      // Icon-icon repulsion
      const a = icons[0], b = icons[1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPULSE_DIST && dist > 0) {
        const nx = dx / dist, ny = dy / dist;
        const force = REPULSE_FORCE * (1 - dist / REPULSE_DIST);
        if (!(dragRef.current?.index === 0 && dragRef.current.isDragging)) { a.vx -= nx * force; a.vy -= ny * force; }
        if (!(dragRef.current?.index === 1 && dragRef.current.isDragging)) { b.vx += nx * force; b.vy += ny * force; }
      }

      // Apply to DOM
      for (let i = 0; i < 2; i++) {
        const el = elRefs.current[i];
        if (el) el.style.transform = `translate(${icons[i].x - HALF}px, ${icons[i].y - HALF}px)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [asciiBoundsRef, gridRef]);

  // Document-level mouse events for drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      if (!drag.isDragging) {
        const ddx = e.clientX - drag.startX;
        const ddy = e.clientY - drag.startY;
        if (Math.sqrt(ddx * ddx + ddy * ddy) >= DRAG_THRESHOLD) {
          drag.isDragging = true;
        }
      }

      if (drag.isDragging) {
        const icon = iconsRef.current[drag.index];
        if (icon) {
          icon.x = e.clientX - drag.offsetX;
          icon.y = e.clientY - drag.offsetY;
          drag.history.push({ x: e.clientX, y: e.clientY, t: performance.now() });
          if (drag.history.length > 6) drag.history.shift();
        }
      }
    };

    const onMouseUp = () => {
      const drag = dragRef.current;
      if (!drag) return;

      if (!drag.isDragging) {
        // Simple click -> navigate
        window.open(ICONS_DATA[drag.index].url, '_blank', 'noopener,noreferrer');
      } else {
        // Release with velocity
        const icon = iconsRef.current[drag.index];
        const hist = drag.history;
        if (icon && hist.length >= 2) {
          const last = hist[hist.length - 1];
          const prev = hist[Math.max(0, hist.length - 3)];
          const dt = (last.t - prev.t) || 16;
          icon.vx = ((last.x - prev.x) / dt) * 16;
          icon.vy = ((last.y - prev.y) / dt) * 16;

          // Clamp max velocity
          const maxV = 15;
          icon.vx = Math.max(-maxV, Math.min(maxV, icon.vx));
          icon.vy = Math.max(-maxV, Math.min(maxV, icon.vy));
        }

        // Push out of forbidden zones after drag
        if (icon) {
          const asciiBounds = asciiBoundsRef.current;
          const gridBox = gridRef.current?.getBoundingClientRect();
          if (asciiBounds) pushOutOfBox(icon, asciiBounds);
          if (gridBox) pushOutOfBox(icon, gridBox);
        }
      }

      dragRef.current = null;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [asciiBoundsRef, gridRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const icon = iconsRef.current[index];
    if (!icon) return;

    dragRef.current = {
      index,
      offsetX: e.clientX - icon.x,
      offsetY: e.clientY - icon.y,
      startX: e.clientX,
      startY: e.clientY,
      isDragging: false,
      history: [{ x: e.clientX, y: e.clientY, t: performance.now() }],
    };
  }, []);

  return (
    <>
      {ICONS_DATA.map((data, i) => {
        const Icon = data.icon;
        return (
          <a
            key={data.id}
            ref={(el) => { elRefs.current[i] = el; }}
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.preventDefault()}
            onMouseDown={(e) => handleMouseDown(e, i)}
            onMouseEnter={() => { hoveredRef.current = i; }}
            onMouseLeave={() => { hoveredRef.current = -1; }}
            data-cursor="hover"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: ICON_SIZE,
              height: ICON_SIZE,
              willChange: 'transform',
              zIndex: 40,
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1.5px solid #ffaa00',
              background: '#0a0a0a',
              color: '#ffaa00',
              textDecoration: 'none',
              userSelect: 'none',
            }}
          >
            <Icon size={data.iconSize} />
            <span
              style={{
                position: 'absolute',
                top: ICON_SIZE + 8,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '8px',
                color: '#ffaa0088',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {data.label}
            </span>
          </a>
        );
      })}
    </>
  );
}
