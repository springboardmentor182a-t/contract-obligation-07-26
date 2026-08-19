import React from "react";
import { X } from "lucide-react";

export default function NewObligationModal({
  formData,
  handleFormChange,
  handleCreateObligation,
  onClose,
  submitting,
  formOptionsLoading,
  formOptionsError,
  contracts,
  users,
}) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "24px",
      marginTop: "20px",
      marginBottom: "20px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "16px",
        borderBottom: "1px solid #e2e8f0"
      }}>
          <h2>Create Obligation</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="contract-form" onSubmit={handleCreateObligation}>
          {formOptionsError && (
            <p className="muted" style={{ marginTop: 0, color: "var(--danger)" }}>
              {formOptionsError}
            </p>
          )}

          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="input-group">
              <label>Title</label>
              <input
                name="title"
                type="text"
                placeholder="Obligation Title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Due Date</label>
              <input
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Contract</label>
              <select
                name="contract_id"
                value={formData.contract_id}
                onChange={handleFormChange}
                disabled={formOptionsLoading}
                required
              >
                <option value="">
                  {formOptionsLoading ? "Loading contracts..." : "Select a contract"}
                </option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.contract_name || contract.name || `Contract #${contract.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Owner / Assignee</label>
              <select
                name="owner_id"
                value={formData.owner_id}
                onChange={handleFormChange}
                disabled={formOptionsLoading}
                required
              >
                <option value="">
                  {formOptionsLoading ? "Loading assignees..." : "Select an owner"}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="input-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="due">Due Soon</option>
                <option value="overdue">Overdue</option>
                <option value="on_track">On Track</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: 14 }}>
            <label>Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Add details about this obligation..."
              value={formData.description}
              onChange={handleFormChange}
            />
          </div>

          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button type="button" className="outline-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={submitting || formOptionsLoading || Boolean(formOptionsError)}
            >
              {submitting ? "Creating..." : "Create Obligation"}
            </button>
          </div>
        </form>
    </div>
  );
}
