import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, cookies } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const agent = ytdl.createAgent(cookies);

    const videoId = ytdl.getVideoID(url);
    const videoInfo = await ytdl.getBasicInfo(videoId, { agent });

    const lengthSeconds = parseInt(videoInfo.videoDetails.lengthSeconds);

    return NextResponse.json({
      duration: lengthSeconds,
      title: videoInfo.videoDetails.title,
      description: videoInfo.videoDetails.description,
    });
  } catch (error) {
    console.error("Error fetching video info:", error);
    return NextResponse.json(
      { error: "Failed to fetch video info" },
      { status: 500 }
    );
  }
}
