"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [players, setPlayers] = useState("...");
  const [discordCount, setDiscordCount] = useState("...");

  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => {
        setPlayers(data.players);
        setDiscordCount(data.discord);
      });
  }, []);

  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 999,
      background: "rgba(10,20,40,0.9)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white"
    }}>
      
      {/* LEFT */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <b>CloudBerry</b>

        <a href="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </a>

        <a href="/apply" style={{ color: "white", textDecoration: "none" }}>
          Staff Applications
        </a>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        
        <span>
          🌐 mc.cloudberry.net ({players} online)
        </span>

        <a
          href="https://discord.gg/YOUR_INVITE"
          target="_blank"
          style={{ color: "#60a5fa", textDecoration: "none" }}
        >
          💬 Discord ({discordCount})
        </a>

      </div>
    </div>
  );
}
