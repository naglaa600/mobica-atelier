"use client";

import { useState } from "react";

function Thumbnail({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: "#D6CCBC" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8B89A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className="w-full h-full"
      style={{ objectFit: "cover", display: "block" }}
      onError={() => setFailed(true)}
    />
  );
}

export default function OptionCard({
  id,
  label,
  thumbSrc,
  isSelected,
  isDisabled,
  onSelect,
  animDelay = 0,
}) {
  return (
    <button
      onClick={isDisabled ? undefined : () => onSelect(id)}
      disabled={isDisabled}
      className="relative text-left w-full rounded-sm overflow-hidden card-enter"
      style={{
        animationDelay: `${animDelay}ms`,
        cursor: isDisabled ? "default" : "pointer",
        border: isSelected
          ? "2px solid #8B6B4A"
          : "2px solid transparent",
        background: isSelected ? "#EDE5D8" : "#EDE0CE",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease",
        boxShadow: isSelected
          ? "0 2px 12px rgba(139,107,74,0.18)"
          : "0 1px 4px rgba(44,34,24,0.06)",
        filter: isDisabled ? "grayscale(1) opacity(0.45)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isDisabled && !isSelected) {
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,107,74,0.2)";
          e.currentTarget.style.borderColor = "#C8B89A";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && !isSelected) {
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(44,34,24,0.06)";
          e.currentTarget.style.borderColor = "transparent";
        }
      }}
    >
      {/* Thumbnail */}
      <div className="w-full" style={{ aspectRatio: "4/3", overflow: "hidden", background: "#D6CCBC" }}>
        <Thumbnail src={thumbSrc} alt={label} />
      </div>

      {/* Label */}
      <div
        className="px-2 py-2"
        style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.78rem", letterSpacing: "0.04em", color: "#2C2218" }}
      >
        {label}
      </div>

      {/* Coming Soon badge */}
      {isDisabled && (
        <div
          className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-sm"
          style={{ background: "#8B6B4A", color: "#F5F0E8", fontSize: "0.6rem", fontFamily: "'Jost', sans-serif", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          Coming Soon
        </div>
      )}
    </button>
  );
}
