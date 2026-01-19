"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ObfuscatedEmailProps {
  user: string; // "adrien"
  domain: string; // "thevon.com"
  className?: string;
}

export default function ObfuscatedEmail({
  user,
  domain,
  className = "",
}: ObfuscatedEmailProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const realEmail = `${user}@${domain}`;
  const obfuscatedChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Generate obfuscated version
  useEffect(() => {
    if (!isRevealed) {
      const obfuscated = realEmail
        .split("")
        .map((char) => {
          if (char === "@" || char === ".") return char;
          return obfuscatedChars[
            Math.floor(Math.random() * obfuscatedChars.length)
          ];
        })
        .join("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayText(obfuscated);
    } else {
       
      setDisplayText(realEmail);
    }
  }, [isRevealed, realEmail]);

  // Glitch effect animation
  useEffect(() => {
    if (!isRevealed) {
      const interval = setInterval(() => {
        const obfuscated = realEmail
          .split("")
          .map((char) => {
            if (char === "@" || char === ".") return char;
            return obfuscatedChars[
              Math.floor(Math.random() * obfuscatedChars.length)
            ];
          })
          .join("");
        setDisplayText(obfuscated);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRevealed, realEmail]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(realEmail);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.button
        className="group relative font-mono text-lg md:text-xl border border-foreground/20 px-6 py-3 overflow-hidden"
        onMouseEnter={() => setIsRevealed(true)}
        onMouseLeave={() => setIsRevealed(false)}
        onClick={handleCopy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-cursor="hover"
      >
        {/* Background gradient on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent/5"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Email text with glitch effect */}
        <span className="relative z-10 block">
          {displayText.split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0.6 }}
              animate={{
                opacity: isRevealed ? 1 : 0.6,
                y: isRevealed ? 0 : [0, -2, 2, 0],
              }}
              transition={{
                duration: 0.3,
                delay: isRevealed ? i * 0.02 : 0,
                y: {
                  duration: 0.2,
                  repeat: isRevealed ? 0 : Infinity,
                  delay: i * 0.05,
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>

        {/* Copy hint on hover */}
        <AnimatePresence>
          {isRevealed && !isCopied && (
            <motion.span
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-muted whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              CLICK TO COPY
            </motion.span>
          )}
        </AnimatePresence>

        {/* Flash effect on button */}
        <AnimatePresence>
          {isCopied && (
            <motion.div
              className="absolute inset-0 bg-accent pointer-events-none"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Corner decorations */}
        <motion.div
          className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      {/* Anti-bot protection message */}
      <motion.p
        className="mt-2 text-xs font-mono text-muted/50 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        HOVER TO REVEAL
      </motion.p>

      {/* Custom Toast - Global positioning */}
      <AnimatePresence>
        {isCopied && (
          <motion.div
            className="fixed top-8 right-8 z-9999 pointer-events-none"
            initial={{ opacity: 0, x: 100, rotateY: -90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            {/* Glow background */}
            <motion.div
              className="absolute -inset-4 bg-accent/20 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main toast card */}
            <div className="relative bg-background border-2 border-accent shadow-2xl overflow-hidden min-w-[300px]">
              {/* Scanline effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, #ff4d00 2px, #ff4d00 4px)",
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Animated border glow */}
              <motion.div
                className="absolute -inset-[2px] opacity-50"
                style={{
                  background:
                    "conic-gradient(from 0deg, #ff4d00, transparent, #ff4d00)",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="absolute inset-0 bg-background" />

              {/* Content */}
              <div className="relative p-5 flex items-center gap-4">
                {/* Icon with rotation */}
                <motion.div
                  className="shrink-0"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                >
                  <div className="w-12 h-12 border-2 border-accent flex items-center justify-center relative">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 bg-accent" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-accent" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-accent" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-accent" />

                    {/* Checkmark */}
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <motion.path
                        d="M5 13l4 4L19 7"
                        fill="none"
                        stroke="#ff4d00"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>
                </motion.div>

                {/* Text content */}
                <div className="flex-1 space-y-1">
                  <motion.div
                    className="font-mono text-sm font-bold text-accent tracking-wider"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    EMAIL COPIED
                  </motion.div>
                  <motion.div
                    className="font-mono text-xs text-muted"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Ready to paste
                  </motion.div>
                </div>

                {/* Progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-accent origin-left"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 2, ease: "linear" }}
                />
              </div>

              {/* Glitch effect overlay */}
              <motion.div
                className="absolute inset-0 bg-accent mix-blend-screen pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.2, 0, 0.3, 0],
                  x: [0, -2, 2, -2, 0],
                }}
                transition={{
                  duration: 0.4,
                  times: [0, 0.2, 0.4, 0.6, 1],
                }}
              />

              {/* Particle burst from icon */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-accent rounded-full"
                  style={{
                    left: "70px",
                    top: "35px",
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 60,
                    y: Math.sin((i / 12) * Math.PI * 2) * 60,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: i * 0.02,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
