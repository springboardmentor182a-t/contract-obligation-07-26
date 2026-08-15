import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  createContract,
  updateContract,
} from "../../services/contractAPI";

export default function NewContractModal({
  contract,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    contract_name: "",
    contract_number: "",
    vendor: "",
    department: "",
    contract_type: "",
    start_date: "",
    end_date: "",
    contract_value: "",
    status: "Active",
    risk_level: "Low",
    owner: "",
    renewal_type: "Manual",
    description: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contract) {
      setFormData({
        contract_name: contract.contract_name || "",
        contract_number: contract.contract_number || "",
        vendor: contract.vendor || "",
        department: contract.department || "",
        contract_type: contract.contract_type || "",
        start_date: contract.start_date
          ? contract.start_date.substring(0, 10)
          : "",
        end_date: contract.end_date
          ? contract.end_date.substring(0, 10)
          : "",
        contract_value: contract.contract_value || "",
        status: contract.status || "Active",
        risk_level: contract.risk_level || "Low",
        owner: contract.owner || "",
        renewal_type: contract.renewal_type || "Manual",
        description: contract.description || "",
      });
    } else {
      setFormData({
        contract_name: "",
        contract_number: "",
        vendor: "",
        department: "",
        contract_type: "",
        start_date: "",
        end_date: "",
        contract_value: "",
        status: "Active",
        risk_level: "Low",
        owner: "",
        renewal_type: "Manual",
        description: "",
      });
    }
  }, [contract]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "contract_value"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (contract) {
        await updateContract(contract.id, formData);
      } else {
        await createContract(formData);
      }

      onSuccess();
    } catch (err) {
      console.error(err);

      alert(
        contract
          ? "Failed to update contract."
          : "Failed to create contract."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="contract-modal">
        <div className="modal-header">
          <h2>
            {contract ? "Edit Contract" : "New Contract"}
          </h2>

          <button
            className="icon-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="contract-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <input
              name="contract_name"
              placeholder="Contract Name"
              value={formData.contract_name}
              onChange={handleChange}
              required
            />

            <input
              name="contract_number"
              placeholder="Contract Number"
              value={formData.contract_number}
              onChange={handleChange}
              required
            />

            <input
              name="vendor"
              placeholder="Vendor"
              value={formData.vendor}
              onChange={handleChange}
              required
            />

            <input
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
            />

            <input
              name="contract_type"
              placeholder="Contract Type"
              value={formData.contract_type}
              onChange={handleChange}
            />

            <input
              type="number"
              name="contract_value"
              placeholder="Contract Value"
              value={formData.contract_value}
              onChange={handleChange}
            />

            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />

            <input
              name="owner"
              placeholder="Owner"
              value={formData.owner}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Expired</option>
            </select>

            <select
              name="risk_level"
              value={formData.risk_level}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              name="renewal_type"
              value={formData.renewal_type}
              onChange={handleChange}
            >
              <option>Manual</option>
              <option>Auto</option>
            </select>
          </div>

          <textarea
            name="description"
            rows="4"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button
              type="button"
              className="outline-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : contract
                ? "Update Contract"
                : "Create Contract"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}