"use client";

import { useEffect, useState } from "react";

type StatusResponse = {
  online?: boolean;
  players?: number;
  max?: number;
  discord?: number;
};

export default function Header() {
  const [players, setPlayers] = useState("...");
  const [max, setMax] = useState("...");
  const [discordCount, setDiscordCount] = useState("...");
  const [isOnline, setIsOnline] = useState(false);
  const serverIp = "mc-cloudberry.net";

  useEffect(() => {
    const load = () => {
      fetch("/api/status")
        .then((res) => res.json())
        .then((data: StatusResponse) => {
          setPlayers(String(data.players ?? 0));
          setMax(String(data.max ?? 0));
          setDiscordCount(String(data.discord ?? 0));
          setIsOnline(Boolean(data.online));
        })
        .catch(() => {
          setPlayers("0");
          setMax("0");
          setDiscordCount("0");
          setIsOnline(false);
        });
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  async function copyIp() {
    await navigator.clipboard.writeText(serverIp);
    alert("Copied server IP!");
  }

  return (
    <header className="cb-header">
      <div className="cb-left">
        <a className="cb-brand" href="/">{"\u2601\ufe0f"} CloudBerry</a>
        <a className="cb-link" href="/">Home</a>
        <a className="cb-link" href="/apply">Staff Applications</a>
        <a className="cb-link" href="https://shop.mc-cloudberry.com" target="_blank" rel="noopener noreferrer">
          Store
        </a>
        <a href="/contact" className="cb-link">
          Contact
        </a>
      </div>

      <div className="cb-right">
        <button className="cb-pill" onClick={copyIp}>
          {"\ud83c\udf10"} {serverIp}{" "}
          <span>
            <span className={isOnline ? "status-dot online" : "status-dot offline"} />
            ({players}/{max} online)
          </span>
        </button>

        <a className="cb-pill" href="https://discord.gg/cloudberry" target="_blank" rel="noopener noreferrer">
          {"\ud83d\udcac"} Discord <span>({discordCount})</span>
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

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 6px;
          border-radius: 50%;
          animation: pulse-dot 1.5s infinite;
        }

        .status-dot.online {
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e, 0 0 16px #22c55e;
        }

        .status-dot.offline {
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444, 0 0 16px #ef4444;
        }

        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.6;
          }
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
