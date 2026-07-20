import { useState } from "react";

const INITIAL_FORM = {
  contract_name: "",
  vendor: "",
  department: "",
  renewal_date: "",
  expiry_date: "",
  status: "Upcoming",
  approval_status: "Pending",
  contract_value: "",
  confidence: "",
  recommendation: "",
};

export default function RenewalForm({ onCreate }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      contract_value: Number(form.contract_value),
      confidence: Number(form.confidence),
    };
    onCreate(payload);
    setForm(INITIAL_FORM);
  };

  return (
    <section className="renewal-card renewal-card--form">
      <h2>Add Renewal</h2>
      <form className="renewal-form" onSubmit={handleSubmit}>
        <div className="renewal-form__grid">
          <label>
            Contract Name
            <input
              type="text"
              name="contract_name"
              value={form.contract_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Vendor
            <input
              type="text"
              name="vendor"
              value={form.vendor}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Department
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
            />
          </label>

          <label>
            Renewal Date
            <input
              type="date"
              name="renewal_date"
              value={form.renewal_date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Expiry Date
            <input
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Status
            <input
              type="text"
              name="status"
              value={form.status}
              onChange={handleChange}
            />
          </label>

          <label>
            Approval Status
            <input
              type="text"
              name="approval_status"
              value={form.approval_status}
              onChange={handleChange}
            />
          </label>

          <label>
            Contract Value
            <input
              type="number"
              name="contract_value"
              value={form.contract_value}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Confidence (%)
            <input
              type="number"
              name="confidence"
              value={form.confidence}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </label>

          <label className="renewal-form__full-width">
            Recommendation
            <textarea
              name="recommendation"
              value={form.recommendation}
              onChange={handleChange}
              rows="2"
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Add Renewal
        </button>
      </form>
    </section>
  );
}
