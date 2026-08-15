import React, { useState } from "react";
import { updateRenewal } from "../../services/renewalService";

export default function EditRenewalModal({
  renewal,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    contract_name: renewal.contract_name || "",
    renewal_type: renewal.renewal_type || "",
    renewal_date: renewal.renewal_date
      ? renewal.renewal_date.substring(0, 10)
      : "",
    reminder_days:
      renewal.reminder_days !== undefined &&
      renewal.reminder_days !== null
        ? renewal.reminder_days
        : "",
    status: renewal.status || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number" && value !== ""
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.contract_name.trim()) {
      alert("Please enter contract name");
      return;
    }

    if (!form.renewal_type) {
      alert("Please select renewal type");
      return;
    }

    if (!form.renewal_date) {
      alert("Please select renewal date");
      return;
    }

    if (
      form.reminder_days === "" ||
      form.reminder_days === null
    ) {
      alert("Please enter reminder days");
      return;
    }

    if (!form.status) {
      alert("Please select status");
      return;
    }

    try {
      setSaving(true);

      console.log("Updating renewal ID:", renewal.id);
      console.log("Sending data:", form);

      const result = await updateRenewal(
        renewal.id,
        form
      );

      console.log("Update response:", result);

      alert("Renewal updated successfully!");

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (err) {
      console.error("Failed to update renewal:", err);

      alert(
        err.message ||
          "Failed to update renewal"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 420,
          maxWidth: "90%",
          padding: 25,
          borderRadius: 12,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          Edit Renewal
        </h2>

        {/* CONTRACT NAME */}
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
            boxSizing: "border-box",
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        />

        {/* RENEWAL TYPE */}
        <select
          name="renewal_type"
          value={form.renewal_type}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
            boxSizing: "border-box",
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        >
          <option value="">
            Select Renewal Type
          </option>

          <option value="Automatic">
            Automatic
          </option>

          <option value="Manual">
            Manual
          </option>
        </select>

        {/* RENEWAL DATE */}
        <input
          type="date"
          name="renewal_date"
          value={form.renewal_date}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
            boxSizing: "border-box",
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        />

        {/* REMINDER DAYS */}
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
            boxSizing: "border-box",
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        />

        {/* STATUS */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 20,
            padding: 10,
            boxSizing: "border-box",
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        >
          <option value="">
            Select Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Expired">
            Expired
          </option>
        </select>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              padding: "10px 18px",
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: 7,
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: "#6C4CFF",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 7,
              cursor: saving
                ? "not-allowed"
                : "pointer",
              fontWeight: 600,
            }}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}