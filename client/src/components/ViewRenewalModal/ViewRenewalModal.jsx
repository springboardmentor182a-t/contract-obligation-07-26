import "./ViewRenewalModal.css";

const ViewRenewalModal = ({ renewal, onClose }) => {

  if (!renewal) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Renewal Details</h2>

        <div className="modal-body">

          <p><strong>Contract:</strong> {renewal.contract_name}</p>

          <p><strong>Client:</strong> {renewal.client_name}</p>

          <p><strong>Renewal Type:</strong> {renewal.renewal_type}</p>

          <p>
            <strong>Renewal Date:</strong>{" "}
            {new Date(renewal.renewal_date).toLocaleDateString()}
          </p>

          <p><strong>Reminder Days:</strong> {renewal.reminder_days}</p>

          <p><strong>Status:</strong> {renewal.status}</p>

        </div>

        <button
          className="close-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </div>
  );
};

export default ViewRenewalModal;