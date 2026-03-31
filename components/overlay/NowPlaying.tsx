"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Music } from "lucide-react";
import { useStreamStore } from "@/store/useStreamStore";

export default function NowPlaying() {
  const currentPiece = useStreamStore((s) => s.currentPiece);

  return (
    <div className="absolute top-6 right-6 z-10 pointer-events-none">
      <AnimatePresence>
        {currentPiece && (
          <motion.div
            key={currentPiece}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center gap-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 max-w-xs"
          >
            <Music className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                Now Playing
              </span>
              <span
                className="text-white text-sm font-semibold leading-tight truncate"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                {currentPiece}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
