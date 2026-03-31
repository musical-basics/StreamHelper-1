import { create } from "zustand";
import type { TTSEvent } from "@/types/events";

export interface Caption {
  id: string;
  text: string;
  timestamp: number;
}

interface StreamStore {
  // Transient overlay states
  captions: Caption[];
  currentPiece: string;
  activeTTS: TTSEvent | null;
  isApplauding: boolean;

  // Actions
  addCaption: (text: string) => void;
  setCurrentPiece: (piece: string) => void;
  setActiveTTS: (tts: TTSEvent | null) => void;
  setIsApplauding: (value: boolean) => void;
}

export const useStreamStore = create<StreamStore>((set) => ({
  captions: [],
  currentPiece: "",
  activeTTS: null,
  isApplauding: false,

  addCaption: (text) =>
    set((state) => {
      const newCaption: Caption = {
        id: crypto.randomUUID(),
        text,
        timestamp: Date.now(),
      };
      // Keep last 2 captions
      const captions = [...state.captions, newCaption].slice(-2);
      return { captions };
    }),

  setCurrentPiece: (piece) => set({ currentPiece: piece }),

  setActiveTTS: (tts) => set({ activeTTS: tts }),

  setIsApplauding: (value) => set({ isApplauding: value }),
}));
