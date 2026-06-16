/* Génère les icônes PWA depuis l'avatar Tasky (galet) — lancer : node scripts/gen-icons.mjs */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const BODY = "M75 20 C115 20 135 55 135 90 C135 122 110 138 75 138 C40 138 15 122 15 90 C15 55 35 20 75 20 Z";

function svg(scale, translate, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${bg}"/>
  <g transform="translate(${translate},${translate}) scale(${scale})">
    <ellipse cx="75" cy="142" rx="42" ry="6" fill="#000" opacity="0.08"/>
    <path d="${BODY}" fill="#6B8F71"/>
    <path d="${BODY}" fill="url(#sh)"/>
    <defs><linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <path d="M48 80 q7 -6 14 0" stroke="#2B2B28" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M88 80 q7 -6 14 0" stroke="#2B2B28" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M66 96 q9 6 18 0" stroke="#2B2B28" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;
}

// version "normale" (galet bien visible) et "maskable" (plus petit, zone de sécurité)
const normal = svg(2.0, 106, "#EFF3EC");
const maskable = svg(1.5, 144, "#EFF3EC");

await mkdir("public", { recursive: true });
const out = [
  ["public/icon-192.png", normal, 192],
  ["public/icon-512.png", normal, 512],
  ["public/icon-maskable-512.png", maskable, 512],
  ["public/apple-touch-icon.png", normal, 180],
  ["public/favicon-32.png", normal, 32],
];
for (const [file, src, size] of out) {
  await sharp(Buffer.from(src)).resize(size, size).png().toFile(file);
  console.log("écrit", file);
}
