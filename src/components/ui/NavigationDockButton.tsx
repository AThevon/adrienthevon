"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { usePageTransition } from "@/hooks/usePageTransition";

interface NavigationItem {
  key: string;
  href: string;
  color: string;
  icon: string;
}

interface NavigationDockButtonProps {
  item: NavigationItem;
}

export default function NavigationDockButton({ item }: NavigationDockButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const tNav = useTranslations("nav");
  const { transitionToPage } = usePageTransition();

  const renderArtifact = () => {
    switch (item.key) {
      case "work":
        return (
          <motion.div className="relative w-16 h-16">
            {[0, 1, 2].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0"
                style={{
                  border: `1px solid ${item.color}`,
                  clipPath:
                    "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                  scale: 1 - ring * 0.25,
                }}
                animate={
                  isHovered
                    ? {
                        rotate: [0, 360],
                        opacity: [0.2, 0.6, 0.2],
                      }
                    : {}
                }
                transition={{
                  rotate: {
                    duration: 8 + ring * 2,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: { duration: 2, repeat: Infinity, delay: ring * 0.3 },
                }}
              />
            ))}
          </motion.div>
        );

      case "skills":
        return (
          <motion.div
            className="relative w-16 h-16"
            style={{ perspective: "200px" }}
          >
            <motion.div
              className="w-full h-full border"
              style={{
                borderColor: item.color,
                transformStyle: "preserve-3d",
              }}
              animate={
                isHovered
                  ? {
                      rotateX: [0, 360],
                      rotateY: [0, 360],
                    }
                  : {}
              }
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[0, 90, 180, 270].map((deg, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    border: `1px solid ${item.color}40`,
                    transform: `rotateY(${deg}deg) translateZ(32px)`,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        );

      case "journey":
        return (
          <motion.div className="relative w-16 h-16">
            {[0, 45, 90].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute inset-2 rounded-full"
                style={{
                  border: `1px solid ${item.color}`,
                  rotate: `${angle}deg`,
                }}
                animate={
                  isHovered
                    ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }
                    : {}
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
            <motion.div
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color, x: "-50%", y: "-50%" }}
              animate={
                isHovered
                  ? {
                      scale: [1, 1.5, 1],
                      boxShadow: [
                        `0 0 10px ${item.color}`,
                        `0 0 20px ${item.color}`,
                        `0 0 10px ${item.color}`,
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>
        );

      case "philosophy":
        return (
          <motion.div className="relative w-16 h-16">
            {[0, 1, 2, 3].map((level) => (
              <motion.div
                key={level}
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  border: `1px solid ${item.color}`,
                  scale: 1 - level * 0.2,
                }}
                animate={
                  isHovered
                    ? {
                        rotate: [0, -360],
                        opacity: [0.2, 0.7, 0.2],
                      }
                    : {}
                }
                transition={{
                  rotate: {
                    duration: 12 - level * 2,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: 3,
                    repeat: Infinity,
                    delay: level * 0.2,
                  },
                }}
              />
            ))}
          </motion.div>
        );

      case "about":
        return (
          <motion.div className="relative w-16 h-16">
            {[0, 1].map((strand) => (
              <motion.div
                key={strand}
                className="absolute w-full h-full"
                animate={
                  isHovered
                    ? {
                        rotate: [0, 360],
                      }
                    : {}
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: strand * 3,
                }}
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <motion.div
                    key={angle}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      left: "50%",
                      top: "50%",
                      transform: `rotate(${angle}deg) translateX(24px)`,
                    }}
                    animate={
                      isHovered
                        ? {
                            scale: [0.5, 1, 0.5],
                            opacity: [0.3, 1, 0.3],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: angle / 360,
                    }}
                  />
                ))}
              </motion.div>
            ))}
          </motion.div>
        );

      case "contact":
        return (
          <motion.div className="relative w-16 h-16">
            {[0, 1, 2, 3].map((wave) => (
              <motion.div
                key={wave}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1px solid ${item.color}`,
                }}
                animate={
                  isHovered
                    ? {
                        scale: [0, 2],
                        opacity: [0.8, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: wave * 0.75,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <button
      onClick={() => transitionToPage(item.href)}
      className="group relative flex-1"
      data-cursor="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative origin-bottom"
        whileHover={{ scale: 1.2, y: -16 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        <div className="relative w-full aspect-video overflow-visible">
          <motion.div
            className="absolute -inset-8 rounded-3xl opacity-0 group-hover:opacity-40 blur-3xl"
            style={{ backgroundColor: item.color }}
            transition={{ duration: 0.5 }}
          />

          <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 p-4">
            <motion.div className="opacity-60 group-hover:opacity-100">
              {renderArtifact()}
            </motion.div>

            <motion.span
              className="font-mono text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100"
              style={{
                color: item.color,
                textShadow: `0 0 10px ${item.color}60`,
              }}
              transition={{ duration: 0.3 }}
            >
              {tNav(item.key).toUpperCase()}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </button>
  );
}
