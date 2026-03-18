"use client";

import { useCallback, useRef, useState } from "react";

const VIDEOS = ["/hero-1.mp4", "/hero-2.mp4", "/hero-3.mp4"];

export default function HeroVideo() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * VIDEOS.length));
  const videoRef = useRef<HTMLVideoElement>(null);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % VIDEOS.length);
  }, []);

  return (
    <video
      ref={videoRef}
      key={index}
      autoPlay
      muted
      playsInline
      onEnded={advance}
      aria-hidden="true"
      className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
    >
      <source src={VIDEOS[index]} type="video/mp4" />
    </video>
  );
}
