import { useUI } from "../context/UIContext";
import { FileIcon, AlertTriIcon, InfoIcon, RepeatIcon } from "../components/Icons";

function Kpi({ Icon, color, val, label }) {
  return (
    <div className="kpi-card">
      <div className="top"><div className="ico" style={{ background: color + "22", color }}><Icon size={17} /></div></div>
      <div className="val">{val}</div>
      <div className="lbl">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUI();
  const firstName = (user?.name || "Arjun Mehta").split(" ")[0];

  return (
    <div>
      <div className="page-title">Welcome back, {firstName}</div>
      <div className="page-sub">Here's what's happening across your contract portfolio today.</div>
      <div className="kpi-grid">
        <Kpi Icon={FileIcon} color="#3B82F6" val="248" label="Active Contracts" />
        <Kpi Icon={AlertTriIcon} color="#F59E0B" val="17" label="Obligations Due (30d)" />
        <Kpi Icon={InfoIcon} color="#EF4444" val="3" label="Overdue Compliance" />
        <Kpi Icon={RepeatIcon} color="#10B981" val="9" label="Renewals This Quarter" />
      </div>
      <div className="card" style={{ padding: 22 }}>
        <div className="section-title">Upcoming Obligations</div>
        <table>
          <thead><tr><th>Obligation</th><th>Contract</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td>Vendor SLA Renewal</td><td>MSA - Cloudline Inc.</td><td>Priya N.</td><td>Jul 12, 2026</td>
              <td><span className="badge warn">Due Soon</span></td>
            </tr>
            <tr>
              <td>Data Processing Addendum Review</td><td>DPA - Northbridge Ltd.</td><td>Arjun M.</td><td>Jul 15, 2026</td>
              <td><span className="badge warn">Due Soon</span></td>
            </tr>
            <tr>
              <td>Insurance Certificate Submission</td><td>Vendor Agreement - SafeHaul</td><td>Karan S.</td><td>Jul 3, 2026</td>
              <td><span className="badge danger">Overdue</span></td>
            </tr>
            <tr>
              <td>Payment Milestone - Phase 2</td><td>Services Agreement - Prism Co.</td><td>Meera R.</td><td>Aug 1, 2026</td>
              <td><span className="badge emerald">On Track</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
