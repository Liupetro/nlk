import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "brand", "lockups");
const CANVAS_W = 1600;
const CANVAS_H = 900;
const LABEL = "Невская Литейная Компания";
const LABEL_CAPS = "НЕВСКАЯ ЛИТЕЙНАЯ КОМПАНИЯ";

/** Sources to process: original + rounded (and easy to add more) */
const sources = [
  {
    key: "original",
    src: path.join(root, "public/brand/logo-nlk-en.jpg"),
  },
  {
    key: "rounded",
    src: path.join(root, "public/brand/fonts/font-10-rounded.jpg"),
  },
];

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Measure rendered text ink width (trim). */
async function measureTextWidth(label, size, fontWeight, tracking) {
  const svg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="2400" height="160" xmlns="http://www.w3.org/2000/svg">
  <text x="40" y="100"
    fill="#ffffff" font-family="Segoe UI, Arial, Helvetica, sans-serif"
    font-size="${size}" font-weight="${fontWeight}" letter-spacing="${tracking}">${escapeXml(label)}</text>
</svg>`);
  const { info } = await sharp(svg).trim().raw().toBuffer({ resolveWithObject: true });
  return info.width;
}

/** Binary search font-size so text width is ≤ maxWidth (never wider than logo). */
async function fitTextToWidth(label, maxWidth, fontWeight, tracking) {
  let lo = 18;
  let hi = 120;
  let best = 18;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const w = await measureTextWidth(label, mid, fontWeight, tracking);
    if (w <= maxWidth) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

function textSvg(label, size, tracking, fontWeight, w, h) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
    fill="#e4e8ee" font-family="Segoe UI, Arial, Helvetica, sans-serif"
    font-size="${size}" font-weight="${fontWeight}" letter-spacing="${tracking}">${escapeXml(label)}</text>
</svg>`);
}

/**
 * 5 variants — same Original NLK, text compressed to EXACT logo ink width,
 * gap almost zero so text sits flush under the mark.
 */
const variants = [
  { id: "original-v1", label: LABEL, weight: "400", tracking: 1, gap: 2 },
  { id: "original-v2", label: LABEL, weight: "300", tracking: 2, gap: 4 },
  { id: "original-v3", label: LABEL_CAPS, weight: "400", tracking: 1.5, gap: 2 },
  { id: "original-v4", label: LABEL, weight: "400", tracking: 0, gap: 0 },
  { id: "original-v5", label: LABEL_CAPS, weight: "300", tracking: 2.5, gap: 3 },
];

async function compose(prefix, v, logoTrimmed, logoW, logoH) {
  // Hard cap: text must not exceed logo width (use 100% of ink width)
  const maxTextW = logoW;
  const size = await fitTextToWidth(v.label, maxTextW, v.weight, v.tracking);
  let textW = await measureTextWidth(v.label, size, v.weight, v.tracking);

  // Safety: if still slightly over (rounding), drop 1px
  let finalSize = size;
  while (textW > maxTextW && finalSize > 12) {
    finalSize -= 1;
    textW = await measureTextWidth(v.label, finalSize, v.weight, v.tracking);
  }

  // Text layer exactly logo width — text centered inside that band
  const textH = Math.ceil(finalSize * 1.35);
  const svg = textSvg(v.label, finalSize, v.tracking, v.weight, logoW, textH);
  const textPng = await sharp(svg).png().toBuffer();

  const gap = v.gap;
  const blockW = logoW;
  const blockH = logoH + gap + textH;
  const blockX = Math.round((CANVAS_W - blockW) / 2);
  const blockY = Math.round((CANVAS_H - blockH) / 2);

  const outName = `lockup-${prefix}-${v.id}.jpg`;
  await sharp({
    create: {
      width: CANVAS_W,
      height: CANVAS_H,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([
      { input: logoTrimmed, left: blockX, top: blockY },
      { input: textPng, left: blockX, top: blockY + logoH + gap },
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, outName));

  console.log(
    `wrote ${outName}: logoW=${logoW} textW=${textW} size=${finalSize}px gap=${gap} (text ≤ logo ✓)`,
  );
  return outName;
}

await mkdir(outDir, { recursive: true });

for (const source of sources) {
  const logoTrimmed = await sharp(source.src)
    .trim({ threshold: 12 })
    .png()
    .toBuffer();

  const meta = await sharp(logoTrimmed).metadata();
  const logoW = meta.width;
  const logoH = meta.height;
  console.log(`\n[${source.key}] trimmed logo ink: ${logoW}×${logoH}`);

  for (const v of variants) {
    // variants use id like original-v1 — for multi-source use v1, v2...
    const style = {
      ...v,
      id: v.id.replace(/^original-/, ""),
    };
    await compose(source.key, style, logoTrimmed, logoW, logoH);
  }

  // Canonical: lockup-{key}.jpg = v1
  await sharp(path.join(outDir, `lockup-${source.key}-v1.jpg`)).toFile(
    path.join(outDir, `lockup-${source.key}.jpg`),
  );
}

// Keep legacy names for original series
for (const n of ["v1", "v2", "v3", "v4", "v5"]) {
  await sharp(path.join(outDir, `lockup-original-${n}.jpg`)).toFile(
    path.join(outDir, `lockup-original-${n === "v1" ? "v1" : n}.jpg`),
  );
}

console.log("\ndone");
