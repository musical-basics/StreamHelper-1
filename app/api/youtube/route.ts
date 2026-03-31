import { NextResponse } from "next/server";

interface YoutubeChatMessage {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  message: string;
  publishedAt: string;
}

interface YoutubeApiItem {
  id: string;
  authorDetails: {
    displayName: string;
    profileImageUrl: string;
  };
  snippet: {
    displayMessage: string;
    publishedAt: string;
  };
}

interface YoutubeApiResponse {
  items?: YoutubeApiItem[];
  error?: { message: string };
}

// GET /api/youtube
// Returns recent live chat messages
export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const liveChatId = process.env.YOUTUBE_LIVE_CHAT_ID;

  if (!apiKey || !liveChatId) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY and YOUTUBE_LIVE_CHAT_ID must be configured" },
      { status: 500 }
    );
  }

  const url = new URL(
    "https://www.googleapis.com/youtube/v3/liveChat/messages"
  );
  url.searchParams.set("liveChatId", liveChatId);
  url.searchParams.set("part", "snippet,authorDetails");
  url.searchParams.set("maxResults", "20");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json(
      { error: `YouTube API error: ${errorText}` },
      { status: res.status }
    );
  }

  const data: YoutubeApiResponse = await res.json();

  if (data.error) {
    return NextResponse.json(
      { error: data.error.message },
      { status: 400 }
    );
  }

  const messages: YoutubeChatMessage[] = (data.items ?? []).map((item) => ({
    id: item.id,
    authorDisplayName: item.authorDetails.displayName,
    authorProfileImageUrl: item.authorDetails.profileImageUrl,
    message: item.snippet.displayMessage,
    publishedAt: item.snippet.publishedAt,
  }));

  return NextResponse.json({ messages });
}
