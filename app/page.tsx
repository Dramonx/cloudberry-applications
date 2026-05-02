"use client";

import React, { useState } from "react";

const questions = [
  "Why do you want to become an Intern Helper on CloudBerry?",
  "A player is insulting you repeatedly. What do you do?",
  "You're having a bad day and someone is annoying you. How do you respond?",
  "Your friend breaks rules and asks you to ignore it. What do you do?",
  "How do you handle stress while moderating players?",
  "What makes you trustworthy as staff?"
];

export default function Page() {
  const [step, setStep] = useState(0);
  const [mc, setMc] = useState("");
  const [discord, setDiscord] = useState("");
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [done, setDone] = useState(false);

  const next = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(#87CEEB, #ffffff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        width: "500px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>

        {!done ? (
          <>
            <h2>☁️ CloudBerry Staff Application</h2>

            {step === 0 && (
              <>
                <input placeholder="Minecraft Username" value={mc} onChange={e => setMc(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
                <input placeholder="Discord Username" value={discord} onChange={e => setDiscord(e.target.value)} style={{ width: "100%" }} />
              </>
            )}

            {step > 0 && (
              <>
                <p>{questions[step]}</p>
                <textarea
                  value={answers[step]}
                  onChange={e => {
                    const a = [...answers];
                    a[step] = e.target.value;
                    setAnswers(a);
                  }}
                  style={{ width: "100%", height: "100px" }}
                />
              </>
            )}

            <button onClick={next} style={{ marginTop: "15px" }}>
              Next
            </button>
          </>
        ) : (
          <>
            <h2>✅ Application Submitted</h2>
            <p>Staff will review your application if you pass AI screening.</p>
          </>
        )}

      </div>
    </div>
  );
}
