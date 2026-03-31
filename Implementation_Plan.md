Here is a comprehensive 30-step execution plan tailored perfectly for an AI coding agent (like Cursor, Cline, or Devin).

It organizes the build chronologically: handling foundational plumbing and real-time sockets first, building the UI shells, and then tackling the features one by one.

You can copy and paste the prompt block and the 30 steps directly into your agent's chat.

🤖 Prompt for your AI Agent
"Attached is my StreamHelper_PRD.md. I want to build this application. We will strictly follow the 30-step execution plan below. Please work phase-by-phase. Do not proceed to the next phase until I review and approve the current one. Focus on core mechanics and real-time functionality before complex styling. Use Tailwind and CSS Grid for layouts. Let's begin Phase 1."

📋 The 30-Step Execution Plan
Phase 1: Project Initialization & Foundation
1. Initialize a new Next.js App Router project with TypeScript, Tailwind CSS, and ESLint. Clean up the default boilerplate in app/page.tsx and app/globals.css.
2. Install core dependencies: framer-motion (animations), zustand (client state), and lucide-react (icons).
3. Install WebSocket dependencies: partykit and partysocket for the real-time bridge.
4. Create a .env.local template with empty placeholders for YOUTUBE_API_KEY, YOUTUBE_LIVE_CHAT_ID, ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, and NEXT_PUBLIC_PARTYKIT_HOST.
5. Configure app/globals.css to ensure a completely transparent background specifically for the /overlay route (e.g., body:has(.overlay-root) { background: transparent !important; }), which is critical for OBS Browser Sources.

Phase 2: WebSocket Bridge Setup (PartyKit)
6. Initialize the PartyKit server in a party/server.ts file at the root.
7. Define strict TypeScript interfaces for socket payloads in types/events.ts: TranscriptionEvent, IntentEvent, TTSEvent, and ApplauseEvent.
8. Implement the PartyKit server onMessage logic to act as a simple broadcaster: any message received from a client or API should be instantly broadcasted to all connected clients.
9. Create a custom React hook hooks/useOverlaySocket.ts using partysocket to manage room connection, emit messages, and listen to incoming broadcasts.
10. Create a global Zustand store (store/useStreamStore.ts) to manage transient overlay states: captions (array), currentPiece (string), activeTTS (object), and isApplauding (boolean).

Phase 3: The Dashboard & Overlay Shells
11. Scaffold the Dashboard routes (app/dashboard/layout.tsx and page.tsx). Build a Tailwind CSS Grid layout dividing the screen into three panels: Transcription Log, YouTube Chat Feed, and Quick Actions.
12. Scaffold the Overlay routes (app/overlay/layout.tsx and page.tsx). Set a strict 16:9 aspect ratio container (w-screen h-screen overflow-hidden relative overlay-root).
13. Add a WebSocket connection status indicator (a small green/red dot) to the Dashboard UI using the useOverlaySocket hook to verify the publisher connection to PartyKit.
14. Set up the base WebSocket listener inside app/overlay/page.tsx that catches incoming events and updates the corresponding values in the Zustand store.

Phase 4: Feature 1 - Transcription & Intent
15. Create a Next.js API route app/api/transcribe/route.ts (POST) designed to receive local Whisper transcription strings piped from the user's local machine.
16. Write a regex-based intent parser lib/intentParser.ts to detect phrases like "now playing [piece]" or "going to play [piece]" and extract the piece name from a text buffer.
17. Update /api/transcribe to immediately emit a TRANSCRIPTION socket event to PartyKit. Run the text through the intent parser; if a piece is detected, emit an INTENT socket event with the extracted name.
18. Build components/overlay/Captions.tsx. Subscribe it to the Zustand store. Display a rolling feed of the last 1-2 sentences at the bottom center of the screen, using Framer Motion for smooth entry/exit and heavy text-shadow for readability.
19. Build components/overlay/NowPlaying.tsx. Subscribe it to the Zustand store. Animate a sleek "Now Playing: [Piece]" graphic sliding into the top right corner when an INTENT event fires.

Phase 5: Feature 2 - YouTube Chat & TTS
20. Create an API route app/api/youtube/route.ts (GET) to fetch recent chat messages from the YouTube Data API v3 (liveChatMessages.list) using the .env Chat ID.
21. Build components/dashboard/ChatFeed.tsx. Implement a polling interval (e.g., setInterval or SWR) to fetch from /api/youtube every 5 seconds, displaying chats in a scrollable flex column.
22. Create an API route app/api/tts/route.ts (POST) to accept a text payload, securely call the ElevenLabs API using the female voice ID, and return the generated audio as a Base64 string.
23. Make the chat messages in ChatFeed.tsx clickable buttons. On click, set a localized loading state and POST the chat text to /api/tts.
24. Upon receiving the Base64 audio response in the dashboard, emit a TTS socket event containing the audioPayload, username, text, and avatarUrl.
25. Build components/overlay/ChatPopup.tsx on the overlay. When the Zustand store registers a TTS event, use Framer Motion to slide in a stylized chat bubble on the left side of the screen.
26. Implement an HTML5 <audio> element inside ChatPopup.tsx that auto-plays the received Base64 audio. Bind the Framer Motion exit animation to the audio element's onEnded event so the visual disappears exactly when the AI voice finishes speaking.

Phase 6: Feature 3 - Applause & Final Polish
27. Add a prominent "Applause 👏" button to the Quick Actions panel in the dashboard.
28. Configure the Applause button to emit an APPLAUSE socket event when clicked.
29. Build components/overlay/ApplauseEffect.tsx. Add a placeholder applause.mp3 file to the /public directory. On event trigger, play the audio natively and render a celebratory Framer Motion visual (e.g., floating confetti) that unmounts after exactly 4 seconds.
30. Perform final spatial assembly in app/overlay/page.tsx. Mount all overlay components using strict absolute positioning and varying z-indexes to guarantee nothing overlaps on the 16:9 canvas. Update package.json with a dev script (e.g., npm-run-all) to run Next.js and PartyKit concurrently.