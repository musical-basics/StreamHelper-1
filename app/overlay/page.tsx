"use client";

import { useOverlaySocket } from "@/hooks/useOverlaySocket";
import { useStreamStore } from "@/store/useStreamStore";
import type { OverlayEvent } from "@/types/events";
import Captions from "@/components/overlay/Captions";
import NowPlaying from "@/components/overlay/NowPlaying";
import ChatPopup from "@/components/overlay/ChatPopup";

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
      {/* Phase 4: Captions (z-10, bottom-center) + NowPlaying (z-10, top-right) */}
      <Captions />
      <NowPlaying />
      <ChatPopup />
      {/* Phase 6: ApplauseEffect */}
    </div>
  );
}
