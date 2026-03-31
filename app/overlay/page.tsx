"use client";

import { useEffect } from "react";
import { useOverlaySocket } from "@/hooks/useOverlaySocket";
import { useStreamStore } from "@/store/useStreamStore";
import type { OverlayEvent } from "@/types/events";

export default function OverlayPage() {
  const { addCaption, setCurrentPiece, setActiveTTS, setIsApplauding } =
    useStreamStore();

  useOverlaySocket({
    onMessage: (event: OverlayEvent) => {
      switch (event.type) {
        case "TRANSCRIPTION":
          addCaption(event.text);
          break;
        case "INTENT":
          setCurrentPiece(event.pieceName);
          break;
        case "TTS":
          setActiveTTS(event);
          break;
        case "APPLAUSE":
          setIsApplauding(true);
          setTimeout(() => setIsApplauding(false), 4000);
          break;
      }
    },
  });

  return (
    // overlay-root class triggers the transparent background CSS rule
    <div className="overlay-root w-screen h-screen overflow-hidden relative">
      {/* Overlay components mounted here in later phases with absolute positioning */}
      {/* Phase 4: Captions + NowPlaying */}
      {/* Phase 5: ChatPopup */}
      {/* Phase 6: ApplauseEffect */}
    </div>
  );
}
