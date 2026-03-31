import { NextRequest, NextResponse } from "next/server";
import { parseIntent } from "@/lib/intentParser";

// POST /api/transcribe
// Accepts: { text: string }
// Emits TRANSCRIPTION event to PartyKit, and INTENT event if detected
export async function POST(req: NextRequest) {
  let body: { text?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body?.text;
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Missing or empty 'text' field" }, { status: 400 });
  }

  const partykitHost = process.env.NEXT_PUBLIC_PARTYKIT_HOST;
  if (!partykitHost) {
    return NextResponse.json({ error: "NEXT_PUBLIC_PARTYKIT_HOST not configured" }, { status: 500 });
  }

  const emittedEvents: string[] = [];

  // Emit TRANSCRIPTION event
  const transcriptionEvent = {
    type: "TRANSCRIPTION",
    text: text.trim(),
    timestamp: Date.now(),
  };

  await emitToPartyKit(partykitHost, transcriptionEvent);
  emittedEvents.push("TRANSCRIPTION");

  // Check for intent
  const intent = parseIntent(text);
  if (intent.detected && intent.pieceName) {
    const intentEvent = {
      type: "INTENT",
      pieceName: intent.pieceName,
      rawText: text.trim(),
      timestamp: Date.now(),
    };
    await emitToPartyKit(partykitHost, intentEvent);
    emittedEvents.push("INTENT");
  }

  return NextResponse.json({
    success: true,
    emitted: emittedEvents,
    intent: intent.detected ? { pieceName: intent.pieceName } : null,
  });
}

async function emitToPartyKit(host: string, event: object): Promise<void> {
  // PartyKit REST API: POST /parties/:name/:roomId
  const url = `https://${host}/parties/main/streamhelper`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
}
