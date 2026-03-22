"use client";

import { useState, useEffect, useRef } from "react";
import { config } from "@/config";

export default function PreviewPanel({ selectedCladding, selectedDesk }) {
  const claddingLabel = config.claddings.find((c) => c.id === selectedCladding)?.label ?? "";
  const deskLabel     = config.desks.find((d) => d.id === selectedDesk)?.label ?? "";
  const caption       = [claddingLabel, deskLabel].filter(Boolean).join(" · ");

  // Combined pre-rendered image: e.g. /images/combinations/desk-1_cladding-2.jpg
  const combinedSrc = selectedDesk && selectedCladding
    ? `/images/combinations/${selectedDesk}_${selectedCladding}.jpg`
    : null;

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
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "2px",
              background: "#EAE3D8",
            }}
          >
            {combinedSrc ? (
              <ImageLayer
                src={combinedSrc}
                alt={caption}
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
                  Select a finish and desk to begin
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Caption plaque */}
        <div
          style={{
            marginTop: "16px",
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
      </div>
    </main>
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
      setBack(front);          // current front becomes the outgoing back
      setFront(src);           // new src is the incoming front (opacity 0)
      setFrontVisible(false);
      // Two rAFs ensure the opacity-0 frame is painted before we trigger the transition
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
      {/* Outgoing image fades out once the incoming one starts its fade-in */}
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
      {/* Incoming image fades in */}
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
