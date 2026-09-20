import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("public/icons");
await fs.mkdir(outDir, { recursive: true });

const ink = "#244b47";
const red = "#d85646";
const gold = "#e3b33f";
const green = "#4f8b62";
const svg = (body, viewBox = "0 0 64 64") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="64" height="64" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const stroke = (body, color = ink, width = 5) => `<g stroke="${color}" stroke-width="${width}">${body}</g>`;

const icons = {
  brand: svg(`<circle cx="32" cy="32" r="25" fill="${red}"/><circle cx="32" cy="32" r="15" stroke="#fff5dd" stroke-width="5"/><circle cx="32" cy="32" r="7" fill="${gold}"/>`),
  "sound-on": svg(stroke(`<path d="M13 27h9l12-10v30L22 37h-9z"/><path d="M43 24c4 5 4 11 0 16M50 18c8 8 8 20 0 28"/>`)),
  "sound-off": svg(stroke(`<path d="M13 27h9l12-10v30L22 37h-9z"/><path d="M43 25l12 14M55 25L43 39"/>`)),
  fullscreen: svg(stroke(`<path d="M12 25V12h13M39 12h13v13M52 39v13H39M25 52H12V39"/>`)),
  settings: svg(stroke(`<circle cx="32" cy="32" r="9"/><path d="M32 8v7M32 49v7M8 32h7M49 32h7M15 15l5 5M44 44l5 5M49 15l-5 5M20 44l-5 5"/>`)),
  "arrow-right": svg(stroke(`<path d="M10 32h42M38 18l14 14-14 14"/>`)),
  "arrow-left": svg(stroke(`<path d="M54 32H12M26 18L12 32l14 14"/>`)),
  check: svg(stroke(`<path d="M13 33l12 12 27-28"/>`, green, 7)),
  eyes: svg(`<path d="M5 32s9-14 21-14 20 14 20 14-8 14-20 14S5 32 5 32z" fill="#fffdf7" stroke="${ink}" stroke-width="4"/><circle cx="26" cy="32" r="6" fill="${red}"/><path d="M36 17l7-8M47 22l9-5" stroke="${gold}" stroke-width="4"/>`),
  "difficulty-easy": svg(`<path d="M31 53C15 44 15 24 45 11c5 24-1 37-14 42z" fill="#91c89b" stroke="${green}" stroke-width="4"/><path d="M30 51c3-14 9-24 16-32" stroke="${green}" stroke-width="4"/>`),
  "difficulty-normal": svg(`<circle cx="32" cy="32" r="9" fill="${gold}"/><g fill="#ffe8a0" stroke="${gold}" stroke-width="3"><ellipse cx="32" cy="14" rx="8" ry="12"/><ellipse cx="32" cy="50" rx="8" ry="12"/><ellipse cx="14" cy="32" rx="12" ry="8"/><ellipse cx="50" cy="32" rx="12" ry="8"/><ellipse cx="19" cy="19" rx="8" ry="11" transform="rotate(-45 19 19)"/><ellipse cx="45" cy="45" rx="8" ry="11" transform="rotate(-45 45 45)"/><ellipse cx="45" cy="19" rx="8" ry="11" transform="rotate(45 45 19)"/><ellipse cx="19" cy="45" rx="8" ry="11" transform="rotate(45 19 45)"/></g>`),
  "difficulty-hard": svg(`<path d="M35 6c3 13-4 16 1 24 5-3 7-7 8-12 9 9 13 18 10 29-3 10-11 15-22 15S13 56 11 47c-3-12 4-22 14-31 0 8 2 12 6 15 3-8-3-15 4-25z" fill="#ef725c" stroke="${red}" stroke-width="4"/><path d="M32 35c6 7 8 11 5 17-2 4-9 4-11 0-3-6 2-11 6-17z" fill="#ffd36b"/>`),
  lightbulb: svg(stroke(`<path d="M21 39c-5-4-8-9-8-15 0-10 8-18 19-18s19 8 19 18c0 6-3 11-8 15l-3 5H24z"/><path d="M24 51h16M28 58h8"/>`, gold, 5)),
  reset: svg(stroke(`<path d="M18 19H7V8"/><path d="M9 19c6-11 20-16 32-10 12 5 18 19 13 31S35 58 23 53c-8-3-13-9-15-16"/>`)),
  "check-circle": svg(`<circle cx="32" cy="32" r="25" fill="#dcefe2" stroke="${green}" stroke-width="4"/>${stroke(`<path d="M18 33l9 9 20-21"/>`, green, 6)}`),
  gallery: svg(`<rect x="8" y="12" width="48" height="40" rx="7" fill="#e8f0e5" stroke="${ink}" stroke-width="4"/><circle cx="22" cy="25" r="5" fill="${gold}"/><path d="M13 47l13-13 9 8 7-7 10 12" stroke="${green}" stroke-width="5"/>`),
  book: svg(`<path d="M8 13c10-4 18-2 24 4v37c-6-6-14-8-24-4zM56 13c-10-4-18-2-24 4v37c6-6 14-8 24-4z" fill="#fff4cc" stroke="${ink}" stroke-width="4"/><path d="M32 17v37" stroke="${ink}" stroke-width="4"/>`),
  copy: svg(stroke(`<rect x="20" y="18" width="31" height="34" rx="5"/><path d="M43 18v-6H13v33h7"/>`)),
  trash: svg(stroke(`<path d="M14 18h36M25 18v-7h14v7M19 18l3 38h20l3-38M28 27v19M36 27v19"/>`)),
  sparkle: svg(`<path d="M32 5c2 15 8 23 24 27-16 4-22 12-24 27-2-15-8-23-24-27C24 28 30 20 32 5z" fill="${gold}" stroke="${red}" stroke-width="2"/>`),
  close: svg(stroke(`<path d="M15 15l34 34M49 15L15 49"/>`, ink, 6)),
  "chevron-down": svg(stroke(`<path d="M14 24l18 18 18-18"/>`)),
  "chevron-up": svg(stroke(`<path d="M14 40l18-18 18 18"/>`)),
};

await Promise.all(Object.entries(icons).map(async ([name, content]) => {
  await sharp(Buffer.from(content)).resize(128, 128).png({ compressionLevel: 9 }).toFile(path.join(outDir, `${name}.png`));
}));

console.log(`Generated ${Object.keys(icons).length} PNG icons in ${outDir}`);
