"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { processVideo } from "@/components/video/process-video";
import { VideoFormData } from "@/components/video/types";
import useFFmpeg from "@/components/video/use-ffmpeg";
import { IdPrefix, randomId } from "@/frontend/utils/ids";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      toast.error("FFmpeg not initialized");
      return;
    }

    setLoading(true);
    setOutputVideoUrl("");

    try {
      const processedVideo = await processVideo(formData, ffmpeg);
      const clipUrl = URL.createObjectURL(processedVideo);
      setOutputVideoUrl(clipUrl);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while processing the video."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
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
      startTime: startTime.toString(),
      endTime: endTime.toString(),
    });
  };

  const fetchVideoDuration = async (url: string) => {
    try {
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
      toast.error("Failed to fetch video duration");
    }
  };

  useEffect(() => {
    const extractVideoId = (url: string) => {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    const id = extractVideoId(videoUrl);
    setVideoId(id || "");

    if (id) {
      fetchVideoDuration(videoUrl);
    } else {
      // Reset duration and times if no valid video ID
      setDuration(0);
      setStartTime(0);
      setEndTime(0);
    }
  }, [videoUrl]);

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
