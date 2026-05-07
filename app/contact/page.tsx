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
    </main>
  );
}
