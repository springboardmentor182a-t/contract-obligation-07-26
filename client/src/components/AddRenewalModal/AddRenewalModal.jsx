import { useState } from "react";
import { createRenewal } from "../../services/renewalService";
import "./AddRenewalModal.css";

const AddRenewalModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    contract_id: "",
    renewal_type: "Automatic",
    renewal_date: "",
    reminder_days: 30,
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createRenewal(formData);
      alert("Renewal added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add renewal");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Add Renewal</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="number"
            name="contract_id"
            placeholder="Contract ID"
            value={formData.contract_id}
            onChange={handleChange}
            required
          />

          <select
            name="renewal_type"
            value={formData.renewal_type}
            onChange={handleChange}
          >
            <option>Automatic</option>
            <option>Manual</option>
          </select>

          <input
            type="date"
            name="renewal_date"
            value={formData.renewal_date}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="reminder_days"
            value={formData.reminder_days}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <button type="submit">
            Add Renewal
          </button>

        </form>

      </div>
    </div>
  );
};

export default AddRenewalModal;