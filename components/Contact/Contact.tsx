"use client";

import { useRef, useState } from "react";
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { SITE } from "@/lib/site";

const emptyForm = { name: "", email: "", mobileNumber: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const inFlight = useRef(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setStatus("idle");
    setFeedback("Sending your message…");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success !== true) {
        setStatus("error");
        setFeedback(typeof data?.error === "string" ? data.error : "Your message could not be sent. Try again or email me directly.");
      } else {
        setStatus("success");
        setFeedback("Your message has been sent. Thank you for getting in touch.");
        setForm(emptyForm);
      }
    } catch {
      setStatus("error");
      setFeedback("Unable to connect. Your message is still here; try again or email me directly.");
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
      setSending(false);
    }
  };

  return (
    <section id="contact" className="contact-section site-container" aria-labelledby="contact-heading">
      <div className="contact-copy">
        <p className="eyebrow text-accent">05 / Get in touch</p>
        <h2 id="contact-heading" className="section-title">Let&apos;s build something useful.</h2>
        <p>Have a role, a project or an engineering problem in mind? Tell me what you&apos;re working on.</p>
        <address className="contact-address">
          <a href={`mailto:${SITE.email}`}><FiMail aria-hidden="true" /><span>{SITE.email}</span><FiArrowUpRight aria-hidden="true" /></a>
          <a href={`tel:${SITE.phone}`}><FiPhone aria-hidden="true" /><span>{SITE.phone}</span><FiArrowUpRight aria-hidden="true" /></a>
          <p><FiMapPin aria-hidden="true" />{SITE.location}</p>
        </address>
        <p className="contact-note">Prefer email? The address above goes straight to your email app.</p>
      </div>
      <form className="contact-form" onSubmit={submit} aria-labelledby="contact-form-heading" aria-busy={sending}>
        <h3 id="contact-form-heading">Send a message</h3>
        <p className="form-note">Name, email and message are required.</p>
        <fieldset disabled={sending}>
          <div className="contact-fields">
            <div><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} value={form.name} onChange={change} /></div>
            <div><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={change} /></div>
          </div>
          <label htmlFor="contact-phone">Phone <span>(optional)</span></label>
          <input id="contact-phone" name="mobileNumber" type="tel" autoComplete="tel" maxLength={40} value={form.mobileNumber} onChange={change} />
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows={5} required maxLength={5000} aria-describedby="message-help" value={form.message} onChange={change} />
          <p id="message-help" className="form-note">Up to 5,000 characters.</p>
          <button type="submit" className="button button-primary">{sending ? "Sending…" : "Send message"}<FiArrowUpRight aria-hidden="true" /></button>
        </fieldset>
        <div className={`form-feedback form-feedback-${status}`}>
          <p role="status" aria-live="polite" aria-atomic="true">{status !== "error" ? feedback : ""}</p>
          <p role="alert" aria-atomic="true">{status === "error" ? feedback : ""}</p>
        </div>
      </form>
    </section>
  );
}
