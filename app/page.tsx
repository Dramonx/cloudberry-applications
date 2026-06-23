"use client";

export default function HomePage() {
  return (
    <main className="home-page">
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

      <div className="team-card">
        <div className="avatar-wrap">
          <img src="https://mc-heads.net/body/Zxenith_" alt="Zxenith_ Minecraft avatar" />
        </div>
      
        <div>
          <p className="eyebrow">STAFF TEAM</p>
          <h2>Assistant Manager: Zxenith</h2>
          <p>
            Hi, I’m Zxenith at Cloud Berry. I focus on helping both players and staff, 
            keeping things organized, and making sure the server stays enjoyable for everyone. 
            I take my role seriously but also love connecting with the community—so don’t be shy to say hi!
          </p>
        </div>
      </div>

      <div className="team-card">
        <div className="avatar-wrap">
          <img src="https://mc-heads.net/body/_fearness_" alt="_fearness_ Minecraft avatar" />
        </div>
      
        <div>
          <p className="eyebrow">STAFF TEAM</p>
          <h2>Media Manager: Fearness aka Fear</h2>
          <p>
            I'm Fear, a passionate Media Manager at CloudBerry dedicated to creating peak content, cinematic edits.
            My goal is to bring CloudBerry's story to life, engage the community, and deliver content that stands out and leaves a lasting impression. 
            "The true Fear. Behind every peak edit, there's a story worth telling."
          </p>
        </div>
      </div>
      </section>
    </main>
  );
}
