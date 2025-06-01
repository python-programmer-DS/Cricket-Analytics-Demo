// src/components/VideoPlayerSection/VideoPlayerSection.tsx
import React from "react";

const VideoPlayerSection: React.FC = () => (
  <div className="bg-[#181d23] rounded-2xl shadow-xl p-4 flex flex-col items-center justify-center min-h-[230px] w-full">
    <span className="text-[#b5c7c7] text-lg mb-3">[Video Placeholder]</span>
    <button className="bg-[#47bcff] text-black px-4 py-1 rounded-lg">Upload/Stream</button>
  </div>
);

export default VideoPlayerSection;
