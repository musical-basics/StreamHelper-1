"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useStreamStore } from "@/store/useStreamStore";

export default function ChatPopup() {
  const activeTTS = useStreamStore((s) => s.activeTTS);
  const setActiveTTS = useStreamStore((s) => s.setActiveTTS);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!activeTTS) return;

    // Create audio element from Base64 payload
    const audio = new Audio(
      `data:audio/mpeg;base64,${activeTTS.audioPayload}`
    );
    audioRef.current = audio;

    audio.play().catch((err) =>
      console.error("[ChatPopup] Audio play failed:", err)
    );

    // Dismiss when audio finishes
    audio.addEventListener("ended", () => setActiveTTS(null));

    return () => {
      audio.pause();
      audio.removeEventListener("ended", () => setActiveTTS(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTTS?.timestamp]);

  return (
    <div className="absolute left-8 bottom-32 z-20 pointer-events-none w-[320px]">
      <AnimatePresence>
        {activeTTS && (
          <motion.div
            key={activeTTS.timestamp}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="flex items-start gap-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3"
          >
            {activeTTS.avatarUrl && (
              <Image
                src={activeTTS.avatarUrl}
                alt={activeTTS.username}
                width={36}
                height={36}
                className="rounded-full shrink-0 mt-0.5"
              />
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-blue-400">
                {activeTTS.username}
              </span>
              <span
                className="text-sm text-white leading-snug"
                style={{
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}
              >
                {activeTTS.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
