import { NextRequest, NextResponse } from "next/server";

// POST /api/tts
// Accepts: { text: string }
// Calls ElevenLabs and returns Base64 audio
export async function POST(req: NextRequest) {
  let body: { text?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body?.text;
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json(
      { error: "Missing or empty 'text' field" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID must be configured" },
      { status: 500 }
    );
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: text.trim(),
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json(
      { error: `ElevenLabs API error: ${errorText}` },
      { status: res.status }
    );
  }

  const audioBuffer = await res.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");

  return NextResponse.json({ audioPayload: base64Audio });
}
