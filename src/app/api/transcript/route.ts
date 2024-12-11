// app/api/transcript/route.ts
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(request: Request) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const formattedTranscript = transcript.map((t) => t.text);

    return NextResponse.json(
      { transcript: formattedTranscript },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Transcript fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
