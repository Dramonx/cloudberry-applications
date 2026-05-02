"use client";

import React, { useEffect, useMemo, useState } from "react";

const questions = [
  "Why do you want to become an Intern Helper on CloudBerry?",
  "A player is insulting you repeatedly in chat. Walk me through exactly what you do.",
  "You are having a bad day and a member keeps bothering you. How do you avoid lashing out?",
  "Your friend breaks a rule and asks you to ignore it. What do you do?",
  "A player accuses another staff member of abuse, but you did not see it happen. What steps do you take?",
  "What is your ability like to work with a team?",
  "During your 7-day trial, what will you do to prove you deserve Helper?"
];

export default function Page() {
  const [step, setStep] = useState(-1);
  const [mc, setMc] = useState("");
  const [discord, setDiscord] = useState("");
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("AI Screening...");
  const [resultMessage, setResultMessage] = useState("");
  const [approved, setApproved] = useState(false);

  const progress = useMemo(() => {
    if (done) return 100;
    return Math.round((step / questions.length) * 100);
  }, [step, done]);

  useEffect(() => {
    if (!loading) return;

    const words = ["AI Screening...", "Please Wait...", "Processing..."];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % words.length;
      setLoadingText(words[index]);
    }, 900);

    return () => clearInterval(interval);
  }, [loading]);

  async function submitApplication() {
    setLoading(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: mc,
          discord,
          questions,
          answers,
        }),
      });

      const data = await res.json();

      setApproved(data.decision === "approved");

      setResultMessage(
        data.message ||
          (data.decision === "approved"
            ? "Application Approved... Your application has been sent over to moderators for further review."
            : "Application declined... please try again in 7 days.")
      );
    } catch {
      setApproved(false);
      setResultMessage("Application declined... please try again in 7 days.");
    }

    setLoading(false);
    setDone(true);
  }

  function next() {
    if (loading) return;
    if (step === -1 && (!mc.trim() || !discord.trim())) return;
    if (step >= 0 && !answers[step].trim()) return;

    if (step < questions.length - 1) setStep(step + 1);
    else submitApplication();
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

      <section className="shell">
        <div className="hero">
          <div className="logo-stage">
            <img src="/CloudBerry.png" alt="CloudBerry logo" />
          </div>

          <div className="status-pill">
            <span className="pulse" /> AI STAFF SCREENING ONLINE
          </div>

          <h1>
            Intern Helper<br /><span>Application Portal</span>
          </h1>

          <p className="subtitle">
            Apply for <b>Intern Helper</b>, a 7-day trial staff role. CloudBerry AI evaluates patience, maturity, fairness, stress control, teamwork, and true intent before sending candidates to staff review.
          </p>

          <div className="stats">
            <div><b>7</b><span>Day Trial</span></div>
            <div><b>AI</b><span>Pre-Screen</span></div>
            <div><b>MC</b><span>CloudBerry</span></div>
          </div>
        </div>

        <div className="panel-wrap">
          <div className="panel-glow" />
          <div className="panel">
            <div className="panel-top">
              <div>
                <p className="eyebrow">CLOUDBERRY STAFF TERMINAL</p>
                <h2>{done ? "Application Result" : step === -1 ? "Player Identity" : `Question ${step + 1}/${questions.length}`}</h2>
              </div>
              <div className="percent">{progress}%</div>
            </div>

            <div className="progress"><span style={{ width: `${progress}%` }} /></div>

            {!done ? (
              <div className="content">
                {step === -1 ? (
                  <>
                    <label>
                      <span>Minecraft Username</span>
                      <input value={mc} onChange={(e) => setMc(e.target.value)} placeholder="CloudPlayer123" disabled={loading} />
                    </label>
                    <label>
                      <span>Discord Username</span>
                      <input value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="username or user#0001" disabled={loading} />
                    </label>
                    <div className="notice">Your answers are checked by CloudBerry AI first. Strong candidates are forwarded to admins. Low-effort or unsafe applications are declined.</div>
                  </>
                ) : (
                  <>
                    <div className="question-card">
                      <span className="chip">Character Analysis</span>
                      <h3>{questions[step]}</h3>
                    </div>
                    <textarea
                      value={answers[step]}
                      disabled={loading}
                      onChange={(e) => {
                        const nextAnswers = [...answers];
                        nextAnswers[step] = e.target.value;
                        setAnswers(nextAnswers);
                      }}
                      placeholder="Answer honestly and with detail. Short answers may fail AI screening."
                    />
                  </>
                )}

                <button onClick={next} disabled={loading}>
                  {loading
                    ? loadingText
                    : step === questions.length - 1
                    ? "Submit to AI Screening"
                    : step === -1
                    ? "Begin Interview"
                    : "Continue"}
                  <span>→</span>
                </button>
              </div>
            ) : (
              <div className="success">
                <div className="check">{approved ? "✓" : "!"}</div>
                <h3>{approved ? "Application Approved" : "Application Declined"}</h3>
                <p>{resultMessage}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; min-height: 100%; background: #071626; color: white; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        main { min-height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 44px 20px; background: linear-gradient(180deg, #64c7ff 0%, #bdecff 38%, #fff2c2 66%, #1e293b 100%); }
        .sky { position: absolute; inset: 0; background: radial-gradient(circle at 17% 14%, rgba(255,255,255,.95), transparent 13%), radial-gradient(circle at 78% 18%, rgba(255,179,71,.62), transparent 18%), linear-gradient(180deg, rgba(56,189,248,.18), rgba(15,23,42,.35)); }
        .sun { position: absolute; width: 220px; height: 220px; right: 8%; top: 8%; border-radius: 50%; background: radial-gradient(circle, rgba(255,244,180,1), rgba(251,146,60,.58) 45%, transparent 70%); filter: blur(2px); animation: sunPulse 5s ease-in-out infinite; }
        .cloud { position: absolute; height: 42px; background: rgba(255,255,255,.88); border-radius: 10px; filter: drop-shadow(0 12px 18px rgba(15,23,42,.14)); opacity: .88; animation: cloudMove 28s linear infinite; }
        .cloud:before, .cloud:after { content: ""; position: absolute; background: inherit; border-radius: 10px; }
        .cloud:before { width: 58px; height: 58px; left: 20px; bottom: 10px; }
        .cloud:after { width: 78px; height: 78px; left: 72px; bottom: 8px; }
        .cloud-1 { width: 170px; left: -190px; top: 12%; animation-duration: 34s; }
        .cloud-2 { width: 130px; left: -170px; top: 27%; animation-duration: 26s; animation-delay: -10s; transform: scale(.75); }
        .cloud-3 { width: 210px; left: -230px; top: 47%; animation-duration: 40s; animation-delay: -20s; transform: scale(.55); opacity: .7; }
        .block-layer { position: absolute; left: -8%; right: -8%; bottom: 0; height: 220px; image-rendering: pixelated; }
        .layer-back { bottom: 150px; opacity: .32; animation: terrainBack 18s linear infinite; background-size: 160px 80px; background-image: linear-gradient(45deg, transparent 25%, rgba(34,197,94,.45) 25% 50%, transparent 50% 75%, rgba(34,197,94,.45) 75%), linear-gradient(#166534 0 36px, #854d0e 36px 58px, #475569 58px 80px); }
        .layer-mid { bottom: 64px; opacity: .85; animation: terrainMid 12s linear infinite; background-size: 120px 96px; background-image: linear-gradient(90deg, rgba(22,101,52,1) 0 50%, rgba(21,128,61,1) 50% 100%), linear-gradient(#22c55e 0 28px, #854d0e 28px 68px, #334155 68px 96px); clip-path: polygon(0 25%, 8% 20%, 14% 32%, 22% 16%, 31% 30%, 42% 18%, 50% 31%, 64% 17%, 73% 28%, 86% 14%, 100% 25%, 100% 100%, 0 100%); }
        .layer-front { bottom: -46px; height: 150px; animation: terrainFront 8s linear infinite; background-size: 96px 96px; background-image: linear-gradient(90deg, rgba(21,128,61,1) 0 50%, rgba(34,197,94,1) 50% 100%), linear-gradient(#22c55e 0 24px, #92400e 24px 70px, #1f2937 70px 96px); box-shadow: 0 -18px 50px rgba(0,0,0,.28); }
        .particles { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.85) 1px, transparent 1.5px), radial-gradient(circle, rgba(251,191,36,.8) 1px, transparent 1.5px); background-size: 90px 90px, 140px 140px; animation: particles 14s linear infinite; opacity: .42; }
        .scanlines { pointer-events: none; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,.05) 50%, transparent 100%); background-size: 100% 6px; opacity: .18; mix-blend-mode: overlay; }
        .shell { position: relative; z-index: 2; width: min(1220px, 100%); display: grid; grid-template-columns: 1fr 500px; gap: 32px; align-items: center; }
        .hero { padding: 18px 28px; }
        .logo-stage { width: min(540px, 95%); margin-bottom: 18px; position: relative; animation: logoFloat 5s ease-in-out infinite; }
        .logo-stage:after { content: ""; position: absolute; inset: 10% 6% 0; background: rgba(251,146,60,.35); filter: blur(40px); z-index: -1; }
        .logo-stage img { width: 100%; display: block; filter: drop-shadow(0 26px 50px rgba(15,23,42,.38)); }
        .status-pill { display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px; border: 2px solid rgba(255,255,255,.5); background: rgba(8,47,73,.64); border-radius: 999px; color: #e0f2fe; font-size: 12px; font-weight: 1000; letter-spacing: .16em; box-shadow: 0 0 30px rgba(56,189,248,.26); backdrop-filter: blur(12px); }
        .pulse { width: 9px; height: 9px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 16px #22c55e; animation: pulse 1.4s infinite; }
        h1 { margin: 20px 0 18px; font-size: clamp(42px, 6vw, 78px); line-height: .94; letter-spacing: -0.075em; font-weight: 1000; color: #f8fafc; text-shadow: 0 6px 0 rgba(15,23,42,.35), 0 0 46px rgba(56,189,248,.24); }
        h1 span { color: #fbbf24; text-shadow: 0 6px 0 rgba(124,45,18,.45), 0 0 34px rgba(251,191,36,.35); }
        .subtitle { max-width: 690px; color: #f8fafc; font-size: 18px; line-height: 1.75; text-shadow: 0 2px 16px rgba(15,23,42,.55); }
        .stats { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 30px; }
        .stats div { min-width: 142px; padding: 18px; border-radius: 6px; border: 3px solid rgba(255,255,255,.38); background: linear-gradient(180deg, rgba(14,165,233,.78), rgba(8,47,73,.72)); backdrop-filter: blur(18px); box-shadow: 0 12px 0 rgba(15,23,42,.25), inset 0 1px 0 rgba(255,255,255,.22); }
        .stats b { display: block; font-size: 29px; color: #fff; }
        .stats span { display: block; margin-top: 3px; color: #e0f2fe; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; }
        .panel-wrap { position: relative; }
        .panel-glow { position: absolute; inset: -4px; border-radius: 18px; background: linear-gradient(135deg, #38bdf8, #ffffff, #fb923c); filter: blur(18px); opacity: .65; animation: glow 4s ease-in-out infinite; }
        .panel { position: relative; border-radius: 16px; border: 3px solid rgba(255,255,255,.24); background: linear-gradient(180deg, rgba(12,32,55,.93), rgba(3,7,18,.94)); backdrop-filter: blur(24px); box-shadow: 0 32px 90px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.14), 0 10px 0 rgba(15,23,42,.42); padding: 26px; overflow: hidden; }
        .panel:before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent); transform: translateX(-100%); animation: shine 4.8s ease-in-out infinite; pointer-events: none; }
        .panel-top { position: relative; display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; }
        .eyebrow { margin: 0 0 8px; color: #7dd3fc; font-size: 11px; font-weight: 1000; letter-spacing: .18em; }
        h2 { margin: 0; font-size: 28px; letter-spacing: -.04em; color: #fff; }
        .percent { border-radius: 8px; padding: 12px 14px; border: 2px solid rgba(125,211,252,.24); background: rgba(14,165,233,.14); color: #bae6fd; font-weight: 1000; }
        .progress { position: relative; margin: 22px 0; height: 12px; border-radius: 4px; overflow: hidden; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.12); }
        .progress span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #38bdf8, #fbbf24, #fb923c); box-shadow: 0 0 22px rgba(251,191,36,.35); transition: width .35s ease; }
        .content { position: relative; display: grid; gap: 16px; }
        label span { display: block; margin: 0 0 8px; color: #cbd5e1; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; }
        input, textarea { width: 100%; border: 2px solid rgba(125,211,252,.24); border-radius: 8px; background: rgba(255,255,255,.08); color: white; outline: none; padding: 16px 17px; font: inherit; box-shadow: inset 0 1px 0 rgba(255,255,255,.08); transition: .2s ease; }
        textarea { min-height: 170px; resize: vertical; line-height: 1.6; }
        input:focus, textarea:focus { border-color: rgba(251,191,36,.7); box-shadow: 0 0 0 4px rgba(251,191,36,.12), 0 0 34px rgba(56,189,248,.16); }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        input:disabled, textarea:disabled, button:disabled { opacity: .75; cursor: not-allowed; }
        .notice { padding: 14px 16px; border-radius: 8px; background: rgba(251,146,60,.13); border: 2px solid rgba(251,146,60,.25); color: #fed7aa; line-height: 1.55; }
        .question-card { padding: 18px; border-radius: 12px; background: rgba(255,255,255,.07); border: 2px solid rgba(255,255,255,.12); }
        .chip { display: inline-flex; margin-bottom: 12px; padding: 7px 10px; border-radius: 4px; color: #082f49; background: #7dd3fc; font-size: 11px; font-weight: 1000; letter-spacing: .1em; text-transform: uppercase; }
        h3 { margin: 0; font-size: 22px; line-height: 1.35; letter-spacing: -.03em; }
        button { cursor: pointer; border: 0; border-radius: 8px; padding: 17px 19px; color: #082f49; font-size: 16px; font-weight: 1000; background: linear-gradient(135deg, #7dd3fc, #fde68a, #fb923c); box-shadow: 0 8px 0 rgba(124,45,18,.5), 0 18px 40px rgba(251,146,60,.22), 0 0 40px rgba(56,189,248,.18); transition: transform .2s ease, filter .2s ease; }
        button:hover { transform: translateY(-2px) scale(1.01); filter: brightness(1.08); }
        button:active { transform: translateY(4px); box-shadow: 0 4px 0 rgba(124,45,18,.5); }
        button span { margin-left: 10px; }
        .success { position: relative; text-align: center; padding: 38px 10px 18px; }
        .check { width: 86px; height: 86px; margin: 0 auto 20px; display: grid; place-items: center; border-radius: 14px; background: linear-gradient(135deg, #22c55e, #7dd3fc); color: #031827; font-size: 48px; font-weight: 1000; box-shadow: 0 0 42px rgba(34,197,94,.35); }
        .success p { color: #cbd5e1; line-height: 1.7; }
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
        @media (max-width: 980px) { .shell { grid-template-columns: 1fr; } .hero { padding: 8px; text-align: center; } .logo-stage { margin-left: auto; margin-right: auto; } .stats { justify-content: center; } .panel { padding: 20px; } }
      `}</style>
    </main>
  );
}
