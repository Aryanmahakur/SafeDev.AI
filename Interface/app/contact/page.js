
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageSquare,
  Network,
  Send,
} from "lucide-react";
import SiteChrome from "../components/SiteChrome";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General enquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const subject = encodeURIComponent(
      `SafeDev AI enquiry: ${form.subject}`,
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`,
    );

    setSubmitted(true);

    window.location.href =
      `mailto:contact@safedev.ai?subject=${subject}&body=${body}`;
  }

  return (
    <SiteChrome>
      <main className="contact-page">
        <section className="page-hero section-shell">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            CONTACT US
          </div>

          <h1>
            Let&apos;s start a
            <br />
            <span>conversation.</span>
          </h1>

          <p>
            Have a question, an idea, or want to explore SafeDev AI for your
            organization? We&apos;d love to hear from you.
          </p>
        </section>

        <section className="section-shell contact-layout">
          <div className="contact-info">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              GET IN TOUCH
            </div>

            <h2>
              We&apos;re here to
              <br />
              <span>help you explore.</span>
            </h2>

            <p className="contact-intro">
              Send us your questions or share what you have in mind. Use the
              form to prepare an email with your enquiry.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="contact-info-icon">
                  <Mail size={19} />
                </span>
                <div>
                  <span className="contact-label">EMAIL</span>
                  <p>contact@safedev.ai</p>
                  <span className="contact-hint">
                    For questions and enquiries
                  </span>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-info-icon">
                  <MessageSquare size={19} />
                </span>
                <div>
                  <span className="contact-label">GENERAL ENQUIRIES</span>
                  <p>Tell us what you need.</p>
                  <span className="contact-hint">
                    Product, collaboration, or feedback
                  </span>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-info-icon">
                  <MapPin size={19} />
                </span>
                <div>
                  <span className="contact-label">OUR FOCUS</span>
                  <p>AI-powered network intelligence</p>
                  <span className="contact-hint">
                    Making security easier to understand
                  </span>
                </div>
              </div>
            </div>

            <div className="contact-note">
              <Network size={20} />
              <p>
                Every great solution starts with a conversation.
              </p>
            </div>
          </div>

          <div className="contact-form-panel">
            <div className="contact-form-heading">
              <span className="contact-label">YOUR MESSAGE</span>
              <h2>Send us a message.</h2>
              <p>Fill in the details below to prepare your enquiry.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-field-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">Full name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject">What is this about?</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option>General enquiry</option>
                  <option>Product information</option>
                  <option>Partnership or collaboration</option>
                  <option>Technical support</option>
                  <option>Feedback or suggestions</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">Your message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <button type="submit" className="button-primary contact-submit">
                Prepare Email <Send size={16} />
              </button>

              {submitted && (
                <p className="contact-success" role="status">
                  Your email application should open with your message
                  prepared. Send it from your email application to complete
                  the enquiry.
                </p>
              )}

              <p className="contact-form-footnote">
                This form opens your default email application. It does not
                send or store your message on a server.
              </p>
            </form>
          </div>
        </section>

        <section className="contact-bottom">
          <div className="section-shell contact-bottom-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                WANT TO EXPLORE FIRST?
              </div>
              <h2>Experience SafeDev AI.</h2>
              <p>Discover the interactive sample simulation.</p>
            </div>

            <Link href="/simulation" className="button-primary">
              Get Simulation <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
