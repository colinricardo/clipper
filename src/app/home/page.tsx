import VideoClipper from "@/frontend/components/video/video-clipper";
import Link from "next/link";

export default async () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-center mb-8 text-muted-foreground">
        This code won't run on this site, but you can get the code yourself{" "}
        <Link
          className="underline text-primary hover:text-primary/80"
          href="https://github.com/colinricardo/clipper"
          target="_blank"
        >
          here
        </Link>
        .
      </p>

      <div className="max-w-2xl mx-auto">
        <VideoClipper />
      </div>
    </div>
  );
};
