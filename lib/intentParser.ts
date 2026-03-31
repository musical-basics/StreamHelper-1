/**
 * Intent parser: detects "now playing" / "going to play" phrases
 * in incoming transcription text and extracts the piece name.
 */

export interface IntentResult {
  detected: boolean;
  pieceName?: string;
}

// Patterns that indicate a "now playing" intent
const INTENT_PATTERNS = [
  /(?:now\s+(?:we(?:'re|re)?\s+)?playing|playing\s+now|let(?:'s|s)\s+play|going\s+to\s+play|about\s+to\s+play|next\s+(?:up\s+(?:is\s+)?)?(?:we\s+have\s+)?(?:I(?:'ll|ll)\s+play\s+)?(?:is\s+)?)\s+(.+?)(?:\.|,|$)/i,
  /(?:this\s+(?:piece\s+)?(?:is|will\s+be)|piece\s+is)\s+called\s+(.+?)(?:\.|,|$)/i,
  /(?:ok(?:ay)?(?:,|!)?\s+)?(?:so\s+)?(?:now|next)?\s*[,\s]*(?:I(?:'m|m)\s+going\s+to\s+play|I(?:'ll|ll)\s+play|let\s+me\s+play)\s+(.+?)(?:\.|,|$)/i,
];

/**
 * Parses a text buffer for intent triggers.
 * Returns the detected piece name if found.
 */
export function parseIntent(text: string): IntentResult {
  for (const pattern of INTENT_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const pieceName = match[1].trim().replace(/['"]/g, "");
      if (pieceName.split(" ").length <= 8) {
        // Sanity-check: piece names should be short
        return { detected: true, pieceName };
      }
    }
  }
  return { detected: false };
}
