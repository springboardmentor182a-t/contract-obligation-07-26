import React, { useState } from "react";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import { createObligation } from "../services/obligationsApi";
import { OBLIGATION_TYPE_OPTIONS } from "../../../data/constants";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function ObligationForm({ contracts = [], onSuccess, onCancel }) {
  const [form, setForm] = useState({
    contract_id: "",
    title: "",
    description: "",
    obligation_type: "",
    priority: "medium",
    due_date: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field) {
    return (value) => setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await createObligation(form);
      onSuccess?.(created);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create the obligation.");
    } finally {
      setSaving(false);
    }
  }

  const contractOptions = contracts.map((c) => ({ value: c.id, label: c.name }));

  return (
    <form onSubmit={handleSubmit}>
      <FormSelect label="Contract" value={form.contract_id} onChange={update("contract_id")} options={contractOptions} required />
      <FormInput label="Obligation Name" value={form.title} onChange={update("title")} required />
      <FormSelect label="Type" value={form.obligation_type} onChange={update("obligation_type")} options={OBLIGATION_TYPE_OPTIONS} required />
      <FormSelect label="Priority" value={form.priority} onChange={update("priority")} options={PRIORITY_OPTIONS} required />
      <FormInput label="Due Date" type="date" value={form.due_date} onChange={update("due_date")} required />

      <div className="form-field">
        <label>Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => update("description")(e.target.value)} />
      </div>

      {error && <p style={{ color: "var(--color-danger)", fontSize: 13 }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Add Obligation"}
        </button>
      </div>
    </form>
  );
}