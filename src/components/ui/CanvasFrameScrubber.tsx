"use client";

import { useEffect, useRef, useState } from "react";

type CanvasFrameScrubberProps = {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
  overlayOpacity?: number; // default 0.4
  blurAmount?: string; // default "blur-[0.5px]" (very subtle/minimal blur)
};

/**
 * Interactive hero background: preloads image frames and scrubs them
 * with mouse/touch X position (smooth lerp via requestAnimationFrame).
 * Ported from freelancers v3 handoff (CanvasFrameScrubber).
 */
export function CanvasFrameScrubber({
  totalFrames = 192,
  folderPath = "/videos/frames",
  className = "",
  overlayOpacity = 0.4,
  blurAmount = "blur-[0.5px]",
}: CanvasFrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(totalFrames / 2);
  const currentFrameRef = useRef(totalFrames / 2);
  const animFrameIdRef = useRef<number | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);

  // Preload all image frames asynchronously
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let isCancelled = false;
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `${folderPath}/frame_${frameNum}.jpg`;

      img.onload = () => {
        if (isCancelled) return;
        count++;
        setLoadedCount(count);
      };

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [folderPath, totalFrames]);

  // Object-cover canvas drawing helper
  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgIndex = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIdx)));
    const img = imagesRef.current[imgIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const cx = (cw - nw) / 2;
    const cy = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, cx, cy, nw, nh);
  };

  // Resize canvas to match display size
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- draw once on mount/resize; frame loop handles redraws
  }, []);

  // Smooth RAF lerp loop
  useEffect(() => {
    let isActive = true;

    const render = () => {
      if (!isActive) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.15;
        drawFrame(currentFrameRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isActive = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restart loop when frames start loading
  }, [loadedCount]);

  // Mouse & Touch scrub
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const x = Math.max(0, Math.min(w, e.clientX));
      const progress = x / w;
      targetFrameRef.current = progress * (totalFrames - 1);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const w = window.innerWidth || 1;
        const x = Math.max(0, Math.min(w, e.touches[0].clientX));
        const progress = x / w;
        targetFrameRef.current = progress * (totalFrames - 1);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [totalFrames]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loadedCount > 5 ? "opacity-100" : "opacity-0"
        } ${blurAmount}`}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
    </div>
  );
}
