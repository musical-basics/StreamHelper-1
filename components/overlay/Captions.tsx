"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStreamStore } from "@/store/useStreamStore";

export default function Captions() {
  const captions = useStreamStore((s) => s.captions);

  return (
    <div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] flex flex-col items-center gap-2 z-10"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {captions.map((caption) => (
          <motion.p
            key={caption.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-white text-2xl font-semibold text-center leading-snug tracking-wide px-4"
            style={{
              textShadow:
                "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7), 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
            }}
          >
            {caption.text}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}
