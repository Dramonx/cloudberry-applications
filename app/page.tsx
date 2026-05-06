"use client";

export default function HomePage() {
  return (
    <main>
      <div className="sky" />
      <div className="sun" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="block-layer layer-back" />
      <div className="block-layer layer-mid" />
      <div className="block-layer layer-front" />
      <div className="particles" />
      <div className="scanlines" />

      <section className="hero-shell">
        <div className="hero-left">
          <div className="logo-stage">
            <img src="/CloudBerry.png" alt="CloudBerry logo" />
          </div>

          <div className="status-pill">
            <span className="pulse" /> CLOUDBERRY NETWORK ONLINE
          </div>

          <h1>
            Welcome to<br />
            <span>CloudBerry</span>
          </h1>

          <p className="subtitle">
            A Minecraft server built around fun, community, and unforgettable gameplay. Whether you are grinding, exploring, battling, or just hanging out with friends, CloudBerry is made to feel welcoming, polished, and alive.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigator.clipboard.writeText("mc-cloudberry.net")}>Copy Server IP</button>
            <a href="/apply">Apply for Staff</a>
          </div>
        </div>

        <div className="lobby-card">
          <div className="panel-glow" />
          <div className="panel lobby-panel">
            <p className="eyebrow">LOBBY PREVIEW</p>
            <div className="lobby-placeholder">
              <div className="placeholder-grid" />
              <img src="/cloudberrylobby.png" alt="CloudBerry Lobby logo" />
            </div>
          </div>
        </div>
      </section>

      <section className="content-shell">
        <div className="panel about-panel">
          <p className="eyebrow">WHO WE ARE</p>
          <h2>Built for players who want more than “just another server.”</h2>
          <p>
            CloudBerry is a growing Minecraft community focused on smooth gameplay, friendly players, and game modes that feel rewarding from the moment you join. Our goal is simple: create a server where people actually want to stay, make friends, compete, build, and come back every day.
          </p>
        </div>

        <div className="gamemodes">
          <div className="mode-card">
            <span className="mode-chip">LIVE MODE</span>
            <h3>Gen PvP</h3>
            <p>
              Jump into a fast-paced PvP experience where generators, progression, upgrades, and combat all come together. Build your setup, grow stronger, and battle your way to the top.
            </p>
          </div>

          <div className="mode-card">
            <span className="mode-chip">LIVE MODE</span>
            <h3>Survival</h3>
            <p>
              A friendly survival world made for players who love exploring, building, grinding, trading, and creating a home inside the CloudBerry community.
            </p>
          </div>

          <div className="mode-card coming">
            <span className="mode-chip">COMING SOON</span>
            <h3>More Adventures</h3>
            <p>
              New content is already in the works. Expect more modes, events, rewards, and features as CloudBerry continues to grow.
            </p>
          </div>
        </div>

        <div className="team-card">
          <div className="avatar-wrap">
            <img src="https://mc-heads.net/body/Dramonx1" alt="Dramonx Minecraft avatar" />
          </div>

          <div>
            <p className="eyebrow">STAFF TEAM</p>
            <h2>Owner: Dramonx</h2>
            <p>
              My goal with CloudBerry is to grow a server that feels friendly, enjoyable, and worth being part of. I want players to have a place where they can have fun, meet people, and experience a community that actually cares about quality.
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; min-height: 100%; background: #071626; color: white; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        main { min-height: 100vh; position: relative; overflow: hidden; padding: 92px 20px 130px; background: linear-gradient(180deg, #64c7ff 0%, #bdecff 35%, #fff2c2 62%, #1e293b 100%); }
        .sky { position: absolute; inset: 0; background: radial-gradient(circle at 17% 14%, rgba(255,255,255,.95), transparent 13%), radial-gradient(circle at 78% 18%, rgba(255,179,71,.62), transparent 18%), linear-gradient(180deg, rgba(56,189,248,.18), rgba(15,23,42,.35)); }
        .sun { position: absolute; width: 220px; height: 220px; right: 8%; top: 8%; border-radius: 50%; background: radial-gradient(circle, rgba(255,244,180,1), rgba(251,146,60,.58) 45%, transparent 70%); filter: blur(2px); animation: sunPulse 5s ease-in-out infinite; }
        .cloud { position: absolute; height: 42px; background: rgba(255,255,255,.88); border-radius: 10px; filter: drop-shadow(0 12px 18px rgba(15,23,42,.14)); opacity: .88; animation: cloudMove 28s linear infinite; }
        .cloud:before, .cloud:after { content: ""; position: absolute; background: inherit; border-radius: 10px; }
        .cloud:before { width: 58px; height: 58px; left: 20px; bottom: 10px; }
        .cloud:after { width: 78px; height: 78px; left: 72px; bottom: 8px; }
        .cloud-1 { width: 170px; left: -190px; top: 12%; animation-duration: 34s; }
        .cloud-2 { width: 130px; left: -170px; top: 27%; animation-duration: 26s; animation-delay: -10s; transform: scale(.75); }
        .cloud-3 { width: 210px; left: -230px; top: 47%; animation-duration: 40s; animation-delay: -20s; transform: scale(.55); opacity: .7; }
        .block-layer { position: fixed; left: -8%; right: -8%; bottom: 0; height: 220px; image-rendering: pixelated; pointer-events: none; }
        .layer-back { bottom: 150px; opacity: .32; animation: terrainBack 18s linear infinite; background-size: 160px 80px; background-image: linear-gradient(45deg, transparent 25%, rgba(34,197,94,.45) 25% 50%, transparent 50% 75%, rgba(34,197,94,.45) 75%), linear-gradient(#166534 0 36px, #854d0e 36px 58px, #475569 58px 80px); }
        .layer-mid { bottom: 64px; opacity: .85; animation: terrainMid 12s linear infinite; background-size: 120px 96px; background-image: linear-gradient(90deg, rgba(22,101,52,1) 0 50%, rgba(21,128,61,1) 50% 100%), linear-gradient(#22c55e 0 28px, #854d0e 28px 68px, #334155 68px 96px); clip-path: polygon(0 25%, 8% 20%, 14% 32%, 22% 16%, 31% 30%, 42% 18%, 50% 31%, 64% 17%, 73% 28%, 86% 14%, 100% 25%, 100% 100%, 0 100%); }
        .layer-front { bottom: -46px; height: 150px; animation: terrainFront 8s linear infinite; background-size: 96px 96px; background-image: linear-gradient(90deg, rgba(21,128,61,1) 0 50%, rgba(34,197,94,1) 50% 100%), linear-gradient(#22c55e 0 24px, #92400e 24px 70px, #1f2937 70px 96px); box-shadow: 0 -18px 50px rgba(0,0,0,.28); }
        .particles { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.85) 1px, transparent 1.5px), radial-gradient(circle, rgba(251,191,36,.8) 1px, transparent 1.5px); background-size: 90px 90px, 140px 140px; animation: particles 14s linear infinite; opacity: .42; }
        .scanlines { pointer-events: none; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,.05) 50%, transparent 100%); background-size: 100% 6px; opacity: .18; mix-blend-mode: overlay; }
        .hero-shell, .content-shell { position: relative; z-index: 2; width: min(1220px, 100%); margin: 0 auto; }
        .hero-shell { display: grid; grid-template-columns: 1fr 650px; gap: 34px; align-items: center; min-height: 78vh; }
        .logo-stage { width: min(540px, 96%); margin-bottom: 18px; position: relative; animation: logoFloat 5s ease-in-out infinite; }
        .logo-stage:after { content: ""; position: absolute; inset: 10% 6% 0; background: rgba(251,146,60,.35); filter: blur(40px); z-index: -1; }
        .logo-stage img { width: 100%; display: block; filter: drop-shadow(0 26px 50px rgba(15,23,42,.38)); }
        .status-pill { display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px; border: 2px solid rgba(255,255,255,.5); background: rgba(8,47,73,.64); border-radius: 999px; color: #e0f2fe; font-size: 12px; font-weight: 1000; letter-spacing: .16em; box-shadow: 0 0 30px rgba(56,189,248,.26); backdrop-filter: blur(12px); }
        .pulse { width: 9px; height: 9px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 16px #22c55e; animation: pulse 1.4s infinite; }
        h1 { margin: 20px 0 18px; font-size: clamp(48px, 7vw, 88px); line-height: .92; letter-spacing: -0.075em; font-weight: 1000; color: #f8fafc; text-shadow: 0 6px 0 rgba(15,23,42,.35), 0 0 46px rgba(56,189,248,.24); }
        h1 span { color: #fbbf24; text-shadow: 0 6px 0 rgba(124,45,18,.45), 0 0 34px rgba(251,191,36,.35); }
        .subtitle { max-width: 690px; color: #f8fafc; font-size: 18px; line-height: 1.75; text-shadow: 0 2px 16px rgba(15,23,42,.55); }
        .hero-buttons { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 26px; }
        .hero-buttons button, .hero-buttons a { border: 0; border-radius: 8px; padding: 16px 18px; color: #082f49; font-size: 15px; font-weight: 1000; text-decoration: none; background: linear-gradient(135deg, #7dd3fc, #fde68a, #fb923c); box-shadow: 0 8px 0 rgba(124,45,18,.5), 0 18px 40px rgba(251,146,60,.22); cursor: pointer; transition: .2s ease; }
        .hero-buttons button:hover, .hero-buttons a:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .panel-glow { position: absolute; inset: -4px; border-radius: 18px; background: linear-gradient(135deg, #38bdf8, #ffffff, #fb923c); filter: blur(18px); opacity: .65; animation: glow 4s ease-in-out infinite; }
        .panel, .mode-card, .team-card { position: relative; border-radius: 16px; border: 3px solid rgba(255,255,255,.24); background: linear-gradient(180deg, rgba(12,32,55,.93), rgba(3,7,18,.94)); backdrop-filter: blur(24px); box-shadow: 0 32px 90px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.14), 0 10px 0 rgba(15,23,42,.42); overflow: hidden; }
        .panel { padding: 26px; }
        .lobby-card { transform: translate(60px, -20px); position: relative; }
        .lobby-placeholder { min-height: unset; border-radius: 12px; border: 2px dashed rgba(125,211,252,.34); display: grid; place-items: center; text-align: center; padding: 28px; background: linear-gradient(135deg, rgba(14,165,233,.22), rgba(251,146,60,.16)); overflow: hidden; }
        .placeholder-grid { position: absolute; inset: 0; opacity: .32; background-size: 36px 36px; background-image: linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px); animation: particles 10s linear infinite; }
        .lobby-placeholder h2, .lobby-placeholder p { position: relative; }
        .lobby-placeholder h2 { font-size: 30px; margin: 0 0 8px; }
        .lobby-placeholder p { color: #cbd5e1; margin: 0; }
        .lobby-placeholder img { width: 100%; height: 375px; object-fit: cover; border-radius: 16px; transition: transform 0.3s ease; }
        .lobby-placeholder img:hover { transform: scale(1.03); }
        .content-shell { display: grid; gap: 24px; padding-bottom: 80px; }
        .about-panel { padding: 30px; }
        .eyebrow { margin: 0 0 10px; color: #7dd3fc; font-size: 11px; font-weight: 1000; letter-spacing: .18em; }
        h2 { margin: 0 0 12px; font-size: 34px; letter-spacing: -.05em; }
        p { line-height: 1.7; }
        .about-panel p, .mode-card p, .team-card p { color: #dbeafe; font-size: 17px; }
        .gamemodes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .mode-card { padding: 24px; transition: .2s ease; }
        .mode-card:hover { transform: translateY(-5px); box-shadow: 0 0 34px rgba(125,211,252,.34), 0 32px 90px rgba(0,0,0,.45); }
        .mode-chip { display: inline-flex; margin-bottom: 14px; padding: 7px 10px; border-radius: 4px; color: #082f49; background: #7dd3fc; font-size: 11px; font-weight: 1000; letter-spacing: .1em; }
        .coming .mode-chip { background: #fbbf24; }
        h3 { margin: 0; font-size: 30px; }
        .team-card { display: grid; grid-template-columns: 220px 1fr; gap: 26px; padding: 28px; align-items: center; }
        .avatar-wrap { min-height: 270px; display: grid; place-items: end center; border-radius: 12px; background: radial-gradient(circle at 50% 20%, rgba(125,211,252,.35), transparent 60%); border: 2px solid rgba(255,255,255,.14); overflow: hidden; }
        .avatar-wrap img { height: 265px; image-rendering: pixelated; filter: drop-shadow(0 20px 24px rgba(0,0,0,.38)); }
        @keyframes cloudMove { from { transform: translateX(0); } to { transform: translateX(calc(100vw + 280px)); } }
        @keyframes terrainBack { from { background-position: 0 0, 0 0; } to { background-position: -160px 0, -160px 0; } }
        @keyframes terrainMid { from { background-position: 0 0, 0 0; } to { background-position: -120px 0, -120px 0; } }
        @keyframes terrainFront { from { background-position: 0 0, 0 0; } to { background-position: -96px 0, -96px 0; } }
        @keyframes particles { from { background-position: 0 0, 0 0; } to { background-position: 90px -90px, -140px 140px; } }
        @keyframes logoFloat { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes sunPulse { 0%,100% { transform: scale(1); opacity: .88; } 50% { transform: scale(1.08); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(1.45); } }
        @keyframes glow { 0%,100% { opacity: .42; } 50% { opacity: .82; } }
        @media (max-width: 980px) { .hero-shell, .gamemodes, .team-card { grid-template-columns: 1fr; } .hero-left { text-align: center; } .logo-stage { margin-left: auto; margin-right: auto; } .hero-buttons { justify-content: center; } }
      `}</style>
    </main>
  );
}
