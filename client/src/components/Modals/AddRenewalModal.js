import React, { useState } from "react";
import { addRenewal } from "../../services/renewalService";

export default function AddRenewalModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    contract_id: "",
    renewal_date: "",
    reminder_days: 30,
    renewal_type: "Automatic",
    status: "Pending",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await addRenewal(form);
      alert("Renewal added successfully");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Failed to add renewal");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          width: 400,
        }}
      >
        <h2>Add Renewal</h2>

        <input
          type="number"
          name="contract_id"
          placeholder="Contract ID"
          value={form.contract_id}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="date"
          name="renewal_date"
          value={form.renewal_date}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="number"
          name="reminder_days"
          placeholder="Reminder Days"
          value={form.reminder_days}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <select
          name="renewal_type"
          value={form.renewal_type}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        >
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 20, padding: 8 }}
        >
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            background: "#6C4CFF",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Save
        </button>

        <button
          onClick={onClose}
          style={{
            marginLeft: 10,
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}