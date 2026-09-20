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

const colors = ["#c93b49", "#168f86", "#6350a0", "#dc8325", "#32865b", "#c8477c", "#3376a8"];

function motifSvg(size, color, variant) {
  const center = size / 2;
  const stroke = Math.max(2, Math.round(size * 0.026));
  const common = `stroke="#49392e" stroke-width="${stroke}" stroke-linejoin="round" opacity=".9"`;
  const shapes = [
    `<g><circle cx="${center}" cy="${center}" r="${size*.27}" fill="${color}" ${common}/><circle cx="${center}" cy="${center}" r="${size*.09}" fill="#e9b945" opacity=".9"/></g>`,
    `<g transform="rotate(-28 ${center} ${center})"><ellipse cx="${center}" cy="${center}" rx="${size*.34}" ry="${size*.19}" fill="${color}" ${common}/><path d="M${size*.25} ${center} Q${center} ${size*.43} ${size*.75} ${center}" fill="none" stroke="#e9d69b" stroke-width="${stroke*.65}" opacity=".8"/></g>`,
    `<g><path d="M${center} ${size*.14} L${size*.61} ${size*.39} L${size*.87} ${center} L${size*.61} ${size*.61} L${center} ${size*.87} L${size*.39} ${size*.61} L${size*.13} ${center} L${size*.39} ${size*.39} Z" fill="${color}" ${common}/><circle cx="${center}" cy="${center}" r="${size*.08}" fill="#e9b945" opacity=".9"/></g>`,
    `<g transform="rotate(18 ${center} ${center})"><rect x="${size*.17}" y="${size*.27}" width="${size*.66}" height="${size*.15}" rx="${size*.07}" fill="${color}" ${common}/><rect x="${size*.17}" y="${size*.58}" width="${size*.66}" height="${size*.15}" rx="${size*.07}" fill="${color}" ${common}/></g>`,
  ];
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${shapes[variant % shapes.length]}</svg>`);
}

for (let index = 0; index < artworks.length; index += 1) {
  const [sourceName, points] = artworks[index];
  const sourcePath = path.join(imageDir, sourceName);
  const metadata = await sharp(sourcePath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  if (!width || !height) throw new Error(`Could not read ${sourceName}`);

  const motifSize = Math.max(32, Math.round(Math.min(width, height) * 0.085));
  const overlays = points.slice(0, 5).map(([x, y], pointIndex) => ({
    input: motifSvg(motifSize, colors[(index + pointIndex) % colors.length], pointIndex),
    left: Math.max(0, Math.min(width - motifSize, Math.round(width * x / 100 - motifSize / 2))),
    top: Math.max(0, Math.min(height - motifSize, Math.round(height * y / 100 - motifSize / 2))),
  }));

  const number = String(index + 1).padStart(2, "0");
  await sharp(sourcePath)
    .composite(overlays)
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(imageDir, `minhwa${number}-difference-v3.webp`));
}

console.log("Created 10 clear difference boards without changing the originals.");
