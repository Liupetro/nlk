"use client";

import { useEffect, useRef, useState } from "react";

type CanvasFrameScrubberProps = {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
  overlayOpacity?: number;
  blurAmount?: string;
};

const SOURCE_TOTAL = 192;
const MOBILE_MAX_WIDTH = 767;
const BOOTSTRAP_COUNT = 10;
const READY_MIN = 10;
const HOLD_RADIUS = 3;
const DECODE_CONCURRENCY = 3;
const LERP = 0.15;
const POSTER_SRC = "/videos/hero-poster.jpg";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Virtual 0..N-1 → even sample across the on-disk 192-file sequence. */
function sourceFrameNumber(index: number, virtualTotal: number): number {
  if (virtualTotal <= 1) return 1;
  return 1 + Math.round((index * (SOURCE_TOTAL - 1)) / (virtualTotal - 1));
}

function frameUrl(folderPath: string, sourceNum: number): string {
  return `${folderPath}/frame_${String(sourceNum).padStart(3, "0")}.jpg`;
}

function evenIndices(count: number, total: number, mid: number): number[] {
  const n = clamp(count, 1, total);
  const set = new Set<number>([mid]);
  if (n === 1) return [mid];
  for (let i = 0; i < n; i++) {
    set.add(Math.round((i * (total - 1)) / (n - 1)));
  }
  return [...set];
}

/**
 * Immediate /videos/hero-poster.jpg. Canvas fades in only after 10 frames.
 * 48 virtual frames sample the 192-file sequence. Lerp 0.15.
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
  const [canvasReady, setCanvasReady] = useState(false);
  const [staticPoster, setStaticPoster] = useState(true);

  const lastFrame = Math.max(0, totalFrames - 1);
  const midIndex = Math.round(lastFrame / 2);

  useEffect(() => {
    const mobileMq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setStaticPoster(mobileMq.matches || reduceMq.matches);
    apply();
    mobileMq.addEventListener("change", apply);
    reduceMq.addEventListener("change", apply);
    return () => {
      mobileMq.removeEventListener("change", apply);
      reduceMq.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (staticPoster) {
      setCanvasReady(false);
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const bootstrap = new Set(evenIndices(BOOTSTRAP_COUNT, totalFrames, midIndex));
    const cache = new Map<number, HTMLImageElement>();
    const inflight = new Set<number>();
    const queue: number[] = [];
    const queued = new Set<number>();

    const targetFrameRef = { current: totalFrames / 2 };
    const currentFrameRef = { current: totalFrames / 2 };
    let playheadIndex = midIndex;
    let lastPaintKey = "";
    let rafId: number | null = null;
    let cancelled = false;
    let shown = false;

    const urlFor = (index: number) =>
      frameUrl(folderPath, sourceFrameNumber(index, totalFrames));

    const shouldHold = (index: number) =>
      bootstrap.has(index) || Math.abs(index - playheadIndex) <= HOLD_RADIUS;

    const drawable = (index: number): HTMLImageElement | null => {
      const exact = cache.get(index);
      if (exact?.naturalWidth) return exact;
      let best: HTMLImageElement | null = null;
      let bestDist = Infinity;
      for (const [i, img] of cache) {
        if (!img.naturalWidth) continue;
        const d = Math.abs(i - index);
        if (d < bestDist) {
          bestDist = d;
          best = img;
        }
      }
      return best;
    };

    const paint = (frameIdx: number, force = false) => {
      const idx = clamp(Math.round(frameIdx), 0, lastFrame);
      const img = drawable(idx);
      if (!img) return;

      const key = `${idx}:${img.src}`;
      if (!force && key === lastPaintKey) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!cw || !ch || !iw || !ih) return;

      const scale = Math.max(cw / iw, ch / ih);
      ctx.drawImage(img, (cw - iw * scale) / 2, (ch - ih * scale) / 2, iw * scale, ih * scale);
      lastPaintKey = key;
    };

    const maybeReveal = () => {
      if (shown || cancelled || cache.size < READY_MIN) return;
      paint(currentFrameRef.current, true);
      shown = true;
      setCanvasReady(true);
    };

    const enqueue = (index: number, front = false) => {
      if (index < 0 || index > lastFrame) return;
      if (cache.has(index) || inflight.has(index)) return;
      if (queued.has(index)) {
        if (front) {
          const at = queue.indexOf(index);
          if (at > 0) {
            queue.splice(at, 1);
            queue.unshift(index);
          }
        }
        return;
      }
      queued.add(index);
      if (front) queue.unshift(index);
      else queue.push(index);
    };

    const decodeIndex = (index: number) => {
      const img = new Image();
      img.decoding = "async";
      inflight.add(index);
      queued.delete(index);

      img.onload = () => {
        inflight.delete(index);
        if (cancelled) {
          img.src = "";
          pump();
          return;
        }
        if (!shouldHold(index)) {
          img.src = "";
          pump();
          return;
        }
        cache.set(index, img);
        if (clamp(Math.round(currentFrameRef.current), 0, lastFrame) === index) {
          paint(currentFrameRef.current);
        }
        maybeReveal();
        pump();
      };
      img.onerror = () => {
        inflight.delete(index);
        pump();
      };
      img.src = urlFor(index);
    };

    const pump = () => {
      if (cancelled) return;
      while (inflight.size < DECODE_CONCURRENCY && queue.length) {
        const index = queue.shift() as number;
        queued.delete(index);
        if (cache.has(index) || inflight.has(index)) continue;
        if (!shouldHold(index)) continue;
        decodeIndex(index);
      }
    };

    const coverPlayhead = (center: number) => {
      playheadIndex = clamp(center, 0, lastFrame);
      enqueue(playheadIndex, true);
      for (let d = 1; d <= HOLD_RADIUS; d++) {
        enqueue(playheadIndex - d, true);
        enqueue(playheadIndex + d, true);
      }
      for (const index of [...cache.keys()]) {
        if (shouldHold(index)) continue;
        const img = cache.get(index);
        if (!img) continue;
        img.onload = null;
        img.onerror = null;
        img.src = "";
        cache.delete(index);
      }
      pump();
    };

    const render = () => {
      if (cancelled) return;
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * LERP;
        const idx = clamp(Math.round(currentFrameRef.current), 0, lastFrame);
        if (idx !== playheadIndex) coverPlayhead(idx);
        paint(currentFrameRef.current);
      }
      rafId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const x = Math.max(0, Math.min(w, e.clientX));
      targetFrameRef.current = (x / w) * (totalFrames - 1);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const w = window.innerWidth || 1;
      const x = Math.max(0, Math.min(w, e.touches[0].clientX));
      targetFrameRef.current = (x / w) * (totalFrames - 1);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === nextW && canvas.height === nextH) return;
      canvas.width = nextW;
      canvas.height = nextH;
      paint(currentFrameRef.current, true);
    };

    const bootOrder = [...bootstrap].sort(
      (a, b) => Math.abs(a - midIndex) - Math.abs(b - midIndex) || a - b,
    );
    for (const index of bootOrder) enqueue(index);

    resize();
    coverPlayhead(midIndex);
    rafId = requestAnimationFrame(render);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelled = true;
      if (rafId != null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", resize);
      for (const img of cache.values()) {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      }
      cache.clear();
      inflight.clear();
    };
  }, [staticPoster, totalFrames, folderPath, midIndex, lastFrame]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <img
        src={POSTER_SRC}
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
          className={`absolute inset-0 h-full w-full object-cover ${blurAmount} transition-opacity duration-500 ${
            canvasReady ? "opacity-100" : "opacity-0"
          }`}
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
