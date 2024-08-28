import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { url } = await req.json();
    const cookies = req.headers.get("cookie") || "";

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          cookie: cookies,
        },
      },
    });

    const lengthSeconds = parseInt(info.videoDetails.lengthSeconds);

    return NextResponse.json(
      { duration: lengthSeconds },
      {
        headers: {
          "Set-Cookie": cookies,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching video info:", error);
    return NextResponse.json(
      { error: "Failed to fetch video info" },
      { status: 500 }
    );
  }
};
