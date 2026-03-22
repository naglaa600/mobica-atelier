/**
 * prepare-images.mjs
 * -------------------
 * Reads every `image.png` inside public/images/ and produces:
 *
 *   claddings/{id}/
 *     preview.jpg  ← full-size JPEG (background layer, no transparency needed)
 *     thumb.jpg    ← 400×300 JPEG thumbnail (4:3 crop from centre)
 *
 *   desks/{id}/
 *     preview.png  ← full-size PNG (keeps transparency for compositing)
 *     thumb.jpg    ← 400×300 JPEG thumbnail (4:3 crop from centre)
 *
 *   chairs/{id}/
 *     preview.png  ← full-size PNG
 *     thumb.jpg    ← 400×300 JPEG thumbnail
 *
 * Uses only macOS `sips` — no npm dependencies required.
 * Run with:  node scripts/prepare-images.mjs
 */

import { execSync } from "child_process";
import { existsSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = join(__dirname, "../public/images");

const THUMB_W = 400;
const THUMB_H = 300;

// ─── helpers ────────────────────────────────────────────────────────────────

function run(cmd) {
  try {
    execSync(cmd, { stdio: "pipe" });
  } catch (e) {
    console.error(`  ✗ command failed: ${cmd}`);
    console.error("   ", e.stderr?.toString().trim() ?? e.message);
  }
}

/** Use sips to resize + convert a file. */
function sipsConvert(src, dest, { format, maxWidth, maxHeight } = {}) {
  let cmd = `sips`;
  if (format) cmd += ` -s format ${format}`;
  if (maxWidth && maxHeight) cmd += ` --resampleHeightWidthMax ${maxHeight}:${maxWidth}`;
  else if (maxWidth) cmd += ` --resampleWidth ${maxWidth}`;
  else if (maxHeight) cmd += ` --resampleHeight ${maxHeight}`;
  cmd += ` "${src}" --out "${dest}"`;
  run(cmd);
}

/**
 * Resize to fit within 400x300 and convert to JPEG.
 * Since source images are small, we just scale to fit (no crop, no black padding).
 * CSS object-fit: cover on the card handles the visual cropping.
 */
function makeThumbnail(src, dest) {
  // Convert to JPEG, scale so longest edge fits within 400×300
  sipsConvert(src, dest, { format: "jpeg", maxWidth: THUMB_W, maxHeight: THUMB_H });
}

// ─── main ───────────────────────────────────────────────────────────────────

const categories = readdirSync(IMAGES_ROOT).filter((name) => {
  const full = join(IMAGES_ROOT, name);
  return statSync(full).isDirectory() && name !== "." && name !== "..";
});

let processed = 0;
let skipped = 0;

for (const category of categories) {
  const categoryPath = join(IMAGES_ROOT, category);
  const isCladding = category === "claddings";
  const isDesk = category === "desks";
  const isChair = category === "chairs";

  const items = readdirSync(categoryPath).filter((name) =>
    statSync(join(categoryPath, name)).isDirectory()
  );

  for (const item of items) {
    const itemPath = join(categoryPath, item);
    const src = join(itemPath, "image.png");

    if (!existsSync(src)) {
      console.log(`  ⚠  Skipping ${category}/${item} — no image.png found`);
      skipped++;
      continue;
    }

    console.log(`\n📂 ${category}/${item}`);

    // ── preview ──────────────────────────────────────────────────────────
    if (isCladding) {
      const dest = join(itemPath, "preview.jpg");
      console.log(`  → preview.jpg (JPEG, full size)`);
      sipsConvert(src, dest, { format: "jpeg" });
    } else if (isDesk || isChair) {
      const dest = join(itemPath, "preview.png");
      console.log(`  → preview.png (PNG, full size, transparency preserved)`);
      sipsConvert(src, dest, { format: "png" });
    }

    // ── thumbnail ────────────────────────────────────────────────────────
    const thumbDest = join(itemPath, "thumb.jpg");
    console.log(`  → thumb.jpg (${THUMB_W}×${THUMB_H} JPEG, centre-cropped)`);
    makeThumbnail(src, thumbDest);

    processed++;
  }
}

console.log(`\n✅ Done — ${processed} item(s) processed, ${skipped} skipped.\n`);
