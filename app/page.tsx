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
  const [loading, setLoading] = useState(false);

  const progress = useMemo(() => {
    if (done) return 100;
    return Math.round((step / questions.length) * 100);
  }, [step, done]);

  async function submitToAI() {
    setLoading(true);

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: mc,
        discord,
        answers
      }),
    });

    const data = await res.json();

    console.log("AI RESULT:", data);

    setLoading(false);
    setDone(true);
  }

  function next() {
    if (step === 0 && (!mc.trim() || !discord.trim())) return;
    if (step > 0 && !answers[step].trim()) return;

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitToAI();
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
            Apply for <b>Intern Helper</b>. CloudBerry AI evaluates your behavior,
            decision-making, and maturity before staff review.
          </p>
        </div>

        <div className="panel-wrap">
          <div className="panel-glow" />
          <div className="panel">
            <div className="panel-top">
              <div>
                <p className="eyebrow">CLOUDBERRY STAFF TERMINAL</p>
                <h2>
                  {done
                    ? "Application Submitted"
                    : step === 0
                    ? "Player Identity"
                    : `Question ${step}/${questions.length - 1}`}
                </h2>
              </div>
              <div className="percent">{progress}%</div>
            </div>

            <div className="progress">
              <span style={{ width: `${progress}%` }} />
            </div>

            {!done ? (
              <div className="content">
                {step === 0 ? (
                  <>
                    <label>
                      <span>Minecraft Username</span>
                      <input
                        value={mc}
                        onChange={(e) => setMc(e.target.value)}
                      />
                    </label>
                    <label>
                      <span>Discord Username</span>
                      <input
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <div className="question-card">
                      <span className="chip">AI Evaluation</span>
                      <h3>{questions[step]}</h3>
                    </div>
                    <textarea
                      value={answers[step]}
                      onChange={(e) => {
                        const nextAnswers = [...answers];
                        nextAnswers[step] = e.target.value;
                        setAnswers(nextAnswers);
                      }}
                    />
                  </>
                )}

                <button onClick={next} disabled={loading}>
                  {loading
                    ? "Analyzing..."
                    : step === questions.length - 1
                    ? "Submit to AI"
                    : "Continue"}
                </button>
              </div>
            ) : (
              <div className="success">
                <div className="check">✓</div>
                <h3>Submission received.</h3>
                <p>
                  Your application is being reviewed by CloudBerry AI.
                  If approved, it will be sent to staff.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: sans-serif;
          color: white;
        }
        main {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #64c7ff, #1e293b);
        }
        button {
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
