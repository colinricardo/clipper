import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  try {
    const videoId = ytdl.getVideoID(url);
    const videoInfo = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(videoInfo.formats, { quality: "highest" });

    const videoStream = ytdl(url, { format: format });
    const chunks: Uint8Array[] = [];

    for await (const chunk of videoStream) {
      chunks.push(chunk);
    }

    const videoBuffer = Buffer.concat(chunks);

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="video_${videoId}.mp4"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while downloading the video" },
      { status: 500 }
    );
  }
}
