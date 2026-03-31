"use client";

import { useOverlaySocket } from "@/hooks/useOverlaySocket";
import { useStreamStore } from "@/store/useStreamStore";
import type { OverlayEvent } from "@/types/events";
import ChatFeed from "@/components/dashboard/ChatFeed";

function ConnectionStatus({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          status === "connected"
            ? "bg-green-500"
            : status === "connecting"
            ? "bg-yellow-500 animate-pulse"
            : "bg-red-500"
        }`}
      />
      <span className="text-xs text-zinc-400 capitalize">{status}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { captions, currentPiece } = useStreamStore();

  const { status } = useOverlaySocket({
    onMessage: (event: OverlayEvent) => {
      // Dashboard listens to incoming events for display purposes
      console.log("[Dashboard] Received event:", event);
    },
  });

  return (
    <div className="p-6 h-[calc(100vh-57px)] grid grid-cols-3 gap-4">
      {/* Panel 1: Transcription Log */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-300">Transcription Log</h2>
          <ConnectionStatus status={status} />
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {captions.length === 0 ? (
            <p className="text-zinc-600 text-sm italic">
              Waiting for transcription…
            </p>
          ) : (
            captions.map((c) => (
              <p key={c.id} className="text-sm text-zinc-300 leading-relaxed">
                {c.text}
              </p>
            ))
          )}
        </div>
        {currentPiece && (
          <div className="px-4 py-2 border-t border-zinc-800 bg-blue-950">
            <p className="text-xs text-blue-400">
              Now Playing: <span className="font-semibold text-blue-200">{currentPiece}</span>
            </p>
          </div>
        )}
      </section>

      {/* Panel 2: YouTube Chat Feed */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-300">YouTube Chat Feed</h2>
        </div>
        <ChatFeed />
      </section>

      {/* Panel 3: Quick Actions (placeholder — expanded in Phase 6) */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-300">Quick Actions</h2>
        </div>
        <div className="flex-1 p-4">
          <p className="text-zinc-600 text-sm italic">
            Actions added in Phase 6…
          </p>
        </div>
      </section>
    </div>
  );
}
