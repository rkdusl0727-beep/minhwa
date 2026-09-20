import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageDir = path.join(root, "public", "minhwa");

const artworks = [
  ["minhwa01-original.jpg", [[48,77],[76,88],[60,19],[18,68],[87,34],[52,35],[29,20]]],
  ["minhwa02-original.jpg", [[76,39],[43,69],[77,80],[55,22],[30,24],[81,27],[20,52]]],
  ["minhwa03-original.webp", [[69,34],[31,21],[27,67],[89,12],[50,55],[44,88],[82,48]]],
  ["minhwa04-original.jpg", [[58,37],[38,57],[37,23],[78,35],[23,74],[63,90],[69,61]]],
  ["minhwa05-original.jpg", [[54,51],[75,25],[42,18],[66,64],[27,55],[79,72],[49,84]]],
  ["minhwa06-original.jpg", [[28,70],[67,73],[77,21],[39,34],[18,85],[57,63],[87,94]]],
  ["minhwa07-original.jpg", [[43,50],[47,30],[37,15],[44,75],[26,88],[18,82],[59,66]]],
  ["minhwa08-original.jpg", [[52,46],[47,72],[30,16],[68,29],[51,58],[74,88],[18,78]]],
  ["minhwa09-original.jpg", [[47,55],[61,56],[42,27],[68,31],[77,77],[51,88],[20,52]]],
  ["minhwa10-original.jpg", [[49,66],[55,88],[55,8],[37,43],[70,36],[25,27],[80,73]]],
];

function softMask(size) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs><radialGradient id="fade"><stop offset="0%" stop-color="white" stop-opacity="1"/><stop offset="58%" stop-color="white" stop-opacity=".95"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#fade)"/>
  </svg>`);
}

async function naturalPatch(sourcePath, area, variant) {
  const extracted = await sharp(sourcePath).extract(area).toBuffer();
  let editor = sharp(extracted);

  if (variant === 0) editor = editor.flop().modulate({ saturation: 1.04, brightness: 1.01 });
  if (variant === 1) editor = editor.flip().modulate({ saturation: .95, brightness: .98 });
  if (variant === 2) editor = editor.rotate(180).modulate({ saturation: 1.03 });
  if (variant === 3) editor = editor.modulate({ saturation: .42, brightness: 1.04 });
  if (variant === 4) editor = editor.modulate({ hue: 24, saturation: .82, brightness: .78 });

  return editor
    .ensureAlpha()
    .composite([{ input: softMask(area.width), blend: "dest-in" }])
    .png()
    .toBuffer();
}

for (let index = 0; index < artworks.length; index += 1) {
  const [sourceName, points] = artworks[index];
  const sourcePath = path.join(imageDir, sourceName);
  const metadata = await sharp(sourcePath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  if (!width || !height) throw new Error(`Could not read ${sourceName}`);

  const patchSize = Math.max(34, Math.round(Math.min(width, height) * 0.095));
  const overlays = [];
  for (let pointIndex = 0; pointIndex < 5; pointIndex += 1) {
    const [x, y] = points[pointIndex];
    const area = {
      left: Math.max(0, Math.min(width - patchSize, Math.round(width * x / 100 - patchSize / 2))),
      top: Math.max(0, Math.min(height - patchSize, Math.round(height * y / 100 - patchSize / 2))),
      width: patchSize,
      height: patchSize,
    };
    overlays.push({ input: await naturalPatch(sourcePath, area, pointIndex), left: area.left, top: area.top });
  }

  const number = String(index + 1).padStart(2, "0");
  await sharp(sourcePath)
    .composite(overlays)
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(imageDir, `minhwa${number}-difference-v3.webp`));
}

console.log("Created 10 natural difference boards without changing the originals.");
