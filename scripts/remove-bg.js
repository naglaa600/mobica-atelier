/**
 * remove-bg.js
 * ------------
 * Removes white backgrounds from desk preview images.
 *
 * Input:  public/images/desks/desk-{N}/preview.jpg
 * Output: public/images/desks/desk-{N}/preview.png  (transparent PNG)
 *
 * Algorithm: flood-fill from image edges to mark connected white-ish background
 * pixels, then set those pixels to fully transparent. Handles anti-aliased edges
 * with a soft alpha gradient near the threshold boundary.
 *
 * Run once:  npm run process-images
 * Requires:  npm install sharp  (first time only)
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const DESKS_ROOT = path.join(__dirname, "../public/images/desks");
const THRESHOLD = 15; // how far from pure white (#FFF) a pixel can be and still be "background"
const FEATHER = 10;   // additional range for soft alpha blending at edges

async function removeWhiteBackground(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const channels = 3; // RGB after removeAlpha

  // ── 1. Flood-fill from all edge pixels to find connected background ──────
  const isBg = new Uint8Array(width * height); // 1 = confirmed background
  const queue = [];

  function enqueue(x, y) {
    const idx = y * width + x;
    if (isBg[idx]) return;
    const base = idx * channels;
    const r = data[base], g = data[base + 1], b = data[base + 2];
    // Allow up to THRESHOLD + FEATHER for the flood to consume near-white fringe too
    if (r < 255 - THRESHOLD - FEATHER || g < 255 - THRESHOLD - FEATHER || b < 255 - THRESHOLD - FEATHER) return;
    isBg[idx] = 1;
    queue.push(idx);
  }

  // Seed from all four edges
  for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
  for (let y = 1; y < height - 1; y++) { enqueue(0, y); enqueue(width - 1, y); }

  // BFS
  while (queue.length > 0) {
    const idx = queue.pop();
    const x = idx % width;
    const y = (idx - x) / width;
    if (x > 0)         enqueue(x - 1, y);
    if (x < width - 1) enqueue(x + 1, y);
    if (y > 0)         enqueue(x, y - 1);
    if (y < height - 1) enqueue(x, y + 1);
  }

  // ── 2. Build RGBA output ─────────────────────────────────────────────────
  const rgba = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const src = i * channels;
    const dst = i * 4;
    const r = data[src], g = data[src + 1], b = data[src + 2];

    rgba[dst]     = r;
    rgba[dst + 1] = g;
    rgba[dst + 2] = b;

    if (isBg[i]) {
      // Confirmed background — soft alpha based on how far from pure white
      const minChannel = Math.min(r, g, b);
      const distFromWhite = 255 - minChannel; // 0 = pure white, higher = less white

      if (distFromWhite <= THRESHOLD) {
        rgba[dst + 3] = 0; // fully transparent
      } else if (distFromWhite <= THRESHOLD + FEATHER) {
        // Gradient: 0 at THRESHOLD, 255 at THRESHOLD + FEATHER
        rgba[dst + 3] = Math.round(((distFromWhite - THRESHOLD) / FEATHER) * 255);
      } else {
        rgba[dst + 3] = 255; // opaque (shouldn't reach here for bg pixels)
      }
    } else {
      rgba[dst + 3] = 255; // foreground — fully opaque
    }
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

// ── Main ────────────────────────────────────────────────────────────────────

(async () => {
  const desks = fs.readdirSync(DESKS_ROOT).filter((name) => {
    const full = path.join(DESKS_ROOT, name);
    return fs.statSync(full).isDirectory();
  });

  let processed = 0;
  let skipped = 0;

  for (const desk of desks) {
    const inputPath  = path.join(DESKS_ROOT, desk, "preview.jpg");
    const outputPath = path.join(DESKS_ROOT, desk, "preview.png");

    if (!fs.existsSync(inputPath)) {
      console.log(`  ⚠  ${desk}: no preview.jpg — skipped`);
      skipped++;
      continue;
    }

    process.stdout.write(`  ${desk}: removing background… `);
    await removeWhiteBackground(inputPath, outputPath);
    console.log("✓");
    processed++;
  }

  console.log(`\n✅  Done — ${processed} processed, ${skipped} skipped.`);
})();
