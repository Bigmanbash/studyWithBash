"use client";

import { Play, Video } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

/**
 * Extracts a YouTube Video ID from standard YouTube URL formats.
 */
function getYouTubeId(url: string): string | null {
  if (!url) return null;

  // Handle plain ID passed directly
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded-xl bg-neutral-900 flex flex-col items-center justify-center p-6 text-white text-center border border-neutral-200 shadow-sm">
        <Video className="w-10 h-10 text-neutral-500 mb-2" />
        <p className="text-sm font-medium text-neutral-300">Invalid Video Link</p>
        <p className="text-xs text-neutral-500 mt-1 truncate max-w-md">{videoUrl}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
      {/* {title && (
        <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#17A546]/10 flex items-center justify-center text-[#17A546]">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#0A1B39] truncate">
            {title}
          </h3>
        </div>
      )} */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
          title={title || "Topic Lecture Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
}
