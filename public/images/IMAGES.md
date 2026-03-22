# Image Placeholder Guide

Drop your images into this folder following this structure:

## Claddings
```
/public/images/claddings/
  wood/
    preview.jpg   ← Full-bleed background image (recommended: 1600×900px or larger)
    thumb.jpg     ← Thumbnail for sidebar card (recommended: 400×300px)
  stone/
    preview.jpg
    thumb.jpg
  concrete/
    preview.jpg
    thumb.jpg
```

## Desks
```
/public/images/desks/
  standing/
    preview.png   ← MUST be PNG with transparent background (recommended: 1000×800px)
    thumb.jpg     ← Thumbnail for sidebar card (recommended: 400×300px)
  l-shape/
    preview.png
    thumb.jpg
  minimal/
    preview.png
    thumb.jpg
```

## Chairs (future)
```
/public/images/chairs/
  ergonomic/
    preview.png   ← PNG with transparent background
    thumb.jpg
```

## Notes
- Cladding previews are `jpg` (full-bleed background layer, no transparency needed)
- Desk/Chair previews are `png` with transparent backgrounds so they composite cleanly over the cladding
- Thumbnails can be `jpg` in any size — they'll be cropped to a 4:3 ratio in the UI
- Missing files are silently hidden — no errors shown
