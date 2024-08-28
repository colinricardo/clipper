import VideoClipper from "@/frontend/components/video/video-clipper";
import { Toaster } from "sonner";

export default async () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-center mb-8 text-gray-600">
        Processing is done locally using WASM. Long videos might time out.
      </p>

      <div className="max-w-2xl mx-auto">
        <VideoClipper />
      </div>
      <Toaster />
    </div>
  );
};
