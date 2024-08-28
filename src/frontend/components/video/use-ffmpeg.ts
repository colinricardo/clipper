import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useEffect, useState } from "react";

export default (): FFmpeg | null => {
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);

  useEffect(() => {
    const loadFFmpeg = async (): Promise<void> => {
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance);
    };
    loadFFmpeg();
  }, []);

  return ffmpeg;
};
