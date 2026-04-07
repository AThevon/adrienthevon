'use client';

import { useEffect, useRef, useCallback } from 'react';

function GithubIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

interface FloatingSocialIconsProps {
  asciiRef: React.RefObject<HTMLDivElement | null>;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

interface FloatingIcon {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const ICON_SIZE = 52;
const HALF = 26;
const DAMPING_IDLE = 0.999;
const DAMPING_HOVER = 0.85;
const RESTITUTION = 0.8;
const MIN_VELOCITY = 0.2;
const JITTER = 0.02;
const DRAG_THRESHOLD = 5;
const REPULSE_DIST = 70;
const REPULSE_FORCE = 0.3;

const ICONS_DATA = [
  {
    id: 'github',
    url: 'https://github.com/AThevon',
    label: 'GitHub',
    icon: GithubIcon,
    iconSize: 22,
  },
  {
    id: 'linkedin',
    url: 'https://linkedin.com/in/adrien-thevon-74b134100',
    label: 'LinkedIn',
    icon: LinkedinIcon,
    iconSize: 18,
  },
] as const;

function bounceOffBox(icon: FloatingIcon, box: BoundingBox) {
  const closestX = Math.max(box.left, Math.min(icon.x, box.right));
  const closestY = Math.max(box.top, Math.min(icon.y, box.bottom));
  const dx = icon.x - closestX;
  const dy = icon.y - closestY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < HALF && dist > 0) {
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = HALF - dist;
    icon.x += nx * overlap;
    icon.y += ny * overlap;

    const dot = icon.vx * nx + icon.vy * ny;
    if (dot < 0) {
      icon.vx -= 2 * dot * nx * RESTITUTION;
      icon.vy -= 2 * dot * ny * RESTITUTION;
    }
  }
}

export default function FloatingSocialIcons({
  asciiRef,
  gridRef,
}: FloatingSocialIconsProps) {
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

  // Initialize icons positions
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const x1 = vw * (0.45 + Math.random() * 0.2);
    const y1 = vh * (0.2 + Math.random() * 0.2);

    iconsRef.current = [
      { x: x1, y: y1, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2 },
      { x: x1 + 80, y: y1 + 40, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2 },
    ];

    // Apply initial positions
    for (let i = 0; i < 2; i++) {
      const el = elRefs.current[i];
      if (el) {
        el.style.transform = `translate(${iconsRef.current[i].x - HALF}px, ${iconsRef.current[i].y - HALF}px)`;
      }
    }
  }, []);

  // Physics loop
  useEffect(() => {
    const loop = () => {
      const icons = iconsRef.current;
      if (icons.length < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const asciiBox = asciiRef.current?.getBoundingClientRect();
      const gridBox = gridRef.current?.getBoundingClientRect();

      for (let i = 0; i < 2; i++) {
        const icon = icons[i];

        // Skip dragged icon
        if (dragRef.current?.index === i && dragRef.current.isDragging) continue;

        const isHovered = hoveredRef.current === i;

        // Jitter
        if (!isHovered) {
          icon.vx += (Math.random() - 0.5) * 2 * JITTER;
          icon.vy += (Math.random() - 0.5) * 2 * JITTER;
        }

        // Damping
        const damping = isHovered ? DAMPING_HOVER : DAMPING_IDLE;
        icon.vx *= damping;
        icon.vy *= damping;

        // Re-inject velocity if too slow
        if (!isHovered) {
          const speed = Math.sqrt(icon.vx * icon.vx + icon.vy * icon.vy);
          if (speed < MIN_VELOCITY) {
            icon.vx += (Math.random() - 0.5) * 1.2;
            icon.vy += (Math.random() - 0.5) * 1.2;
          }
        }

        // Update position
        icon.x += icon.vx;
        icon.y += icon.vy;

        // Bounce off viewport edges
        if (icon.x - HALF < 0) {
          icon.x = HALF;
          icon.vx = Math.abs(icon.vx) * RESTITUTION;
        } else if (icon.x + HALF > vw) {
          icon.x = vw - HALF;
          icon.vx = -Math.abs(icon.vx) * RESTITUTION;
        }
        if (icon.y - HALF < 0) {
          icon.y = HALF;
          icon.vy = Math.abs(icon.vy) * RESTITUTION;
        } else if (icon.y + HALF > vh) {
          icon.y = vh - HALF;
          icon.vy = -Math.abs(icon.vy) * RESTITUTION;
        }

        // Bounce off ASCII box
        if (asciiBox) {
          bounceOffBox(icon, {
            left: asciiBox.left,
            top: asciiBox.top,
            right: asciiBox.right,
            bottom: asciiBox.bottom,
          });
        }

        // Bounce off grid box
        if (gridBox) {
          bounceOffBox(icon, {
            left: gridBox.left,
            top: gridBox.top,
            right: gridBox.right,
            bottom: gridBox.bottom,
          });
        }
      }

      // Icon-icon repulsion
      const dx = icons[1].x - icons[0].x;
      const dy = icons[1].y - icons[0].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPULSE_DIST && dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        const force = REPULSE_FORCE * (1 - dist / REPULSE_DIST);

        if (!(dragRef.current?.index === 0 && dragRef.current.isDragging)) {
          icons[0].vx -= nx * force;
          icons[0].vy -= ny * force;
        }
        if (!(dragRef.current?.index === 1 && dragRef.current.isDragging)) {
          icons[1].vx += nx * force;
          icons[1].vy += ny * force;
        }
      }

      // Apply transforms directly to DOM
      for (let i = 0; i < 2; i++) {
        const el = elRefs.current[i];
        if (el) {
          el.style.transform = `translate(${icons[i].x - HALF}px, ${icons[i].y - HALF}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [asciiRef, gridRef]);

  // Mouse events for drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const mx = e.clientX;
      const my = e.clientY;

      if (!drag.isDragging) {
        const ddx = mx - drag.startX;
        const ddy = my - drag.startY;
        if (Math.sqrt(ddx * ddx + ddy * ddy) >= DRAG_THRESHOLD) {
          drag.isDragging = true;
          const el = elRefs.current[drag.index];
          if (el) el.style.cursor = 'grabbing';
        }
      }

      if (drag.isDragging) {
        const icon = iconsRef.current[drag.index];
        if (icon) {
          icon.x = mx - drag.offsetX;
          icon.y = my - drag.offsetY;

          drag.history.push({ x: mx, y: my, t: performance.now() });
          if (drag.history.length > 5) drag.history.shift();
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const el = elRefs.current[drag.index];
      if (el) el.style.cursor = 'grab';

      if (!drag.isDragging) {
        // Click - open link
        const data = ICONS_DATA[drag.index];
        window.open(data.url, '_blank', 'noopener,noreferrer');
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
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
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

  const handleMouseEnter = useCallback((index: number) => {
    hoveredRef.current = index;
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = -1;
  }, []);

  return (
    <>
      {ICONS_DATA.map((data, i) => {
        const Icon = data.icon;
        return (
          <a
            key={data.id}
            ref={(el) => {
              elRefs.current[i] = el;
            }}
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.preventDefault()}
            onMouseDown={(e) => handleMouseDown(e, i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            data-cursor="hover"
            className="group"
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
              transition: 'box-shadow 0.2s ease, scale 0.2s ease',
              textDecoration: 'none',
              userSelect: 'none',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.scale = '1.12';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px #ffaa0033';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.scale = '1';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
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
                opacity: 0,
                transition: 'opacity 0.2s ease',
                pointerEvents: 'none',
              }}
              className="group-hover:!opacity-100"
            >
              {data.label}
            </span>
          </a>
        );
      })}
    </>
  );
}
