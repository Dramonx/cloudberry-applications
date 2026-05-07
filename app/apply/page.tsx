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
    if (step < 0) return 0; // 👈 fix negative

  return Math.round(((step + 1) / questions.length) * 100);
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
    </main>
  );
}
