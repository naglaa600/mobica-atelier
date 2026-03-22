"use client";

import { useState } from "react";
import { config } from "@/config";
import Sidebar from "@/components/Sidebar";
import PreviewPanel from "@/components/PreviewPanel";

export default function Home() {
  const [selectedCladding, setSelectedCladding] = useState(config.claddings[0]?.id ?? null);
  const [selectedDesk, setSelectedDesk] = useState(config.desks[0]?.id ?? null);

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
        onSelectCladding={setSelectedCladding}
        onSelectDesk={setSelectedDesk}
      />
      <PreviewPanel
        selectedCladding={selectedCladding}
        selectedDesk={selectedDesk}
      />
    </div>
  );
}
