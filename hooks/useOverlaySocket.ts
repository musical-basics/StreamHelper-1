"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import PartySocket from "partysocket";
import type { OverlayEvent } from "@/types/events";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface UseOverlaySocketOptions {
  onMessage?: (event: OverlayEvent) => void;
}

export function useOverlaySocket({ onMessage }: UseOverlaySocketOptions = {}) {
  const socketRef = useRef<PartySocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST;
    if (!host) {
      console.warn("[useOverlaySocket] NEXT_PUBLIC_PARTYKIT_HOST is not set");
      setStatus("disconnected");
      return;
    }

    const socket = new PartySocket({
      host,
      room: "streamhelper",
    });

    socket.addEventListener("open", () => setStatus("connected"));
    socket.addEventListener("close", () => setStatus("disconnected"));
    socket.addEventListener("error", () => setStatus("disconnected"));

    socket.addEventListener("message", (evt) => {
      try {
        const data = JSON.parse(evt.data) as OverlayEvent;
        onMessage?.(data);
      } catch (err) {
        console.error("[useOverlaySocket] Failed to parse message", err);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = useCallback((event: OverlayEvent) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(event));
    } else {
      console.warn("[useOverlaySocket] Socket not open, cannot emit");
    }
  }, []);

  return { emit, status };
}
