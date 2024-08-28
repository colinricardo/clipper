"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { VideoFormData } from "@/components/video/types";
import useFFmpeg from "@/components/video/use-ffmpeg";
import { errorToast } from "@/frontend/lib/toast";
import { IdPrefix, randomId } from "@/frontend/utils/ids";
import { useCallback, useEffect, useState } from "react";

export default () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [outputVideoUrl, setOutputVideoUrl] = useState("");
  const ffmpeg = useFFmpeg();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [clipDuration, setClipDuration] = useState(0);

  const handleSubmit = async (formData: VideoFormData): Promise<void> => {
    if (!ffmpeg) {
      errorToast("FFmpeg not initialized");
      return;
    }

    setLoading(true);
    setOutputVideoUrl("");

    try {
      console.log("Starting video processing...");

      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download video");
      }

      console.log("Video downloaded successfully");
      const videoBlob = await response.blob();
      const videoArrayBuffer = await videoBlob.arrayBuffer();

      console.log("Writing file to FFmpeg...");
      await ffmpeg.writeFile("input.mp4", new Uint8Array(videoArrayBuffer));

      console.log("Executing FFmpeg command...");
      const clipDuration =
        parseFloat(formData.endTime) - parseFloat(formData.startTime);
      await ffmpeg.exec([
        "-ss",
        formData.startTime,
        "-i",
        "input.mp4",
        "-t",
        clipDuration.toString(),
        "-c",
        "copy",
        "output.mp4",
      ]);

      console.log("FFmpeg command executed successfully");
      const data = await ffmpeg.readFile("output.mp4");
      const uint8Array = new Uint8Array(data as ArrayBuffer);
      const clipBlob = new Blob([uint8Array], { type: "video/mp4" });
      const clipUrl = URL.createObjectURL(clipBlob);
      setOutputVideoUrl(clipUrl);
      console.log("Video processing completed");
    } catch (err) {
      console.error("Error during video processing:", err);
      errorToast(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while processing the video."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setVideoUrl(newUrl);

    // Extract video ID and fetch duration when URL changes
    const id = extractVideoId(newUrl);
    if (id) {
      setVideoId(id);
      fetchVideoDuration(newUrl);
    } else {
      setVideoId("");
      setDuration(0);
      setStartTime(0);
      setEndTime(0);
    }
  };

  const handleDownload = () => {
    if (outputVideoUrl) {
      const fileId = randomId({ prefix: IdPrefix.Clip });
      const fileName = `${fileId}.mp4`;
      const a = document.createElement("a");
      a.href = outputVideoUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleStartTimeChange = (value: number[]) => {
    setStartTime(Math.min(value[0], endTime));
  };

  const handleEndTimeChange = (value: number[]) => {
    setEndTime(Math.max(value[0], startTime));
  };

  const handleStartTimeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStartTime = Math.max(0, Math.min(Number(e.target.value), endTime));
    setStartTime(newStartTime);
  };

  const handleEndTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = Math.min(
      duration,
      Math.max(Number(e.target.value), startTime)
    );
    setEndTime(newEndTime);
  };

  const handleClip = () => {
    handleSubmit({
      url: videoUrl,
      startTime: startTime.toFixed(2),
      endTime: endTime.toFixed(2),
    });
  };

  const fetchVideoDuration = useCallback(async (url: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch video duration");
      }

      const data = await response.json();
      setDuration(data.duration);
      setEndTime(data.duration);
    } catch (error) {
      console.error("Error fetching video duration:", error);
      errorToast("Failed to fetch video duration");
    } finally {
      setLoading(false);
    }
  }, []);

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    setClipDuration(endTime - startTime);
  }, [startTime, endTime]);

  return (
    <div className="container max-w-3xl mx-auto px-4 space-y-8">
      {/* Input at the top */}
      <div>
        <Label htmlFor="url">YouTube URL</Label>
        <Input
          type="text"
          id="url"
          value={videoUrl}
          onChange={handleUrlChange}
          required
        />
      </div>

      {/* Video Preview */}
      <div className="w-full space-y-8">
        <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
        <div className="w-full aspect-video">
          {loading ? (
            <Skeleton className="w-full h-full" />
          ) : videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
              Enter a YouTube URL to preview the video
            </div>
          )}
        </div>
        {videoId && duration > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-24">Clip from:</label>
              <Slider
                min={0}
                max={duration}
                step={0.01}
                value={[startTime]}
                onValueChange={handleStartTimeChange}
                className="flex-grow"
              />
              <Input
                type="number"
                value={startTime.toFixed(2)}
                onChange={handleStartTimeInputChange}
                className="w-20"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-24">Clip to:</label>
              <Slider
                min={0}
                max={duration}
                step={0.01}
                value={[endTime]}
                onValueChange={handleEndTimeChange}
                className="flex-grow"
              />
              <Input
                type="number"
                value={endTime.toFixed(2)}
                onChange={handleEndTimeInputChange}
                className="w-20"
              />
            </div>
            <Button onClick={handleClip} className="w-full" disabled={loading}>
              {loading
                ? "Processing..."
                : `Clip Video (${clipDuration.toFixed(2)}s)`}
            </Button>
          </div>
        )}
      </div>

      {/* Clipped Video */}
      <div className="w-full space-y-4">
        <h2 className="text-xl font-semibold mb-4">Clipped Video</h2>
        <div className="w-full aspect-video">
          {loading ? (
            <Skeleton className="w-full h-full" />
          ) : outputVideoUrl ? (
            <video
              src={outputVideoUrl}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
              Clipped video will appear here
            </div>
          )}
        </div>
        {outputVideoUrl && (
          <Button onClick={handleDownload} className="w-full">
            Download Clipped Video
          </Button>
        )}
      </div>
    </div>
  );
};
