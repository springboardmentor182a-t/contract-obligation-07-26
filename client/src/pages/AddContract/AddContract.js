import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../data/constants";
import "../../styles/AddContract.css";

function AddContract({ onClose, onContractAdded }) {
  const { id } = useParams();

  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [contract, setContract] = useState({
  id: "",
  company: "",
  contract: "",
  category: "",
  value: "",
  owner: "",
  status: "Draft",
  compliance: 0,
  renewal: "",
  start_date: "",
  end_date: "",
  days_remaining: 0,
  priority: "Medium",
  description: "",
  paid_amount: "",
  outstanding: "",
  currency: "USD",
  payment_progress: 0,
  renewal_type: "",
  notice_period: "",
  auto_renewal: "",
  created_on: "",
  effective_date: "",
  expiry_date: "",
  renewal_reminder: "",
  documents: 0,
  obligations: 0,
  tasks: 0,
});

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numberFields = [
      "compliance",
      "days_remaining",
      "payment_progress",
      "documents",
      "obligations",
      "tasks",
    ];

    setContract((prev) => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? Number(value)
        : value,
    }));
  };

  useEffect(() => {
    if (!isEditMode) return;

    const fetchContract = async () => {
      try {
        setLoading(true);

        const response = await fetch(
         `${API_BASE_URL}/contracts/${id}`
        );

        if (!response.ok) {
          throw new Error("Contract not found");
        }

        const data = await response.json();

        setContract(data);
      } catch (error) {
        console.error("Error fetching contract:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      contract.start_date &&
      contract.end_date &&
      contract.end_date < contract.start_date
    ) {
      alert("End Date cannot be before Start Date.");
      return;
    }

    try {
      setSaving(true);

      const url = isEditMode
        ? `${API_BASE_URL}/contracts/${id}`
        : `${API_BASE_URL}/contracts`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contract),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(error);
        throw new Error(`Failed to save contract (${response.status})`);
}
      const result = await response.json();
      console.log(result);

      alert(
        isEditMode
        ? "Contract updated successfully!"
        : "Contract added successfully!"
    );

    onContractAdded?.();
    onClose?.();
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      } finally {
        setSaving(false);
      }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="add-container">

          <h1>
            {isEditMode ? "Edit Contract" : "Add New Contract"}
          </h1>

          <p>
            {isEditMode
              ? "Update contract information."
              : "Create a new contract."}
          </p>

          <form
            className="contract-form"
            onSubmit={handleSubmit}
          >
                <div className="form-grid">

                    <div className="form-group">
                        <label>Contract Name</label>
                        <input
                        type="text"
                        name="contract"
                        value={contract.contract}
                        onChange={handleChange}
                        required
                    />
                    </div>
                    <div className="form-group">
                      <label>Contract ID</label>
                      <input
                        type="text"
                        name="id"
                        value={contract.id}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                    <label>Company</label>
                    <input
                        type="text"
                        name="company"
                        value={contract.company}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={contract.category}
                        onChange={handleChange}
                    />
                    </div>

                    <div className="form-group">
                    <label>Owner</label>
                    <input
                        type="text"
                        name="owner"
                        value={contract.owner}
                        onChange={handleChange}
                    />
                    </div>

                    <div className="form-group">
                     <label>Contract Value</label>
                    <input
                        type="text"
                        name="value"
                        value={contract.value}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="form-group">
                      <label>Paid Amount</label>
                      <input
                        type="text"
                        name="paid_amount"
                        value={contract.paid_amount}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Outstanding Amount</label>
                      <input
                        type="text"
                        name="outstanding"
                        value={contract.outstanding}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Currency</label>
                      <input
                        type="text"
                        name="currency"
                        value={contract.currency}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                        <label>Status</label>

                        <select
                         name="status"
                             value={contract.status}
                        onChange={handleChange}
                    >
                         <option value="Draft">Draft</option>
                         <option value="Active">Active</option>
                         <option value="Review">Review</option>
                         <option value="Expired">Expired</option>
                        </select>
                    </div>
                    <div className="form-group">
                      <label>Compliance (%)</label>
                      <input
                        type="number"
                        name="compliance"
                        value={contract.compliance}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                        <label>Priority</label>

                        <select
                            name="priority"
                            value={contract.priority}
                            onChange={handleChange}
                    >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Start Date</label>

                    <input
                        type="date"
                        name="start_date"
                        value={contract.start_date}
                        onChange={handleChange}
                    />
                    </div>

                    <div className="form-group">
                        <label>End Date</label>

                        <input
                            type="date"
                            name="end_date"
                            value={contract.end_date}
                            onChange={handleChange}
                    />
                    </div>
                    <div className="form-group">
                      <label>Renewal Date</label>
                      <input
                        type="date"
                        name="renewal"
                        value={contract.renewal}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Days Remaining</label>
                      <input
                        type="number"
                        name="days_remaining"
                        value={contract.days_remaining}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Payment Progress (%)</label>
                      <input
                        type="number"
                        name="payment_progress"
                        value={contract.payment_progress}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Renewal Type</label>
                      <input
                        type="text"
                        name="renewal_type"
                        value={contract.renewal_type}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Notice Period</label>
                      <input
                        type="text"
                        name="notice_period"
                        value={contract.notice_period}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Auto Renewal</label>
                      <select
                        name="auto_renewal"
                        value={contract.auto_renewal}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="Enabled">Enabled</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Created On</label>
                      <input
                        type="date"
                        name="created_on"
                        value={contract.created_on}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Effective Date</label>
                      <input
                        type="date"
                        name="effective_date"
                        value={contract.effective_date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        name="expiry_date"
                        value={contract.expiry_date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Renewal Reminder</label>
                      <input
                        type="date"
                        name="renewal_reminder"
                        value={contract.renewal_reminder}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Documents</label>
                      <input
                        type="number"
                        name="documents"
                        value={contract.documents}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Obligations</label>
                      <input
                        type="number"
                        name="obligations"
                        value={contract.obligations}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Tasks</label>
                      <input
                        type="number"
                        name="tasks"
                        value={contract.tasks}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group full-width">
                    <label>Description</label>

                    <textarea
                        rows="5"
                        name="description"
                        value={contract.description}
                        onChange={handleChange}
                    />
                    </div>

                </div>

                <div className="form-buttons">

                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        if (onClose) {
                          onClose();
                        }
                      }}
                    >
                        Cancel
                    </button>

                    <button
                      type="submit"
                      className="save-btn"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : isEditMode
                          ? "Update Contract"
                          : "Save Contract"}
                    </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  export default AddContract;
