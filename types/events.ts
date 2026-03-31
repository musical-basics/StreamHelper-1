// Strict TypeScript interfaces for all PartyKit socket payloads

export type EventType = "TRANSCRIPTION" | "INTENT" | "TTS" | "APPLAUSE";

export interface BaseEvent {
  type: EventType;
  timestamp: number;
}

export interface TranscriptionEvent extends BaseEvent {
  type: "TRANSCRIPTION";
  text: string;
}

export interface IntentEvent extends BaseEvent {
  type: "INTENT";
  pieceName: string;
  rawText: string;
}

export interface TTSEvent extends BaseEvent {
  type: "TTS";
  audioPayload: string; // Base64 encoded audio
  username: string;
  text: string;
  avatarUrl?: string;
}

export interface ApplauseEvent extends BaseEvent {
  type: "APPLAUSE";
}

export type OverlayEvent =
  | TranscriptionEvent
  | IntentEvent
  | TTSEvent
  | ApplauseEvent;
