import { useEffect, useState } from "react";

const INITIAL_FORM = {
  contract_id: "",
  department: "",
  renewal_date: "",
  expiry_date: "",
  status: "Upcoming",
  approval_status: "Pending",
  confidence: "",
  recommendation: "",
};

export default function RenewalForm({ onCreate }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [contracts, setContracts] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(true);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const response = await fetch(
          "/api/contracts",
          { headers }
        );

        if (!response.ok) {
          throw new Error("Unable to load contracts.");
        }

        const data = await response.json();

        setContracts(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Contract loading error:",
          error
        );
      } finally {
        setLoadingContracts(false);
      }
    };

    loadContracts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "contract_id") {
      const selectedContract = contracts.find(
        (contract) =>
          String(contract.id) === String(value)
      );

      setForm((prev) => ({
        ...prev,
        contract_id: value,
        department:
          selectedContract?.department || "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.contract_id) {
      alert("Please select a contract.");
      return;
    }

    const selectedContract = contracts.find(
      (contract) =>
        String(contract.id) ===
        String(form.contract_id)
    );

    if (!selectedContract) {
      alert("Selected contract could not be found.");
      return;
    }

    const payload = {
      contract_id: Number(form.contract_id),

      // These are synchronized by the backend,
      // but sending them keeps the request compatible
      // with the existing schema.
      contract_name:
        selectedContract.contract_name,
      vendor:
        selectedContract.vendor,

      department:
        form.department ||
        selectedContract.department ||
        "",

      renewal_date: form.renewal_date,
      expiry_date: form.expiry_date,
      status: form.status,
      approval_status: form.approval_status,

      contract_value:
        selectedContract.contract_value ?? 0,

      confidence:
        Number(form.confidence),

      recommendation:
        form.recommendation,
    };

    onCreate(payload);
    setForm(INITIAL_FORM);
  };

  return (
    <section className="renewal-card renewal-card--form">
      <h2>Add Renewal</h2>

      <form
        className="renewal-form"
        onSubmit={handleSubmit}
      >
        <div className="renewal-form__grid">

          <label>
            Contract
            <select
              name="contract_id"
              value={form.contract_id}
              onChange={handleChange}
              required
              disabled={loadingContracts}
            >
              <option value="">
                {loadingContracts
                  ? "Loading contracts..."
                  : "Select a contract"}
              </option>

              {contracts.map((contract) => (
                <option
                  key={contract.id}
                  value={contract.id}
                >
                  {contract.contract_name} —{" "}
                  {contract.vendor}
                </option>
              ))}
            </select>
          </label>

          <label>
            Department
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
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
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Upcoming">
                Upcoming
              </option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">
                Completed
              </option>
              <option value="Overdue">
                Overdue
              </option>
            </select>
          </label>

          <label>
            Approval Status
            <select
              name="approval_status"
              value={form.approval_status}
              onChange={handleChange}
            >
              <option value="Pending">
                Pending
              </option>
              <option value="Approved">
                Approved
              </option>
              <option value="Rejected">
                Rejected
              </option>
            </select>
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
              placeholder="Enter renewal recommendation"
            />
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={loadingContracts}
        >
          Add Renewal
        </button>
      </form>
    </section>
  );
}