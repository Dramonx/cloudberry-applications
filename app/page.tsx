"use client";

import React, { useMemo, useState } from "react";

const questions = [
  "Why do you want to become an Intern Helper on CloudBerry?",
  "A player is insulting you repeatedly in chat. Walk me through exactly what you do.",
  "You are having a bad day and a member keeps bothering you. How do you avoid lashing out?",
  "Your friend breaks a rule and asks you to ignore it. What do you do?",
  "A player accuses another staff member of abuse, but you did not see it happen. What steps do you take?",
  "During your 7-day trial, what will you do to prove you deserve Helper?"
];

export default function Page() {
  const [step, setStep] = useState(0);
  const [mc, setMc] = useState("");
  const [discord, setDiscord] = useState("");
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [done, setDone] = useState(false);

  const progress = useMemo(() => {
    if (done) return 100;
    return Math.round((step / questions.length) * 100);
  }, [step, done]);

  function next() {
    if (step === 0 && (!mc.trim() || !discord.trim())) return;
    if (step > 0 && !answers[step].trim()) return;

    if (step < questions.length - 1) setStep(step + 1);
    else setDone(true);
  }

  return (
    <main>
      <div className="bg-grid" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div className="scanlines" />

      <section className="shell">
        <div className="hero">
          <div className="status-pill">
            <span className="pulse" /> AI STAFF SCREENING ONLINE
          </div>

          <h1>
            CloudBerry <span>Staff</span><br />Application Portal
          </h1>

          <p className="subtitle">
            Apply for <b>Intern Helper</b>, a 7-day trial staff role. The system evaluates patience, maturity, fairness, stress control, and true intent before sending candidates to staff review.
          </p>

          <div className="stats">
            <div><b>7</b><span>Day Trial</span></div>
            <div><b>AI</b><span>Pre-Screen</span></div>
            <div><b>24/7</b><span>Portal</span></div>
          </div>
        </div>

        <div className="panel-wrap">
          <div className="panel-glow" />
          <div className="panel">
            <div className="panel-top">
              <div>
                <p className="eyebrow">CLOUDBERRY INTERVIEW NODE</p>
                <h2>{done ? "Application Submitted" : step === 0 ? "Identity Check" : `Question ${step}/${questions.length - 1}`}</h2>
              </div>
              <div className="percent">{progress}%</div>
            </div>

            <div className="progress"><span style={{ width: `${progress}%` }} /></div>

            {!done ? (
              <div className="content">
                {step === 0 ? (
                  <>
                    <label>
                      <span>Minecraft Username</span>
                      <input value={mc} onChange={(e) => setMc(e.target.value)} placeholder="CloudPlayer123" />
                    </label>
                    <label>
                      <span>Discord Username</span>
                      <input value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="username or user#0001" />
                    </label>
                    <div className="notice">Your answers will be reviewed by AI first. Strong candidates are forwarded to CloudBerry admins.</div>
                  </>
                ) : (
                  <>
                    <div className="question-card">
                      <span className="chip">Character Analysis</span>
                      <h3>{questions[step]}</h3>
                    </div>
                    <textarea
                      value={answers[step]}
                      onChange={(e) => {
                        const nextAnswers = [...answers];
                        nextAnswers[step] = e.target.value;
                        setAnswers(nextAnswers);
                      }}
                      placeholder="Answer honestly and with detail. Short answers may fail AI screening."
                    />
                  </>
                )}

                <button onClick={next}>
                  {step === questions.length - 1 ? "Submit to AI Screening" : step === 0 ? "Begin Interview" : "Continue"}
                  <span>→</span>
                </button>
              </div>
            ) : (
              <div className="success">
                <div className="check">✓</div>
                <h3>Submission received.</h3>
                <p>Your application is now queued for AI screening. If approved, it will be sent to the Potential Candidates staff channel for review.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; min-height: 100%; background: #020617; color: white; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        main { min-height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 48px 20px; background: radial-gradient(circle at 20% 10%, rgba(56,189,248,.35), transparent 28%), radial-gradient(circle at 88% 18%, rgba(251,146,60,.25), transparent 26%), linear-gradient(135deg, #020617 0%, #06192f 48%, #101827 100%); }
        .bg-grid { position: absolute; inset: -80px; background-image: linear-gradient(rgba(125,211,252,.11) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.11) 1px, transparent 1px); background-size: 54px 54px; transform: perspective(600px) rotateX(58deg) translateY(90px); animation: gridMove 9s linear infinite; opacity: .5; }
        .scanlines { pointer-events: none; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,.03) 50%, transparent 100%); background-size: 100% 6px; opacity: .25; }
        .orb { position: absolute; border-radius: 999px; filter: blur(22px); opacity: .75; animation: float 7s ease-in-out infinite; }
        .orb-a { width: 260px; height: 260px; left: 7%; top: 10%; background: rgba(56,189,248,.45); }
        .orb-b { width: 220px; height: 220px; right: 8%; top: 18%; background: rgba(251,146,60,.38); animation-delay: -2s; }
        .orb-c { width: 180px; height: 180px; left: 55%; bottom: 8%; background: rgba(255,255,255,.24); animation-delay: -4s; }
        .shell { position: relative; z-index: 2; width: min(1180px, 100%); display: grid; grid-template-columns: 1fr 480px; gap: 32px; align-items: center; }
        .hero { padding: 28px; }
        .status-pill { display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid rgba(125,211,252,.35); background: rgba(8,47,73,.55); border-radius: 999px; color: #bae6fd; font-size: 12px; font-weight: 900; letter-spacing: .16em; box-shadow: 0 0 28px rgba(56,189,248,.24); }
        .pulse { width: 9px; height: 9px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 16px #22c55e; animation: pulse 1.4s infinite; }
        h1 { margin: 22px 0 18px; font-size: clamp(46px, 7vw, 88px); line-height: .92; letter-spacing: -0.08em; font-weight: 1000; text-shadow: 0 0 60px rgba(125,211,252,.18); }
        h1 span { color: #fbbf24; text-shadow: 0 0 34px rgba(251,191,36,.35); }
        .subtitle { max-width: 690px; color: #cbd5e1; font-size: 18px; line-height: 1.75; }
        .stats { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 32px; }
        .stats div { min-width: 142px; padding: 18px; border-radius: 24px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.07); backdrop-filter: blur(18px); box-shadow: inset 0 1px 0 rgba(255,255,255,.1); }
        .stats b { display: block; font-size: 28px; color: #fff; }
        .stats span { display: block; margin-top: 3px; color: #94a3b8; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; }
        .panel-wrap { position: relative; }
        .panel-glow { position: absolute; inset: -3px; border-radius: 34px; background: linear-gradient(135deg, #38bdf8, #ffffff, #fb923c); filter: blur(16px); opacity: .55; animation: glow 4s ease-in-out infinite; }
        .panel { position: relative; border-radius: 32px; border: 1px solid rgba(255,255,255,.18); background: linear-gradient(180deg, rgba(15,23,42,.88), rgba(2,6,23,.9)); backdrop-filter: blur(26px); box-shadow: 0 30px 90px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12); padding: 26px; overflow: hidden; }
        .panel:before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(56,189,248,.18), transparent 38%); pointer-events: none; }
        .panel-top { position: relative; display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; }
        .eyebrow { margin: 0 0 8px; color: #67e8f9; font-size: 11px; font-weight: 1000; letter-spacing: .18em; }
        h2 { margin: 0; font-size: 28px; letter-spacing: -.04em; }
        .percent { border-radius: 18px; padding: 12px 14px; border: 1px solid rgba(125,211,252,.24); background: rgba(14,165,233,.12); color: #bae6fd; font-weight: 1000; }
        .progress { position: relative; margin: 22px 0; height: 10px; border-radius: 999px; overflow: hidden; background: rgba(255,255,255,.1); }
        .progress span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #38bdf8, #fbbf24, #fb923c); box-shadow: 0 0 22px rgba(251,191,36,.35); transition: width .35s ease; }
        .content { position: relative; display: grid; gap: 16px; }
        label span { display: block; margin: 0 0 8px; color: #cbd5e1; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; }
        input, textarea { width: 100%; border: 1px solid rgba(125,211,252,.22); border-radius: 18px; background: rgba(255,255,255,.08); color: white; outline: none; padding: 16px 17px; font: inherit; box-shadow: inset 0 1px 0 rgba(255,255,255,.08); transition: .2s ease; }
        textarea { min-height: 170px; resize: vertical; line-height: 1.6; }
        input:focus, textarea:focus { border-color: rgba(251,191,36,.65); box-shadow: 0 0 0 4px rgba(251,191,36,.12), 0 0 34px rgba(56,189,248,.16); }
        input::placeholder, textarea::placeholder { color: #64748b; }
        .notice { padding: 14px 16px; border-radius: 18px; background: rgba(251,146,60,.12); border: 1px solid rgba(251,146,60,.23); color: #fed7aa; line-height: 1.55; }
        .question-card { padding: 18px; border-radius: 24px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); }
        .chip { display: inline-flex; margin-bottom: 12px; padding: 7px 10px; border-radius: 999px; color: #082f49; background: #7dd3fc; font-size: 11px; font-weight: 1000; letter-spacing: .1em; text-transform: uppercase; }
        h3 { margin: 0; font-size: 22px; line-height: 1.35; letter-spacing: -.03em; }
        button { cursor: pointer; border: 0; border-radius: 20px; padding: 17px 19px; color: #082f49; font-size: 16px; font-weight: 1000; background: linear-gradient(135deg, #7dd3fc, #fde68a, #fb923c); box-shadow: 0 18px 40px rgba(251,146,60,.22), 0 0 40px rgba(56,189,248,.18); transition: transform .2s ease, filter .2s ease; }
        button:hover { transform: translateY(-2px) scale(1.01); filter: brightness(1.08); }
        button span { margin-left: 10px; }
        .success { position: relative; text-align: center; padding: 38px 10px 18px; }
        .check { width: 86px; height: 86px; margin: 0 auto 20px; display: grid; place-items: center; border-radius: 50%; background: linear-gradient(135deg, #22c55e, #7dd3fc); color: #031827; font-size: 48px; font-weight: 1000; box-shadow: 0 0 42px rgba(34,197,94,.35); }
        .success p { color: #cbd5e1; line-height: 1.7; }
        @keyframes gridMove { from { background-position: 0 0; } to { background-position: 54px 54px; } }
        @keyframes float { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(24px,-28px,0) scale(1.08); } }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(1.45); } }
        @keyframes glow { 0%,100% { opacity: .38; } 50% { opacity: .78; } }
        @media (max-width: 920px) { .shell { grid-template-columns: 1fr; } .hero { padding: 8px; } .panel { padding: 20px; } }
      `}</style>
    </main>
  );
}
