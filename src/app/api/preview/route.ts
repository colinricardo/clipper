import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const lengthSeconds = parseInt(info.videoDetails.lengthSeconds);

    return NextResponse.json({ duration: lengthSeconds });
  } catch (error) {
    console.error("Error fetching video info:", error);
    return NextResponse.json(
      { error: "Failed to fetch video info" },
      { status: 500 }
    );
  }
}
