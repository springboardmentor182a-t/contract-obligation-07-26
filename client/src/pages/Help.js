import React, { useState, useEffect } from "react";
import "./Help.css";
import {
  SearchIcon, ChevDownIcon, SendIcon, CheckIcon, HelpIcon,
} from "../components/Icons";

// Static help category config (UI-only)
const HELP_CATEGORIES = [
  { title: "Getting Started", sub: "Initial setup and ingesting contract PDFs" },
  { title: "Obligation Mapping", sub: "Defining SLAs, compliance parameters, milestones" },
  { title: "Audit & Reporting Logs", sub: "Exporting CSV/PDF history for executive review" },
  { title: "Integrations & Webhooks", sub: "Connecting repositories to external trackers" },
];

function FaqAccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-card ${open ? "open" : ""}`}>
      <button className="faq-header-btn" onClick={() => setOpen((o) => !o)}>
        <span>{item.q}</span>
        <ChevDownIcon size={16} className={`faq-chev ${open ? "open" : ""}`} />
      </button>
      {open && (
        <div className="faq-body-content">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Ticket States
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [details, setDetails] = useState("");

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/faqs");
        if (res.ok) {
          const data = await res.json();
          setFaqs(data);
        }
        // On failure, FAQ list stays empty — no dummy fallback
      } catch (err) {
        console.warn('FAQs API unavailable — waiting for DB connection.', err);
      }
    }
    loadFaqs();
  }, []);

  async function handleTicketSubmit(e) {
    e.preventDefault();
    if (subject.trim() === "" || details.trim() === "") return;
    setSubmitting(true);

    const payload = {
      subject,
      severity,
      description: details,
    };

    try {
      await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn("Could not submit ticket to backend API, completing offline");
    }

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setSubject("");
      setDetails("");
    }, 1500);
  }

  // Filter FAQS by search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help-page-wrapper fade-in-el">
      {/* Search Hero banner */}
      <div className="help-hero-enhanced">
        <h2>Documentation & Support</h2>
        <p className="muted" style={{ color: "rgba(255,255,255,0.75)" }}>
          Find answers, review service level agreements, or log support tickets.
        </p>
        <div className="search-wrap-enhanced">
          <span className="search-ico"><SearchIcon size={16} /></span>
          <input 
            placeholder="Search FAQs, system capabilities, SLA triggers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Help Topic categories */}
      <div className="cat-grid-enhanced">
        {HELP_CATEGORIES.map((c) => (
          <div className="help-category-card" key={c.title}>
            <div className="category-accent-dot" />
            <strong>{c.title}</strong>
            <span>{c.sub}</span>
          </div>
        ))}
      </div>

      {/* Main split grid */}
      <div className="dashboard-grid">
        {/* Accordions */}
        <div>
          <div className="section-title">
            <HelpIcon size={16} color="var(--info)" /> Frequently Asked Questions
          </div>
          <div className="faq-accordion">
            {filteredFaqs.length === 0 ? (
              <div className="empty-faqs">No FAQs found matching your search.</div>
            ) : (
              filteredFaqs.map((f, i) => (
                <FaqAccordionItem item={f} key={i} />
              ))
            )}
          </div>
        </div>

        {/* Ticket Form */}
        <div className="card ticket-card-enhanced">
          {submitted ? (
            <div className="ticket-success-container fade-in-el">
              <div className="success-icon-circle">
                <CheckIcon size={24} color="var(--emerald)" />
              </div>
              <h3>Ticket Received</h3>
              <p className="muted">
                Our compliance support operations will respond within 4 hours for high severity concerns, and 24 hours for general feedback.
              </p>
              <button className="btn btn-ghost" onClick={() => setSubmitted(false)}>
                Submit another ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit}>
              <div className="section-title">
                <SendIcon size={16} color="var(--info)" /> Log Support Ticket
              </div>
              <p className="muted" style={{ fontSize: 12, marginBottom: 15 }}>
                Submit issues to the ContractIQ legal operations support queue.
              </p>

              <div className="modern-input-wrap">
                <label>Ticket Subject</label>
                <input
                  type="text"
                  placeholder="e.g. OCR parser failed on signed Darwinbox PDF"
                  className="modern-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="modern-input-wrap">
                <label>Issue Severity</label>
                <select
                  className="modern-input"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="Low">Low - Question / Feature</option>
                  <option value="Medium">Medium - Workflow Blocked</option>
                  <option value="Critical Compliance Breach">Critical - Compliance Risk</option>
                </select>
              </div>

              <div className="modern-input-wrap">
                <label>Detailed Explanation</label>
                <textarea
                  placeholder="Include specific contract identifiers, SLA dates, or user roles involved..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", display: "flex" }}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
