import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const spritePath = path.join(root, "public", "icons", "icon-sprite-2-5d.png");
const outDir = path.join(root, "public", "icons");
const names = [
  "brand", "sound-on", "sound-off", "fullscreen", "settings",
  "arrow-left", "arrow-right", "check", "chevron-down", "chevron-up",
  "eyes", "lightbulb", "reset", "close", "copy",
  "trash", "book", "gallery", "check-circle", "question",
  "flower", "leaf", "paintbrush", "hand-tap", "home",
];

const sheet = await sharp(spritePath).resize(1000, 1000, { fit: "fill" }).png().toBuffer();

for (let index = 0; index < names.length; index += 1) {
  const column = index % 5;
  const row = Math.floor(index / 5);
  await sharp(sheet)
    .extract({ left: column * 200, top: row * 200, width: 200, height: 200 })
    .resize(128, 128, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, `${names[index]}.png`));
}

console.log(`Created ${names.length} consistent 2.5D PNG icons.`);
