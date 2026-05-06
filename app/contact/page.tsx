"use client";

import React, { useState } from "react";

type ContactType = "regular" | "professional";

export default function ContactPage() {
  const [type, setType] = useState<ContactType>("regular");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    minecraftIgn: "",
    discord: "",
    email: "",
    subject: "",
    message: "",
    company: "",
    name: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          ...form,
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to submit");
      }
  
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong while submitting your request.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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

      <section className="contact-shell">
        <div className="intro">
          <div className="logo-stage">
            <img src="/CloudBerry.png" alt="CloudBerry logo" />
          </div>

          <div className="status-pill">
            <span className="pulse" /> CLOUDBERRY SUPPORT NODE ONLINE
          </div>

          <h1>
            Contact<br />
            <span>CloudBerry</span>
          </h1>

          <p className="subtitle">
            Need help, have a question, or want to reach us professionally? Submit a request and our team will review it as soon as possible.
          </p>

          <div className="info-grid">
            <div><b>24h</b><span>Review Window</span></div>
            <div><b>2</b><span>Request Types</span></div>
            <div><b>AI</b><span>Smart Routing Ready</span></div>
          </div>
        </div>

        <div className="form-wrap">
          <div className="panel-glow" />
          <div className="panel">
            {!submitted ? (
              <>
                <div className="panel-top">
                  <div>
                    <p className="eyebrow">CLOUDBERRY CONTACT TERMINAL</p>
                    <h2>{type === "regular" ? "Regular Support" : "Professional Inquiry"}</h2>
                  </div>
                  <div className="badge">SECURE</div>
                </div>

                <div className="type-toggle">
                  <button
                    type="button"
                    className={type === "regular" ? "active" : ""}
                    onClick={() => setType("regular")}
                  >
                    Regular
                  </button>
                  <button
                    type="button"
                    className={type === "professional" ? "active" : ""}
                    onClick={() => setType("professional")}
                  >
                    Professional
                  </button>
                </div>

                <form onSubmit={submitForm} className="content">
                  {type === "regular" ? (
                    <>
                      <label>
                        <span>Minecraft IGN</span>
                        <input
                          required
                          value={form.minecraftIgn}
                          onChange={(e) => updateField("minecraftIgn", e.target.value)}
                          placeholder="CloudPlayer123"
                        />
                      </label>

                      <label>
                        <span>Discord Username</span>
                        <input
                          required
                          value={form.discord}
                          onChange={(e) => updateField("discord", e.target.value)}
                          placeholder="username or user#0001"
                        />
                      </label>

                      <label>
                        <span>Email Optional</span>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="Adding email may help us support you faster"
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        <span>Name</span>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Your name"
                        />
                      </label>

                      <label>
                        <span>Company If Applicable</span>
                        <input
                          value={form.company}
                          onChange={(e) => updateField("company", e.target.value)}
                          placeholder="Company / organization"
                        />
                      </label>

                      <label>
                        <span>Discord Username</span>
                        <input
                          required
                          value={form.discord}
                          onChange={(e) => updateField("discord", e.target.value)}
                          placeholder="username or user#0001"
                        />
                      </label>
                    </>
                  )}

                  <label>
                    <span>Subject</span>
                    <input
                      required
                      value={form.subject}
                      onChange={(e) => updateField("subject", e.target.value)}
                      placeholder="What is this about?"
                    />
                  </label>

                  <label>
                    <span>Message</span>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="Please explain your request with as much detail as possible."
                    />
                  </label>

                  <div className="notice">
                    {type === "regular"
                      ? "Regular requests are best for player support, questions, bugs, reports, or general help."
                      : "Professional inquiries are best for partnerships, business discussions, creator outreach, or serious server-related matters."}
                  </div>

                  <button disabled={loading}>
                    {loading ? (
                      <span className="loading-text"><span className="spinner" /> Processing Request...</span>
                    ) : (
                      <>Submit Request <span>→</span></>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="success">
                <div className="check">✓</div>
                <h2>Request Submitted</h2>
                <p>Your request has been submitted. Please allow up to 24 hours for review.</p>
                <p className="small">Our team will review your message and follow up through Discord or email if needed.</p>
                <button onClick={() => setSubmitted(false)}>Submit Another Request</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; min-height: 100%; background: #071626; color: white; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        main { min-height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 92px 20px 130px; background: linear-gradient(180deg, #64c7ff 0%, #bdecff 38%, #fff2c2 66%, #1e293b 100%); }
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
        .contact-shell { position: relative; z-index: 2; width: min(1220px, 100%); display: grid; grid-template-columns: 1fr 520px; gap: 34px; align-items: center; }
        .logo-stage { width: min(520px, 96%); margin-bottom: 18px; position: relative; animation: logoFloat 5s ease-in-out infinite; }
        .logo-stage:after { content: ""; position: absolute; inset: 10% 6% 0; background: rgba(251,146,60,.35); filter: blur(40px); z-index: -1; }
        .logo-stage img { width: 100%; display: block; filter: drop-shadow(0 26px 50px rgba(15,23,42,.38)); }
        .status-pill { display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px; border: 2px solid rgba(255,255,255,.5); background: rgba(8,47,73,.64); border-radius: 999px; color: #e0f2fe; font-size: 12px; font-weight: 1000; letter-spacing: .16em; box-shadow: 0 0 30px rgba(56,189,248,.26); backdrop-filter: blur(12px); }
        .pulse { width: 9px; height: 9px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 16px #22c55e; animation: pulse 1.4s infinite; }
        h1 { margin: 20px 0 18px; font-size: clamp(48px, 7vw, 88px); line-height: .92; letter-spacing: -0.075em; font-weight: 1000; color: #f8fafc; text-shadow: 0 6px 0 rgba(15,23,42,.35), 0 0 46px rgba(56,189,248,.24); }
        h1 span { color: #fbbf24; text-shadow: 0 6px 0 rgba(124,45,18,.45), 0 0 34px rgba(251,191,36,.35); }
        .subtitle { max-width: 690px; color: #f8fafc; font-size: 18px; line-height: 1.75; text-shadow: 0 2px 16px rgba(15,23,42,.55); }
        .info-grid { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 30px; }
        .info-grid div { min-width: 142px; padding: 18px; border-radius: 6px; border: 3px solid rgba(255,255,255,.38); background: linear-gradient(180deg, rgba(14,165,233,.78), rgba(8,47,73,.72)); backdrop-filter: blur(18px); box-shadow: 0 12px 0 rgba(15,23,42,.25), inset 0 1px 0 rgba(255,255,255,.22); }
        .info-grid b { display: block; font-size: 29px; color: #fff; }
        .info-grid span { display: block; margin-top: 3px; color: #e0f2fe; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; }
        .form-wrap { position: relative; }
        .panel-glow { position: absolute; inset: -4px; border-radius: 18px; background: linear-gradient(135deg, #38bdf8, #ffffff, #fb923c); filter: blur(18px); opacity: .65; animation: glow 4s ease-in-out infinite; }
        .panel { position: relative; border-radius: 16px; border: 3px solid rgba(255,255,255,.24); background: linear-gradient(180deg, rgba(12,32,55,.93), rgba(3,7,18,.94)); backdrop-filter: blur(24px); box-shadow: 0 32px 90px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.14), 0 10px 0 rgba(15,23,42,.42); padding: 26px; overflow: hidden; }
        .panel:before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent); transform: translateX(-100%); animation: shine 4.8s ease-in-out infinite; pointer-events: none; }
        .panel-top { position: relative; display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; margin-bottom: 18px; }
        .eyebrow { margin: 0 0 8px; color: #7dd3fc; font-size: 11px; font-weight: 1000; letter-spacing: .18em; }
        h2 { margin: 0; font-size: 30px; letter-spacing: -.04em; color: #fff; }
        .badge { border-radius: 8px; padding: 12px 14px; border: 2px solid rgba(125,211,252,.24); background: rgba(14,165,233,.14); color: #bae6fd; font-weight: 1000; }
        .type-toggle { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0 0 18px; }
        .type-toggle button { border: 2px solid rgba(125,211,252,.24); border-radius: 8px; padding: 13px; color: #e0f2fe; background: rgba(255,255,255,.07); font-weight: 1000; cursor: pointer; transition: .2s ease; }
        .type-toggle button.active, .type-toggle button:hover { color: #082f49; background: linear-gradient(135deg, #7dd3fc, #fde68a, #fb923c); box-shadow: 0 0 24px rgba(125,211,252,.35); }
        .content { position: relative; display: grid; gap: 15px; }
        label span { display: block; margin: 0 0 8px; color: #cbd5e1; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; }
        input, textarea { width: 100%; border: 2px solid rgba(125,211,252,.24); border-radius: 8px; background: rgba(255,255,255,.08); color: white; outline: none; padding: 15px 16px; font: inherit; box-shadow: inset 0 1px 0 rgba(255,255,255,.08); transition: .2s ease; }
        textarea { min-height: 150px; resize: vertical; line-height: 1.6; }
        input:focus, textarea:focus { border-color: rgba(251,191,36,.7); box-shadow: 0 0 0 4px rgba(251,191,36,.12), 0 0 34px rgba(56,189,248,.16); }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        .notice { padding: 14px 16px; border-radius: 8px; background: rgba(251,146,60,.13); border: 2px solid rgba(251,146,60,.25); color: #fed7aa; line-height: 1.55; }
        button { cursor: pointer; border: 0; border-radius: 8px; padding: 17px 19px; color: #082f49; font-size: 16px; font-weight: 1000; background: linear-gradient(135deg, #7dd3fc, #fde68a, #fb923c); box-shadow: 0 8px 0 rgba(124,45,18,.5), 0 18px 40px rgba(251,146,60,.22), 0 0 40px rgba(56,189,248,.18); transition: transform .2s ease, filter .2s ease; }
        button:hover { transform: translateY(-2px) scale(1.01); filter: brightness(1.08); }
        button:disabled { opacity: .75; cursor: not-allowed; }
        button span { margin-left: 10px; }
        .loading-text { display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
        .spinner { width: 16px; height: 16px; border-radius: 50%; border: 3px solid rgba(8,47,73,.35); border-top-color: #082f49; animation: spin .8s linear infinite; margin-left: 0; }
        .success { position: relative; text-align: center; padding: 48px 10px 28px; }
        .check { width: 96px; height: 96px; margin: 0 auto 22px; display: grid; place-items: center; border-radius: 18px; background: linear-gradient(135deg, #22c55e, #7dd3fc); color: #031827; font-size: 54px; font-weight: 1000; box-shadow: 0 0 42px rgba(34,197,94,.55), 0 0 80px rgba(125,211,252,.22); animation: successPop .5s ease; }
        .success p { color: #cbd5e1; line-height: 1.7; font-size: 17px; }
        .success .small { color: #93c5fd; font-size: 14px; }
        @keyframes cloudMove { from { transform: translateX(0); } to { transform: translateX(calc(100vw + 280px)); } }
        @keyframes terrainBack { from { background-position: 0 0, 0 0; } to { background-position: -160px 0, -160px 0; } }
        @keyframes terrainMid { from { background-position: 0 0, 0 0; } to { background-position: -120px 0, -120px 0; } }
        @keyframes terrainFront { from { background-position: 0 0, 0 0; } to { background-position: -96px 0, -96px 0; } }
        @keyframes particles { from { background-position: 0 0, 0 0; } to { background-position: 90px -90px, -140px 140px; } }
        @keyframes logoFloat { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes sunPulse { 0%,100% { transform: scale(1); opacity: .88; } 50% { transform: scale(1.08); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(1.45); } }
        @keyframes glow { 0%,100% { opacity: .42; } 50% { opacity: .82; } }
        @keyframes shine { 0%, 35% { transform: translateX(-100%); } 55%, 100% { transform: translateX(100%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes successPop { from { transform: scale(.65); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @media (max-width: 980px) { .contact-shell { grid-template-columns: 1fr; } .intro { text-align: center; } .logo-stage { margin-left: auto; margin-right: auto; } .info-grid { justify-content: center; } }
      `}</style>
    </main>
  );
}
