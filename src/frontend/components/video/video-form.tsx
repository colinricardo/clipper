import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VideoFormData } from "@/components/video/types";
import { ChangeEvent, FormEvent, useState } from "react";

interface VideoFormProps {
  onSubmit: (formData: VideoFormData) => Promise<void>;
  loading: boolean;
  onUrlChange: (url: string) => void;
}

export default ({ onSubmit, loading, onUrlChange }: VideoFormProps) => {
  const [url, setUrl] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit({ url, startTime, endTime });
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    onUrlChange(newUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="url">YouTube URL</Label>
        <Input
          type="text"
          id="url"
          value={url}
          onChange={handleUrlChange}
          required
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="startTime">Start Time (s)</Label>
          <Input
            type="number"
            id="startTime"
            value={startTime}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStartTime(e.target.value)
            }
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endTime">End Time (s)</Label>
          <Input
            type="number"
            id="endTime"
            value={endTime}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEndTime(e.target.value)
            }
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Clip"}
      </Button>
    </form>
  );
};
