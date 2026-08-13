"use client";

import { useEffect, useRef, useState } from "react";

type CanvasFrameScrubberProps = {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
  overlayOpacity?: number; // default 0.4
  blurAmount?: string; // default "blur-[0.5px]" (very subtle/minimal blur)
};

/** On-disk sequence length. Virtual frames are sampled evenly from these. */
const SOURCE_TOTAL = 192;
const MOBILE_MAX_WIDTH = 767;
const WINDOW_RADIUS = 6;
const PREFETCH_AHEAD = 4;

function sourceFrameNumber(index: number, virtualTotal: number): number {
  if (virtualTotal <= 1) return 1;
  const t = Math.max(0, Math.min(virtualTotal - 1, index));
  return 1 + Math.round((t / (virtualTotal - 1)) * (SOURCE_TOTAL - 1));
}

function frameUrl(folderPath: string, sourceNum: number): string {
  return `${folderPath}/frame_${String(sourceNum).padStart(3, "0")}.jpg`;
}

/**
 * Interactive hero background: lazily loads a sampled window of frames
 * and scrubs them with mouse/touch X (smooth lerp via requestAnimationFrame).
 * On mobile (<768px) or reduced-motion, a static poster is used instead.
 */
export function CanvasFrameScrubber({
  totalFrames = 48,
  folderPath = "/videos/frames",
  className = "",
  overlayOpacity = 0.4,
  blurAmount = "blur-[0.5px]",
}: CanvasFrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const inflightRef = useRef<Set<number>>(new Set());
  const loadQueueRef = useRef<number[]>([]);
  const flushScheduledRef = useRef(false);

  const targetFrameRef = useRef((totalFrames - 1) / 2);
  const currentFrameRef = useRef((totalFrames - 1) / 2);
  const framesRef = useRef(totalFrames);
  const folderRef = useRef(folderPath);
  const rafRef = useRef<number | null>(null);
  const shownRef = useRef(false);
  const staticRef = useRef(false);

  const [canvasReady, setCanvasReady] = useState(false);
  const [staticPoster, setStaticPoster] = useState(true);

  folderRef.current = folderPath;
  framesRef.current = totalFrames;

  const posterSrc = frameUrl(
    folderPath,
    sourceFrameNumber(Math.floor((totalFrames - 1) / 2), totalFrames),
  );

  const nearestImage = (frameIdx: number): HTMLImageElement | null => {
    const cache = cacheRef.current;
    if (cache.size === 0) return null;
    const exact = Math.round(frameIdx);
    const hit = cache.get(exact);
    if (hit) return hit;
    const count = framesRef.current;
    for (let d = 1; d < count; d++) {
      const a = cache.get(exact + d);
      if (a) return a;
      const b = cache.get(exact - d);
      if (b) return b;
    }
    return null;
  };

  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = nearestImage(frameIdx);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;

    ctx.drawImage(img, (cw - nw) / 2, (ch - nh) / 2, nw, nh);
  };

  const startLoad = (index: number) => {
    if (index < 0 || index >= framesRef.current) return;
    if (cacheRef.current.has(index) || inflightRef.current.has(index)) return;

    inflightRef.current.add(index);
    const img = new Image();
    img.decoding = "async";
    img.src = frameUrl(
      folderRef.current,
      sourceFrameNumber(index, framesRef.current),
    );

    img.onload = () => {
      inflightRef.current.delete(index);
      cacheRef.current.set(index, img);
      if (!shownRef.current) {
        shownRef.current = true;
        drawFrame(currentFrameRef.current);
        setCanvasReady(true);
      } else if (Math.abs(index - currentFrameRef.current) < 1.5) {
        drawFrame(currentFrameRef.current);
      }
    };

    img.onerror = () => {
      inflightRef.current.delete(index);
    };
  };

  const flushQueue = () => {
    flushScheduledRef.current = false;
    if (staticRef.current) {
      loadQueueRef.current = [];
      return;
    }
    // A couple of requests per frame — avoids a decode storm on the main thread.
    const batch = loadQueueRef.current.splice(0, 2);
    for (const index of batch) startLoad(index);
    if (loadQueueRef.current.length > 0) {
      flushScheduledRef.current = true;
      requestAnimationFrame(flushQueue);
    }
  };

  const enqueue = (index: number) => {
    if (index < 0 || index >= framesRef.current) return;
    if (cacheRef.current.has(index) || inflightRef.current.has(index)) return;
    if (loadQueueRef.current.includes(index)) return;
    loadQueueRef.current.push(index);
    if (!flushScheduledRef.current) {
      flushScheduledRef.current = true;
      requestAnimationFrame(flushQueue);
    }
  };

  const ensureWindow = (center: number) => {
    const count = framesRef.current;
    const c = Math.round(center);
    const dir = Math.sign(targetFrameRef.current - currentFrameRef.current);
    const start = Math.max(0, c - WINDOW_RADIUS);
    const end = Math.min(count - 1, c + WINDOW_RADIUS);

    for (let i = start; i <= end; i++) enqueue(i);

    if (dir !== 0) {
      for (let k = 1; k <= PREFETCH_AHEAD; k++) {
        enqueue(c + dir * (WINDOW_RADIUS + k));
      }
    }
  };

  // Mobile / reduced-motion → static poster. Desktop → lazy scrubber.
  useEffect(() => {
    const mobileMq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const usePoster = mobileMq.matches || reduceMq.matches;
      staticRef.current = usePoster;
      setStaticPoster(usePoster);

      if (usePoster) {
        loadQueueRef.current = [];
        cacheRef.current.clear();
        inflightRef.current.clear();
        shownRef.current = false;
        setCanvasReady(false);
        return;
      }

      framesRef.current = totalFrames;
      ensureWindow(currentFrameRef.current);
    };

    apply();
    mobileMq.addEventListener("change", apply);
    reduceMq.addEventListener("change", apply);
    return () => {
      mobileMq.removeEventListener("change", apply);
      reduceMq.removeEventListener("change", apply);
    };
    // Helpers close over the latest totalFrames/folder via refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFrames, folderPath]);

  // Keep canvas resolution in sync with the container, cap DPR to limit fill-rate.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      if (!staticRef.current) drawFrame(currentFrameRef.current);
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticPoster]);

  // Smooth RAF lerp — only draws when the frame actually moves.
  useEffect(() => {
    if (staticPoster) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    let active = true;
    const render = () => {
      if (!active) return;
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.02) {
        currentFrameRef.current += diff * 0.15;
        ensureWindow(currentFrameRef.current);
        drawFrame(currentFrameRef.current);
      }
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticPoster]);

  // Mouse / touch scrub across the viewport.
  useEffect(() => {
    if (staticPoster) return;

    const setFromX = (clientX: number) => {
      const w = window.innerWidth || 1;
      const progress = Math.max(0, Math.min(1, clientX / w));
      targetFrameRef.current = progress * (framesRef.current - 1);
      ensureWindow(targetFrameRef.current);
    };

    const onMouse = (e: MouseEvent) => setFromX(e.clientX);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) setFromX(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticPoster]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <img
        src={posterSrc}
        alt=""
        aria-hidden
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={`absolute inset-0 h-full w-full object-cover ${blurAmount} transition-opacity duration-500 ${
          canvasReady && !staticPoster ? "opacity-0" : "opacity-100"
        }`}
      />

      {!staticPoster && (
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            canvasReady ? "opacity-100" : "opacity-0"
          } ${blurAmount}`}
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
    </div>
  );
}
