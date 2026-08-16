import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "brand", "lockups");
const SRC = path.join(root, "public/brand/fonts/techno-mold/tm-04-mirror.jpg");

const CANVAS_W = 1600;
const CANVAS_H = 900;
const LABEL = "Невская Литейная Компания";

// Same style as original-v2: light weight, tracking 2, gap 4
const WEIGHT = "300";
const TRACKING = 2;
const GAP = 4;

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function measureTextWidth(label, size, fontWeight, tracking) {
  const svg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="2400" height="160" xmlns="http://www.w3.org/2000/svg">
  <text x="40" y="100" fill="#ffffff" font-family="Segoe UI, Arial, Helvetica, sans-serif"
    font-size="${size}" font-weight="${fontWeight}" letter-spacing="${tracking}">${escapeXml(label)}</text>
</svg>`);
  const { info } = await sharp(svg).trim().raw().toBuffer({ resolveWithObject: true });
  return info.width;
}

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

await mkdir(outDir, { recursive: true });

const logoTrimmed = await sharp(SRC).trim({ threshold: 12 }).png().toBuffer();
const meta = await sharp(logoTrimmed).metadata();
const logoW = meta.width;
const logoH = meta.height;
console.log("logo ink", logoW, logoH);

let size = await fitTextToWidth(LABEL, logoW, WEIGHT, TRACKING);
let textW = await measureTextWidth(LABEL, size, WEIGHT, TRACKING);
while (textW > logoW && size > 12) {
  size -= 1;
  textW = await measureTextWidth(LABEL, size, WEIGHT, TRACKING);
}
console.log("text size", size, "textW", textW);

const textH = Math.ceil(size * 1.35);
const textPng = await sharp(textSvg(LABEL, size, TRACKING, WEIGHT, logoW, textH))
  .png()
  .toBuffer();

const blockW = logoW;
const blockH = logoH + GAP + textH;
const blockX = Math.round((CANVAS_W - blockW) / 2);
const blockY = Math.round((CANVAS_H - blockH) / 2);

// Black JPG archive
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
    { input: textPng, left: blockX, top: blockY + logoH + GAP },
  ])
  .jpeg({ quality: 95 })
  .toFile(path.join(outDir, "lockup-mirror-v2.jpg"));

// Transparent canvas for site
const rgba = await sharp({
  create: {
    width: CANVAS_W,
    height: CANVAS_H,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: logoTrimmed, left: blockX, top: blockY },
    { input: textPng, left: blockX, top: blockY + logoH + GAP },
  ])
  .png()
  .toBuffer();

const { data, info } = await sharp(rgba)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a === 0) continue;
  const lum = (r + g + b) / 3;
  if (lum < 18) {
    data[i + 3] = 0;
  } else if (lum < 40) {
    data[i + 3] = Math.min(a, Math.round(((lum - 18) / 22) * 255));
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 5 })
  .png()
  .toFile(path.join(outDir, "lockup-mirror-v2-trim.png"));

const m = await sharp(path.join(outDir, "lockup-mirror-v2-trim.png")).metadata();
console.log("trim", m.width, m.height, "alpha", m.hasAlpha);
console.log("done");
