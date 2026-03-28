"use client";

import { useState, useEffect, useRef } from "react";
import { config } from "@/config";

export default function PreviewPanel({ selectedCladding, selectedDesk, selectedSofa }) {
  const claddingLabel = config.claddings.find((c) => c.id === selectedCladding)?.label ?? "";
  const deskLabel     = config.desks.find((d) => d.id === selectedDesk)?.label ?? "";
  const sofaLabel     = config.sofas.find((s) => s.id === selectedSofa)?.label ?? "";
  const caption       = [claddingLabel, deskLabel, sofaLabel].filter(Boolean).join(" · ");

  const [deskX, setDeskX] = useState(0);
  const [deskY, setDeskY] = useState(0);
  const [sofaX, setSofaX] = useState(0);
  const [sofaY, setSofaY] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const canvasContainerRef = useRef(null);

  // Reset desk position when desk selection changes
  useEffect(() => {
    setDeskX(0);
    setDeskY(0);
  }, [selectedDesk]);

  // Reset sofa position when sofa selection changes
  useEffect(() => {
    setSofaX(0);
    setSofaY(0);
  }, [selectedSofa]);

  async function handleDownload() {
    if (!claddingSrc) return;
    setDownloading(true);

    const container = canvasContainerRef.current;
    const W = container?.offsetWidth  ?? 1200;
    const H = container?.offsetHeight ?? 800;

    const offscreen = document.createElement("canvas");
    offscreen.width  = W;
    offscreen.height = H;
    const ctx = offscreen.getContext("2d");

    function drawCover(img) {
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const w = img.naturalWidth  * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    }

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload  = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    try {
      // Draw cladding base
      const claddingImg = await loadImage(claddingSrc);
      drawCover(claddingImg);

      // Draw desk overlay with current offset
      if (deskSrc) {
        const deskImg = await loadImage(deskSrc);
        const offsetX = (deskX / 100) * W;
        const offsetY = (deskY / 100) * H;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        drawCover(deskImg);
        ctx.restore();
      }

      // Draw sofa overlay with current offset
      if (sofaSrc) {
        const sofaImg = await loadImage(sofaSrc);
        const offsetX = (sofaX / 100) * W;
        const offsetY = (sofaY / 100) * H;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        drawCover(sofaImg);
        ctx.restore();
      }

      offscreen.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a   = document.createElement("a");
        a.href     = url;
        a.download = `mobica-${caption.replace(/\s·\s/g, "_").replace(/\s/g, "-").toLowerCase() || "composition"}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloading(false);
      }, "image/png");
    } catch {
      setDownloading(false);
    }
  }

  const claddingSrc = selectedCladding
    ? `/images/claddings/${selectedCladding}/preview.jpg`
    : null;

  const deskSrc = selectedDesk
    ? `/images/desks/${selectedDesk}/preview.png`
    : null;

  const sofaSrc = selectedSofa
    ? `/images/sofas/${selectedSofa}/preview.png`
    : null;

  const showDesk = !!deskSrc;
  const showSofa = !!sofaSrc;

  return (
    <main
      style={{
        flex: 1,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F0E8",
        position: "relative",
        overflow: "hidden",
        padding: "40px",
      }}
    >
      {/* Framed presentation board */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "82%",
          maxHeight: "88%",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Outer frame — matte border + shadow */}
        <div
          style={{
            position: "relative",
            flex: 1,
            width: "100%",
            minHeight: 0,
            background: "#FFFFFF",
            borderRadius: "3px",
            padding: "14px",
            boxShadow:
              "0 2px 8px rgba(44,34,24,0.08), 0 8px 32px rgba(44,34,24,0.10), 0 0 0 1px rgba(44,34,24,0.04)",
          }}
        >
          {/* Inner canvas */}
          <div
            ref={canvasContainerRef}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "2px",
              background: (deskSrc || sofaSrc) && !claddingSrc ? "#FFFFFF" : "#EAE3D8",
            }}
          >
            {/* Cladding base layer */}
            {claddingSrc ? (
              <ImageLayer
                src={claddingSrc}
                alt={claddingLabel}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "1.2rem",
                    color: "#C8B89A",
                    letterSpacing: "0.05em",
                  }}
                >
                  Select a finish to begin
                </p>
              </div>
            )}

            {/* Desk overlay — crossfades like cladding */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translate(${deskX}%, ${deskY}%)`,
                transition: "transform 0.1s ease",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <ImageLayer
                src={deskSrc}
                alt={deskLabel}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Sofa overlay — crossfades like cladding */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translate(${sofaX}%, ${sofaY}%)`,
                transition: "transform 0.1s ease",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <ImageLayer
                src={sofaSrc}
                alt={sofaLabel}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Positioning controls — shown when desk or sofa is overlaid */}
            {(showDesk || showSofa) && (
              <div
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "6px",
                  padding: "10px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                  boxShadow:
                    "0 2px 12px rgba(44,34,24,0.12), 0 0 0 1px rgba(44,34,24,0.06)",
                  zIndex: 10,
                  whiteSpace: "nowrap",
                }}
              >
                {showDesk && (
                  <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                    <SliderControl
                      label="← →"
                      value={deskX}
                      onChange={setDeskX}
                      width="75px"
                    />
                    <div
                      style={{
                        width: "1px",
                        height: "28px",
                        background: "rgba(44,34,24,0.12)",
                        flexShrink: 0,
                      }}
                    />
                    <SliderControl
                      label="↑ ↓"
                      value={deskY}
                      onChange={setDeskY}
                      width="75px"
                    />
                  </div>
                )}
                {showDesk && showSofa && (
                  <div style={{ width: "100%", height: "1px", background: "rgba(44,34,24,0.12)" }} />
                )}
                {showSofa && (
                  <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                    <SliderControl
                      label="← →"
                      value={sofaX}
                      onChange={setSofaX}
                      width="75px"
                    />
                    <div
                      style={{
                        width: "1px",
                        height: "28px",
                        background: "rgba(44,34,24,0.12)",
                        flexShrink: 0,
                      }}
                    />
                    <SliderControl
                      label="↑ ↓"
                      value={sofaY}
                      onChange={setSofaY}
                      width="75px"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Prompt when only cladding is selected */}
            {claddingSrc && !showDesk && !showSofa && (
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "4px",
                  padding: "6px 16px",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#8B6B4A",
                    whiteSpace: "nowrap",
                  }}
                >
                  Select a desk or sofa to overlay
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Caption plaque + download */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
        <div
          style={{
            flex: 1,
            padding: "8px 24px",
            background: "#FFFFFF",
            borderRadius: "2px",
            boxShadow: "0 1px 4px rgba(44,34,24,0.06), 0 0 0 1px rgba(44,34,24,0.03)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              color: caption ? "#8B6B4A" : "#C8B89A",
              minHeight: "1.2em",
            }}
          >
            {caption || "—"}
          </p>
          {caption && (
            <p
              style={{
                margin: "3px 0 0",
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C8B89A",
              }}
            >
              Interior Composition
            </p>
          )}
        </div>

        {/* Download button */}
        {claddingSrc && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            title="Download composition"
            style={{
              flexShrink: 0,
              height: "100%",
              padding: "0 14px",
              background: downloading ? "#C8B89A" : "#8B6B4A",
              border: "none",
              borderRadius: "2px",
              cursor: downloading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(44,34,24,0.06), 0 0 0 1px rgba(44,34,24,0.03)",
              transition: "background 0.2s ease",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 1v9m0 0L4.5 7m3 3 3-3M1.5 13h12"
                stroke="#F5F0E8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        </div>
      </div>
    </main>
  );
}

// ── SliderControl ───────────────────────────────────────────────────────────

function SliderControl({ label, value, onChange, width = "110px" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "#8B6B4A",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <input
        type="range"
        min="-30"
        max="30"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: width,
          accentColor: "#8B6B4A",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

// ── ImageLayer ─────────────────────────────────────────────────────────────
// Crossfades between images: the previous stays visible while the next
// preloads, then both transition simultaneously (old → 0, new → 1).

function ImageLayer({ src, alt, style }) {
  const [back, setBack] = useState(null);
  const [front, setFront] = useState(null);
  const [frontVisible, setFrontVisible] = useState(false);
  const pendingRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setBack(null);
      setFront(null);
      setFrontVisible(false);
      return;
    }

    if (src === front) return;

    pendingRef.current = src;

    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      if (pendingRef.current !== src) return; // stale load
      setBack(front);
      setFront(src);
      setFrontVisible(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFrontVisible(true));
      });
    };

    return () => { img.onload = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const TRANSITION = "opacity 500ms ease";

  return (
    <>
      {back && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={back}
          alt=""
          style={{
            ...style,
            opacity: frontVisible ? 0 : 1,
            transition: TRANSITION,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      )}
      {front && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={front}
          alt={alt ?? ""}
          style={{
            ...style,
            opacity: frontVisible ? 1 : 0,
            transition: frontVisible ? TRANSITION : "none",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      )}
    </>
  );
}
