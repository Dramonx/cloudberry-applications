"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [players, setPlayers] = useState("...");
  const [discordCount, setDiscordCount] = useState("...");
  const serverIp = "mc-cloudberry.net";

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players ?? "0");
        setDiscordCount(data.discord ?? "0");
      })
      .catch(() => {
        setPlayers("0");
        setDiscordCount("0");
      });
  }, []);

  async function copyIp() {
    await navigator.clipboard.writeText(serverIp);
    alert("Copied server IP!");
  }

  return (
    <header className="cb-header">
      <div className="cb-left">
        <a className="cb-brand" href="/">
          ☁️ CloudBerry
        </a>

        <a className="cb-link" href="/">
          Home
        </a>

        <a className="cb-link" href="/apply">
          Staff Applications
        </a>

        <a
          className="cb-link"
          href="https://shop.minecrafty.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Store
        </a>
      </div>

      <div className="cb-right">
        <button className="cb-pill" onClick={copyIp}>
          🌐 {serverIp} <span>({players}/{max} online)</span>
        </button>

        <a
          className="cb-pill"
          href="https://discord.gg/YOUR_INVITE"
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Discord <span>({discordCount})</span>
        </a>
      </div>

      <style jsx>{`
        .cb-header {
          position: sticky;
          top: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 14px 26px;
          background: rgba(7, 22, 38, 0.88);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(125, 211, 252, 0.25);
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.25);
        }

        .cb-left,
        .cb-right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .cb-brand {
          color: white;
          font-weight: 1000;
          font-size: 20px;
          text-decoration: none;
          margin-right: 10px;
          text-shadow: 0 0 20px rgba(125, 211, 252, 0.55);
        }

        .cb-link,
        .cb-pill {
          color: #e0f2fe;
          text-decoration: none;
          border: 1px solid rgba(125, 211, 252, 0.25);
          background: rgba(255, 255, 255, 0.07);
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .cb-pill {
          font-family: inherit;
        }

        .cb-link:hover,
        .cb-pill:hover {
          color: #082f49;
          background: linear-gradient(135deg, #7dd3fc, #fde68a, #fb923c);
          box-shadow:
            0 0 18px rgba(125, 211, 252, 0.85),
            0 0 34px rgba(251, 146, 60, 0.45);
          transform: translateY(-2px);
        }

        .cb-pill span {
          opacity: 0.85;
        }

        @media (max-width: 850px) {
          .cb-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .cb-left,
          .cb-right {
            width: 100%;
          }
        }
      `}</style>
    </header>
  );
}
