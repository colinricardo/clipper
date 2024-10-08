import { VideoFormData } from "@/components/video/types";
import { FFmpeg } from "@ffmpeg/ffmpeg";

export default async (
  formData: VideoFormData,
  ffmpeg: FFmpeg
): Promise<Blob> => {
  const { url, startTime, endTime } = formData;

  const response = await fetch("/api/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to download video");
  }

  const videoBlob = await response.blob();
  const videoArrayBuffer = await videoBlob.arrayBuffer();

  await ffmpeg.writeFile("input.mp4", new Uint8Array(videoArrayBuffer));

  const clipDuration = parseFloat(endTime) - parseFloat(startTime);

  await ffmpeg.exec([
    "-ss",
    startTime,
    "-i",
    "input.mp4",
    "-t",
    clipDuration.toString(),
    "-c",
    "copy",
    "output.mp4",
  ]);

  const data = await ffmpeg.readFile("output.mp4");
  const buffer = new Uint8Array(data as ArrayBuffer);
  return new Blob([buffer], { type: "video/mp4" });
};
