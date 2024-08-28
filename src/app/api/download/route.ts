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
    const videoInfo = await ytdl.getInfo(videoId, { agent });
    const format = ytdl.chooseFormat(videoInfo.formats, { quality: "highest" });

    const videoStream = ytdl(url, { format, agent });
    const chunks: Uint8Array[] = [];

    for await (const chunk of videoStream) {
      chunks.push(chunk);
    }

    const videoBuffer = Buffer.concat(chunks);

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${
          videoInfo.videoDetails.title || `video_${videoId}`
        }.mp4"`,
      },
    });
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the video" },
      { status: 500 }
    );
  }
}
