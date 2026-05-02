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
    if (step === 0 && (!mc || !discord)) return;

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-white to-orange-200 p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8">

        {!done ? (
          <>
            <h1 className="text-3xl font-black mb-2 text-sky-600">
              ☁️ CloudBerry Staff App
            </h1>
            <p className="text-gray-500 mb-6">
              Intern Helper (7-day trial)
            </p>

            <div className="mb-6">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-sky-400 to-orange-400 rounded-full"
                  style={{ width: `${(step / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <input
                  className="w-full p-3 rounded-xl border"
                  placeholder="Minecraft Username"
                  value={mc}
                  onChange={(e) => setMc(e.target.value)}
                />
                <input
                  className="w-full p-3 rounded-xl border"
                  placeholder="Discord Username"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                />
              </div>
            )}

            {step > 0 && (
              <div className="space-y-4">
                <p className="font-semibold text-lg">
                  {questions[step]}
                </p>
                <textarea
                  className="w-full p-3 rounded-xl border h-32"
                  value={answers[step]}
                  onChange={(e) => {
                    const a = [...answers];
                    a[step] = e.target.value;
                    setAnswers(a);
                  }}
                />
              </div>
            )}

            <button
              onClick={next}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-orange-400 text-white font-bold hover:scale-[1.02] transition"
            >
              {step === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-black text-green-600 mb-3">
              ✅ Application Submitted
            </h1>
            <p className="text-gray-600">
              If you pass AI screening, staff will review your application.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
