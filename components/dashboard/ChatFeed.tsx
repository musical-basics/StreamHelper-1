"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useStreamStore } from "@/store/useStreamStore";
import { useOverlaySocket } from "@/hooks/useOverlaySocket";
import type { TTSEvent } from "@/types/events";

interface ChatMessage {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  message: string;
  publishedAt: string;
}

export default function ChatFeed() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { emit } = useOverlaySocket();
  const setActiveTTS = useStreamStore((s) => s.setActiveTTS);

  // Poll YouTube chat every 5 seconds
  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await fetch("/api/youtube");
        if (!res.ok) return;
        const data: { messages?: ChatMessage[] } = await res.json();
        if (data.messages?.length) {
          setMessages(data.messages);
        }
      } catch {
        // Network errors are non-fatal; just wait for next poll
      }
    }

    fetchChat();
    const interval = setInterval(fetchChat, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleTTS(msg: ChatMessage) {
    if (loadingId) return;
    setLoadingId(msg.id);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: msg.message }),
      });

      if (!res.ok) {
        console.error("[ChatFeed] TTS request failed");
        return;
      }

      const data: { audioPayload?: string } = await res.json();
      if (!data.audioPayload) return;

      const ttsEvent: TTSEvent = {
        type: "TTS",
        audioPayload: data.audioPayload,
        username: msg.authorDisplayName,
        text: msg.message,
        avatarUrl: msg.authorProfileImageUrl,
        timestamp: Date.now(),
      };

      // Update local store and broadcast to overlay
      setActiveTTS(ttsEvent);
      emit(ttsEvent);
    } catch (err) {
      console.error("[ChatFeed] TTS error:", err);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      {messages.length === 0 ? (
        <p className="text-zinc-600 text-sm italic">
          No chat messages yet…
        </p>
      ) : (
        messages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => handleTTS(msg)}
            disabled={loadingId === msg.id}
            className="flex items-start gap-3 w-full text-left rounded-lg px-3 py-2 hover:bg-zinc-800 transition-colors group disabled:opacity-60"
          >
            {msg.authorProfileImageUrl && (
              <Image
                src={msg.authorProfileImageUrl}
                alt={msg.authorDisplayName}
                width={28}
                height={28}
                className="rounded-full shrink-0 mt-0.5"
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-blue-400 truncate block">
                {msg.authorDisplayName}
              </span>
              <span className="text-sm text-zinc-300 leading-snug break-words">
                {msg.message}
              </span>
            </div>
            <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 shrink-0 mt-1">
              {loadingId === msg.id ? "…" : "▶ TTS"}
            </span>
          </button>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
