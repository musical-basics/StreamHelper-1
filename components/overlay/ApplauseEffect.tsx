"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStreamStore } from "@/store/useStreamStore";

const CONFETTI_COUNT = 40;

const COLORS = [
  "#f87171", "#fb923c", "#facc15", "#4ade80",
  "#34d399", "#38bdf8", "#818cf8", "#e879f9",
];

function Confetti() {
  return (
    <>
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 2 + Math.random() * 1.5;
        const size = 8 + Math.random() * 8;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const rotate = Math.random() * 720 - 360;

        return (
          <motion.div
            key={i}
            initial={{ y: "100vh", x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: "-20vh", x: (Math.random() - 0.5) * 200, opacity: 0, rotate }}
            transition={{ duration, delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: `${left}%`,
              bottom: 0,
              width: size,
              height: size,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              backgroundColor: color,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
}

export default function ApplauseEffect() {
  const isApplauding = useStreamStore((s) => s.isApplauding);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isApplauding) return;

    const audio = new Audio("/applause.mp3");
    audioRef.current = audio;
    audio.play().catch((err) =>
      console.error("[ApplauseEffect] Audio play failed:", err)
    );

    return () => {
      audio.pause();
    };
  }, [isApplauding]);

  return (
    <AnimatePresence>
      {isApplauding && (
        <motion.div
          key="applause"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
        >
          <Confetti />
          {/* Central applause badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl select-none"
            style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.6))" }}
          >
            👏
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
