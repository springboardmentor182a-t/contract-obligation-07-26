import React, { useState } from "react";
import { addRenewal } from "../../services/renewalService";

export default function AddRenewalModal({
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    contract_name: "",
    renewal_type: "",
    renewal_date: "",
    reminder_days: "",
    status: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number" && e.target.value !== ""
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await addRenewal(form);

      alert("Renewal added successfully!");

      if (onSuccess) onSuccess();

      onClose();

      setForm({
        contract_name: "",
        renewal_type: "",
        renewal_date: "",
        reminder_days: "",
        status: "",
      });
    } 
catch (err) {
  console.error(err);

  if (err.message) {
    alert(err.message);
  } else {
    alert("Failed to add renewal");
  }
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
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 420,
          padding: 20,
          borderRadius: 12,
        }}
      >
        <h2>Add Renewal</h2>

        <input
          type="text"
          name="contract_name"
          placeholder="Contract Name"
          value={form.contract_name}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
          }}
        />

        <select
          name="renewal_type"
          value={form.renewal_type}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
          }}
        >
          <option value="">Select Renewal Type</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>

        <input
          type="date"
          name="renewal_date"
          value={form.renewal_date}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
          }}
        />

        <input
          type="number"
          name="reminder_days"
          placeholder="Reminder Days"
          value={form.reminder_days}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
          }}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 20,
            padding: 10,
          }}
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            background: "#6C4CFF",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
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
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}