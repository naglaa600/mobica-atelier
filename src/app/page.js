"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PreviewPanel from "@/components/PreviewPanel";

export default function Home() {
  const [selectedCladding, setSelectedCladding] = useState(null);
  const [selectedDesk, setSelectedDesk] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#F5F0E8",
      }}
    >
      <Sidebar
        selectedCladding={selectedCladding}
        selectedDesk={selectedDesk}
        onSelectCladding={(id) => setSelectedCladding((prev) => (prev === id ? null : id))}
        onSelectDesk={(id) => setSelectedDesk((prev) => (prev === id ? null : id))}
      />
      <PreviewPanel
        selectedCladding={selectedCladding}
        selectedDesk={selectedDesk}
      />
    </div>
  );
}
