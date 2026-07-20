import "./Compliance.css";

const SCORE = 84;
const CATEGORIES = [
  { name: "Data Privacy & GDPR", score: 92, status: "Strong" },
  { name: "Contract Term Consistency", score: 88, status: "Strong" },
  { name: "Regulatory Filings", score: 76, status: "Needs Review" },
  { name: "Financial Controls", score: 81, status: "Strong" },
  { name: "Vendor Risk Assessment", score: 63, status: "At Risk" },
];
const FLAGS = [
  { title: "3 contracts missing SLA clauses", color: "#F59E0B", detail: "Flagged during last extraction pass \u2014 legal review recommended." },
  { title: "SafeHaul vendor risk score dropped to 63%", color: "#EF4444", detail: "Insurance certificate overdue by 5 days is contributing to the drop." },
  { title: "GDPR data-processing terms verified", color: "#10B981", detail: "All active EU-counterparty contracts now carry a current DPA." },
];

function scoreColor(score) {
  if (score >= 85) return "#10B981";
  if (score >= 70) return "#F59E0B";
  return "#EF4444";
}

export default function Compliance() {
  const ringColor = scoreColor(SCORE);

  return (
    <div className="page-surface compliance-page">
      <h2>Compliance</h2>
      <p className="muted">Compliance score, policies and checks.</p>

      <div className="grid-split" style={{ marginTop: 18 }}>
        <div>
          <div className="compliance-hero">
            <div className="score-ring" style={{ background: `conic-gradient(${ringColor} ${SCORE * 3.6}deg, var(--color-border) 0deg)` }}>
              <div className="inner">
                <div className="num" style={{ color: ringColor }}>{SCORE}%</div>
                <div className="lbl">Overall</div>
              </div>
            </div>
            <p className="muted" style={{ margin: 0 }}>
              Your compliance score improved 3 points this month after 3 obligations were resolved.
              One category still needs attention.
            </p>
          </div>

          <div className="section-title" style={{ marginTop: 20 }}>Category Breakdown</div>
          {CATEGORIES.map((c) => (
            <div className="renewal-row" key={c.name}>
              <div className="renewal-row-top">
                <strong>{c.name}</strong>
                <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(c.score) }}>{c.status}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: c.score + "%", background: scoreColor(c.score) }} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="section-title">Active Flags</div>
          {FLAGS.map((f, i) => (
            <div className="flag-item" key={i}>
              <span className="status-dot" style={{ background: f.color, marginTop: 5 }} />
              <div><div className="task-title">{f.title}</div><div className="task-meta">{f.detail}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
