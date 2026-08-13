import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import SummaryCards from "../components/Renewal/SummaryCards";
import RenewalPipeline from "../components/Renewal/RenewalPipeline";
import RenewalPrediction from "../components/Renewal/RenewalPrediction";
import ExpiringContracts from "../components/Renewal/ExpiringContracts";
import RenewalForm from "../components/Renewal/RenewalForm";
import { getDashboard, createRenewal } from "../services/renewalAPI";
import "../styles/renewal-dashboard.css";

import AIForecast from "../components/AIForecast";

function DashboardHeader({ onRefresh, isLoading }) {
  return (
    <section className="renewal-hero-card">
      <div>
        <p className="renewal-hero-card__label">Renewal Intelligence</p>
        <h1 className="renewal-hero-card__title">Renewal Dashboard</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
          Track upcoming renewals, review AI-guided recommendations and stay ahead of critical contract deadlines.
        </p>
      </div>

      <div className="renewal-hero-card__actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={isLoading}
          onClick={onRefresh}
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>
    </section>
  );
}

export default function RenewalDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboard();
      setDashboard(data);
    } catch (err) {
      setError("Unable to load renewal insights right now.");
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setSuccess("");
    setError("");
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (formData) => {
    setError("");
    setSuccess("");
    try {
      await createRenewal(formData);
      setSuccess("Renewal added successfully.");
      loadDashboard();
    } catch (err) {
      setError("Failed to create renewal. Please check the entered values.");
    }
  };

  return (
    <div className="renewal-dashboard">
      <DashboardHeader onRefresh={loadDashboard} isLoading={loading} />

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="renewal-form-toggle">
        <button className="btn btn-secondary" type="button" onClick={toggleForm}>
          {showForm ? "Hide Add Renewal" : "Add Renewal"}
        </button>
      </div>

      {showForm && <RenewalForm onCreate={handleCreate} />}

      {!loading && !dashboard ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          No renewal data is available yet.
        </div>
      ) : (
        <>
          <SummaryCards data={dashboard?.summary} />
          <div className="renewal-grid">
            <RenewalPipeline data={dashboard?.pipeline} />
            <RenewalPrediction
              data={dashboard?.predictions}
              defaultVisibleCount={3}
              onRefresh={loadDashboard}
              isRefreshing={loading}
            />
          </div>
          <ExpiringContracts data={dashboard?.contracts} />
          <AIForecast />
        </>
      )}
    </div>
  );
}

