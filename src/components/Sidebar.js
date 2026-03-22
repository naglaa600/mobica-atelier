"use client";

import { useState } from "react";
import OptionCard from "./OptionCard";
import { config } from "@/config";

export default function Sidebar({ selectedCladding, selectedDesk, onSelectCladding, onSelectDesk }) {
  // Flatten all items for animation delay calculation
  const totalCladdings = config.claddings.length;

  return (
    <aside
      style={{
        width: "320px",
        flexShrink: 0,
        height: "100vh",
        background: "#EDE5D8",
        borderRight: "1px solid #D6CCBC",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Logo + Branding */}
      <div
        style={{
          padding: "24px 24px 18px",
          borderBottom: "1px solid #D6CCBC",
          flexShrink: 0,
        }}
      >
        <LogoImage />
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "1.1rem",
            color: "#8B6B4A",
            letterSpacing: "0.06em",
            marginTop: "4px",
          }}
        >
          Atelier
        </div>
      </div>

      {/* Scrollable option sections */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 0" }}>

        {/* Claddings Section */}
        <SectionTitle>Cladding Finish</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
          {config.claddings.map((item, i) => (
            <OptionCard
              key={item.id}
              id={item.id}
              label={item.label}
              thumbSrc={`/images/claddings/${item.id}/thumb.jpg`}
              isSelected={selectedCladding === item.id}
              isDisabled={false}
              onSelect={onSelectCladding}
              animDelay={i * 60}
            />
          ))}
        </div>

        {/* Desks Section */}
        <SectionTitle>Desk Style</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
          {config.desks.map((item, i) => (
            <OptionCard
              key={item.id}
              id={item.id}
              label={item.label}
              thumbSrc={`/images/desks/${item.id}/thumb.jpg`}
              isSelected={selectedDesk === item.id}
              isDisabled={false}
              onSelect={onSelectDesk}
              animDelay={(totalCladdings + i) * 60}
            />
          ))}
        </div>

        {/* Chairs Section — Coming Soon */}
        <SectionTitle muted>Seating</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
          {config.chairs.length === 0 ? (
            /* Show placeholder cards when chairs array is empty */
            [0, 1].map((i) => (
              <PlaceholderCard key={i} animDelay={(totalCladdings + config.desks.length + i) * 60} />
            ))
          ) : (
            config.chairs.map((item, i) => (
              <OptionCard
                key={item.id}
                id={item.id}
                label={item.label}
                thumbSrc={`/images/chairs/${item.id}/thumb.jpg`}
                isSelected={false}
                isDisabled={true}
                onSelect={() => {}}
                animDelay={(totalCladdings + config.desks.length + i) * 60}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "14px 24px 18px",
          borderTop: "1px solid #D6CCBC",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: "0.68rem",
            letterSpacing: "0.06em",
            color: "#C8B89A",
          }}
        >
          Curated for Eng. Naglaa
        </p>
      </div>
    </aside>
  );
}

function SectionTitle({ children, muted }) {
  return (
    <h2
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "1.05rem",
        letterSpacing: "0.04em",
        color: muted ? "#C8B89A" : "#8B6B4A",
        margin: "0 0 12px 2px",
      }}
    >
      {children}
    </h2>
  );
}

function LogoImage() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mobica_logo.png"
      alt="Mobica"
      style={{ height: "28px", width: "auto", objectFit: "contain", display: "block" }}
      onError={() => setShow(false)}
    />
  );
}

function PlaceholderCard({ animDelay }) {
  return (
    <div
      className="card-enter"
      style={{
        animationDelay: `${animDelay}ms`,
        borderRadius: "2px",
        overflow: "hidden",
        border: "2px solid transparent",
        background: "#EDE0CE",
        filter: "grayscale(1) opacity(0.35)",
        position: "relative",
      }}
    >
      <div style={{ aspectRatio: "4/3", background: "#D6CCBC" }} />
      <div style={{ padding: "8px", fontSize: "0.78rem", fontFamily: "'Jost', sans-serif", fontWeight: 300, color: "#2C2218" }}>
        —
      </div>
      <div
        style={{
          position: "absolute",
          top: "6px",
          right: "6px",
          background: "#8B6B4A",
          color: "#F5F0E8",
          fontSize: "0.6rem",
          fontFamily: "'Jost', sans-serif",
          fontWeight: 400,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "2px 5px",
          borderRadius: "2px",
        }}
      >
        Coming Soon
      </div>
    </div>
  );
}
