"use client";

import { motion } from "motion/react";

interface NavigationArtifactProps {
  type: string;
  color: string;
  active: boolean;
  className?: string;
}

export default function NavigationArtifact({
  type,
  color,
  active,
  className = "w-20 h-20",
}: NavigationArtifactProps) {
  switch (type) {
    case "work":
      return (
        <motion.div className={`relative ${className}`}>
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0"
              style={{
                border: `2px solid ${color}`,
                clipPath:
                  "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                scale: 1 - ring * 0.25,
              }}
              animate={
                active
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
          className={`relative ${className}`}
          style={{ perspective: "200px" }}
        >
          <motion.div
            className="w-full h-full border"
            style={{
              borderColor: color,
              transformStyle: "preserve-3d",
            }}
            animate={
              active
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
                  border: `2px solid ${color}40`,
                  transform: `rotateY(${deg}deg) translateZ(32px)`,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      );

    case "journey":
      return (
        <motion.div className={`relative ${className}`}>
          {[0, 45, 90].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute inset-2 rounded-full"
              style={{
                border: `2px solid ${color}`,
                rotate: `${angle}deg`,
              }}
              animate={
                active
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
            style={{ backgroundColor: color, x: "-50%", y: "-50%" }}
            animate={
              active
                ? {
                    scale: [1, 1.5, 1],
                    boxShadow: [
                      `0 0 10px ${color}`,
                      `0 0 20px ${color}`,
                      `0 0 10px ${color}`,
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

    case "about":
      return (
        <motion.div className={`relative ${className}`}>
          {[0, 1].map((strand) => (
            <motion.div
              key={strand}
              className="absolute w-full h-full"
              animate={
                active
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
                    backgroundColor: color,
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${angle}deg) translateX(24px)`,
                  }}
                  animate={
                    active
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
        <motion.div className={`relative ${className}`}>
          {[0, 1, 2, 3].map((wave) => (
            <motion.div
              key={wave}
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${color}`,
              }}
              animate={
                active
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
}
