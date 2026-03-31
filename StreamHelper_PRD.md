
cool so i stream mysel fplaying piano online and i wanna create an overlay that does these 3 things:



1) it does an instant (or some slight lag is fine) streaming vocie transcription of my voice (like the captions u see on a TV, but in better format). and it looks for moments when i say something like "Ok now we're playing (Fur Elise)" and it intelligently picks up that last phrase as the "Now Playing Piece!" which. in the meantime it shows like the last 1-2 sentences I said into the microphone.



2) I want it connected to the YT chat and via a control interface (let's just say browser based for now) I wanna be able to click on a chat from my audience, and have it play back via AI. bcuz rn im reading really good chats and it feels weird, instead have an AI (preferably a woman) read chats for both myself and the stream and i can respond to them. same goes for superchats.



3) a simple button on the same control interface that lets me click the button "Applause" and then a pre-saved clapping sound effect comes out + a fancy animation over the screen.



and i can set up these elements via a self-hosted dashboard where i can see a 16:9 view of the elements on the screen (which should dynamically adjust based on how large the screen is) and i can just drag this as an overlay in browser source. 



I'm comfortable vibe coding and have done lots of nextjs, vercel, railway, supabase, neon, etc. im comfortable even doing webgl animations (and in fact for phase 2 i wanna do live Vexflow sheet music rendering of my MIDI playing (but not measure based as that's too hard, just floating notes in the air), which is ofc a more difficult challenge). 


The Architecture
The Engine (Next.js): Two main routes. /dashboard (your control center) and /overlay (the transparent background page you put into OBS).

The Bridge (WebSockets): You need real-time communication between the dashboard and the overlay. Since you're using Next.js/Vercel, standard WebSockets can be annoying. Use PartyKit (or a simple Socket.io server deployed on Railway) to broadcast events from the dashboard to the OBS source instantly.

Transcription & Intent: You should absolutely route your audio through a local WhisperKit implementation. You already know how to handle offline dictation with it, so this gives you zero-latency, free captions. Pipe that text stream into the dashboard. Have a lightweight script watch the transcription buffer for regex triggers (e.g., "now playing", "we're going to play") and automatically extract the next few words, broadcasting the update to the overlay.

YouTube Chat & TTS: Fetch the live chat via the YouTube Live Streaming API to populate a list on your dashboard. When you click a message, send the text to the ElevenLabs API (their low-latency WebSockets are best for streaming, and their female voices are incredibly natural), then broadcast the resulting audio URL and chat data to the /overlay to play the sound and show the visual.


Project Context:
We are building a live streaming overlay system for my piano broadcasts. The stack is Next.js (App Router), TailwindCSS, and a real-time WebSocket solution (implement PartyKit or a basic Socket.io server, whichever is cleaner for our Vercel/Railway deployment).

The app consists of two primary views:

app/dashboard/page.tsx: A private control interface I will use on a second monitor.

app/overlay/page.tsx: A transparent UI with a 16:9 aspect ratio designed to be loaded as a Browser Source in OBS.

Core Objectives & Tasks:

Task 1: WebSocket Infrastructure & State Management

Set up the WebSocket bridge between the dashboard and the overlay.

Create a global Zustand store if necessary, but prioritize passing real-time events (captions, sounds, TTS) via the socket so the overlay reacts instantly to dashboard commands.

Task 2: Voice Transcription & Intent Pipeline

Create a pipeline to receive local transcription text (assume I am piping local Whisper transcription strings to an endpoint/socket).

Display a rolling feed of these captions on the /overlay.

Implement an "Intent Detector" function. It should monitor the incoming caption string buffer. If it detects phrases like "now playing" or "going to play", it should parse the subsequent phrase, update a "Now Playing" state, and trigger a visual change on the overlay to display the current piece.

Task 3: YouTube Chat to TTS Integration

Build a component on the /dashboard to fetch and poll messages from the YouTube Data API v3 (LiveChatMessages).

Render these as a clickable list.

When a chat is clicked, send the text to the ElevenLabs API (use a high-quality female voice model).

Once the TTS audio is generated, emit a socket event to the /overlay with the audio data/URL and the user's chat details. The overlay should play the audio and display a temporary visual graphic of the chat.

Task 4: The Applause Button

Add a prominent button on the /dashboard labeled "Applause".

Clicking it emits an event to the /overlay.

The /overlay must play a stored applause.mp3 file and trigger a celebratory visual animation (use Framer Motion for a smooth graphic overlay, like confetti or glowing text).

Development Rules:

Do not build a complex drag-and-drop WYSIWYG spatial editor for the dashboard yet. Focus on the control mechanics. The overlay layout can be strictly defined via Tailwind/CSS Grid for now.

Prioritize modularity. I will handle API keys for YT and ElevenLabs via environment variables.

Draft the foundational Next.js routing, the WebSocket integration layer, and the TTS fetching utility first.