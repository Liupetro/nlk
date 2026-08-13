"use client";

import { useEffect, useRef, useState } from "react";

type CanvasFrameScrubberProps = {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
  overlayOpacity?: number;
  blurAmount?: string;
};

/** On-disk sequence. Virtual frames take every Nth file (192 / 48 → step 4). */
const SOURCE_TOTAL = 192;
const MOBILE_MAX_WIDTH = 767;
const WINDOW_RADIUS = 5;
const HARD_EVICT_RADIUS = WINDOW_RADIUS * 2;
const MAX_CANVAS_CSS_WIDTH = 1280;
const MAX_DPR = 1.5;
const MIN_FRAME_MS = 1000 / 30;
const LERP = 0.28;

function sourceFrameNumber(index: number, virtualTotal: number): number {
  if (virtualTotal <= 1) return 1;
  const step = SOURCE_TOTAL / virtualTotal;
  return 1 + Math.round(index * step);
}

function frameUrl(folderPath: string, sourceNum: number): string {
  return `${folderPath}/frame_${String(sourceNum).padStart(3, "0")}.jpg`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Desktop hero scrubber: sampled JPEG sequence, small decoded window,
 * 30fps rAF updates. Mobile / reduced-motion → static poster only.
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

  const midIndex = Math.round((totalFrames - 1) / 2);
  const posterSrc = frameUrl(folderPath, sourceFrameNumber(midIndex, totalFrames));

  useEffect(() => {
    const mobileMq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      setStaticPoster(mobileMq.matches || reduceMq.matches);
    };

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

    const strong = new Map<number, ImageBitmap | HTMLImageElement>();
    const weak = new Map<number, WeakRef<ImageBitmap | HTMLImageElement>>();
    const inflight = new Set<number>();

    let target = midIndex;
    let current = midIndex;
    let lastDrawn = -1;
    let lastDrawTime = 0;
    let pendingX: number | null = null;
    let viewportW = window.innerWidth || 1;
    let rafId: number | null = null;
    let running = false;
    let cancelled = false;
    let shown = false;

    const urlFor = (index: number) =>
      frameUrl(folderPath, sourceFrameNumber(index, totalFrames));

    const revive = (index: number) => {
      const ref = weak.get(index);
      const value = ref?.deref();
      if (value) {
        strong.set(index, value);
        weak.delete(index);
        return value;
      }
      weak.delete(index);
      return null;
    };

    const getFrame = (index: number) => strong.get(index) ?? revive(index);

    const releaseHard = (frame: ImageBitmap | HTMLImageElement) => {
      if (typeof ImageBitmap !== "undefined" && frame instanceof ImageBitmap) {
        frame.close();
        return;
      }
      if (frame instanceof HTMLImageElement) {
        frame.onload = null;
        frame.onerror = null;
        frame.src = "";
      }
    };

    const prune = (center: number) => {
      for (const [index, frame] of strong) {
        if (Math.abs(index - center) > WINDOW_RADIUS) {
          weak.set(index, new WeakRef(frame));
          strong.delete(index);
        }
      }
      for (const [index, ref] of weak) {
        if (Math.abs(index - center) <= HARD_EVICT_RADIUS) continue;
        const frame = ref.deref();
        if (frame) releaseHard(frame);
        weak.delete(index);
      }
    };

    const drawIndex = (index: number) => {
      const frame = getFrame(index) ?? (() => {
        const count = totalFrames;
        for (let d = 1; d < count; d++) {
          const a = getFrame(index + d);
          if (a) return a;
          const b = getFrame(index - d);
          if (b) return b;
        }
        return null;
      })();

      if (!frame) return;
      if ("naturalWidth" in frame && frame.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = "naturalWidth" in frame ? frame.naturalWidth : frame.width;
      const ih = "naturalHeight" in frame ? frame.naturalHeight : frame.height;
      if (!iw || !ih) return;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      ctx.drawImage(frame, (cw - nw) / 2, (ch - nh) / 2, nw, nh);
      lastDrawn = index;

      if (!shown) {
        shown = true;
        setCanvasReady(true);
      }
    };

    const loadIndex = (index: number) => {
      if (index < 0 || index >= totalFrames) return;
      if (getFrame(index) || inflight.has(index)) return;

      inflight.add(index);
      const img = new Image();
      img.decoding = "async";
      img.src = urlFor(index);

      const finish = async () => {
        inflight.delete(index);
        if (cancelled) {
          img.src = "";
          return;
        }
        if (Math.abs(index - Math.round(current)) > HARD_EVICT_RADIUS) {
          img.src = "";
          return;
        }

        let frame: ImageBitmap | HTMLImageElement = img;
        if (typeof createImageBitmap === "function") {
          try {
            frame = await createImageBitmap(img);
            img.src = "";
          } catch {
            frame = img;
          }
        }

        if (cancelled) {
          releaseHard(frame);
          return;
        }

        strong.set(index, frame);
        const nearest = clamp(Math.round(current), 0, totalFrames - 1);
        if (index === nearest) drawIndex(index);
      };

      img.onload = () => {
        void finish();
      };
      img.onerror = () => {
        inflight.delete(index);
      };
    };

    const ensureWindow = (center: number) => {
      const c = clamp(center, 0, totalFrames - 1);
      const start = Math.max(0, c - WINDOW_RADIUS);
      const end = Math.min(totalFrames - 1, c + WINDOW_RADIUS);
      for (let i = start; i <= end; i++) loadIndex(i);
      prune(c);
    };

    const loop = (now: number) => {
      if (cancelled) return;

      if (pendingX != null) {
        const progress = clamp(pendingX / viewportW, 0, 1);
        target = progress * (totalFrames - 1);
        pendingX = null;
      }

      const diff = target - current;
      const moving = Math.abs(diff) > 0.02;
      const due = now - lastDrawTime >= MIN_FRAME_MS;

      if (due && moving) {
        current += diff * LERP;
        const idx = clamp(Math.round(current), 0, totalFrames - 1);
        ensureWindow(idx);
        if (idx !== lastDrawn) drawIndex(idx);
        lastDrawTime = now;
      }

      if (Math.abs(target - current) > 0.02 || pendingX != null) {
        rafId = requestAnimationFrame(loop);
      } else {
        running = false;
        rafId = null;
      }
    };

    const kick = () => {
      if (running || cancelled) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const onPointerX = (x: number) => {
      pendingX = x;
      kick();
    };

    const onMouseMove = (e: MouseEvent) => onPointerX(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onPointerX(e.touches[0].clientX);
    };

    const resize = () => {
      viewportW = window.innerWidth || 1;
      const rect = container.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      const drawW = Math.min(cssW, MAX_CANVAS_CSS_WIDTH);
      const drawH = drawW * (cssH / cssW);
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const nextW = Math.max(1, Math.round(drawW * dpr));
      const nextH = Math.max(1, Math.round(drawH * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        if (lastDrawn >= 0) drawIndex(lastDrawn);
      }
    };

    resize();
    ensureWindow(Math.round(current));

    const ro = new ResizeObserver(() => {
      if (rafId == null && !running) {
        requestAnimationFrame(resize);
      } else {
        resize();
      }
    });
    ro.observe(container);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelled = true;
      running = false;
      if (rafId != null) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", resize);
      for (const frame of strong.values()) releaseHard(frame);
      for (const ref of weak.values()) {
        const frame = ref.deref();
        if (frame) releaseHard(frame);
      }
      strong.clear();
      weak.clear();
      inflight.clear();
    };
  }, [staticPoster, totalFrames, folderPath, midIndex]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none relative overflow-hidden ${className}`}
    >
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
