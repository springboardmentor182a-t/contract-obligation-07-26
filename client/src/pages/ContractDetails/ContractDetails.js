import BASE_URL from "../../config/api";
import "../../styles/details.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Tabs from "../../components/Tabs/Tabs";


import {
  FiArrowLeft,
  FiFileText,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const deleteContract = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this contract?"
  );

  if (!confirmDelete) return;

  try {
  const response = await fetch(
    `${BASE_URL}/contracts/${id}`,
    {
      method: "DELETE",
    }
  );

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    alert("Contract deleted successfully.");

    navigate("/");
  } catch (error) {
    console.error(error);
    alert("Unable to delete contract.");
  }
};

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${BASE_URL}/contracts/${id}`
        );

        if (!response.ok) {
          throw new Error("Contract not found");
        }

        const data = await response.json();
        setContract(data);
      } catch (error) {
        console.error(error);
        setContract(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!contract) {
    return <h2>Contract not found.</h2>;
  }
  return (
    <div className="details-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="details-main">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="details-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/" className="back-link">
              <FiArrowLeft />
              Back to Contract Repository
            </Link>
          </div>

          {/* Page Heading */}
          <div className="page-heading">
            <div>
              <h1>Contract Details</h1>
              <p>Contracts &gt; Contract Details</p>
            </div>
          </div>

          {/* Contract Header */}
          <div className="contract-header-card">
            <div className="contract-header-left">
              <div className="contract-icon">
                <FiFileText />
              </div>

              <div>
                <div className="title-row">
                  <h2>{contract.contract}</h2>

                  <span className="status-badge active">
                    {contract.status}
                  </span>
                </div>

                <p className="contract-id">
                  Contract ID:
                  <span>{contract.id}</span>
                </p>

                <p className="company-name">
                  {contract.company}
                </p>
              </div>
            </div>

            <div className="contract-header-center">
              <div>
                <span>Start Date</span>
                <h4>{contract.start_date}</h4>
              </div>

              <div>
                <span>End Date</span>
                <h4>{contract.end_date}</h4>
              </div>

              <div>
                <span>Contract Value</span>
                <h4>{contract.value}</h4>
              </div>

              <div>
                <span>Days Remaining</span>
                <h4 className="green-text">
                  {contract.days_remaining} Days
                </h4>
              </div>
            </div>

            <div className="contract-header-right">

              <button
                className="edit-btn"
                onClick={() => navigate(`/edit-contract/${contract.id}`)}
              >
               <FiEdit2 />
                Edit Contract
              </button>

              <button
                className="delete-btn"
                onClick={deleteContract}
              >
                <FiTrash2 />
                Delete
              </button>

            </div> {/* contract-header-right */}

            </div> {/* contract-header-card */}

            {/* Tabs */}
            <Tabs />

          {/* Details Content */}
          <div className="details-content">

            {/* Left Section */}
            <div className="details-left">

              {/* Contract Information */}
              <div className="details-card">
                <div className="card-header">
                  <h3>Contract Information</h3>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <label>Contract Name</label>
                    <p>{contract.contract}</p>
                  </div>

                  <div className="info-item">
                    <label>Contract ID</label>
                    <p>{contract.id}</p>
                  </div>

                  <div className="info-item">
                    <label>Contract Type</label>
                    <p>{contract.category}</p>
                  </div>

                  <div className="info-item">
                    <label>Status</label>
                    <span className="status-active">
                      {contract.status}
                    </span>
                  </div>

                  <div className="info-item">
                    <label>Priority</label>
                    <p>{contract.priority}</p>
                  </div>

                  <div className="info-item">
                    <label>Vendor</label>
                    <p>{contract.company}</p>
                  </div>

                  <div className="info-item full-width">
                    <label>Description</label>
                    <p>{contract.description}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="details-card">
                <div className="card-header">
                  <h3>Financial Details</h3>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <label>Contract Value</label>
                     <p>{contract.value}</p>
                  </div>

                  <div className="info-item">
                    <label>Paid Amount</label>
                    <p>{contract.paid_amount}</p>
                  </div>

                  <div className="info-item">
                    <label>Outstanding</label>
                    <p>{contract.outstanding}</p>
                  </div>

                  <div className="info-item">
                    <label>Currency</label>
                    <p>{contract.currency}</p>
                  </div>
                </div>

                <div className="payment-progress">
                  <div className="progress-top">
                    <span>Payment Progress</span>
                    <span>{contract.payment_progress}%</span>
                    
                  </div>

                  <div className="progress-line">
                    <div
                      className="progress-fill"
                      style={{ width: `${contract.payment_progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Renewal Information */}
              <div className="details-card">
                <div className="card-header">
                  <h3>Renewal Information</h3>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <label>Renewal Type</label>
                    <p>{contract.renewal_type}</p>
                  </div>

                  <div className="info-item">
                    <label>Renewal Date</label>
                    <p>{contract.renewal}</p>
                  </div>

                  <div className="info-item">
                    <label>Notice Period</label>
                    <p>{contract.notice_period}</p>
                  </div>

                  <div className="info-item">
                    <label>Auto Renewal</label>
                    <p>{contract.auto_renewal}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="details-right">

              {/* Contract Summary */}
              <div className="details-card">
                <div className="card-header">
                  <h3>Contract Summary</h3>
                </div>

                <div className="summary-list">
                  <div className="summary-item">
                    <span>Status</span>
                    <strong className="status-active">
                      {contract.status}
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Priority</span>
                    <strong>{contract.priority}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Contract Value</span>
                    <strong>{contract.value}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Currency</span>
                    <strong>{contract.currency}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Payment Terms</span>
                    <strong>{contract.payment_terms}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Renewal</span>
                    <strong>{contract.renewal_type}</strong>
                  </div>
                </div>
              </div>

              {/* Key Dates */}
              <div className="details-card">
                <div className="card-header">
                  <h3>Key Dates</h3>
                </div>

                <div className="summary-list">
                  <div className="summary-item">
                    <span>Created On</span>
                    <strong>{contract.created_on}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Effective Date</span>
                    <strong>{contract.effective_date}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Expiry Date</span>
                    <strong>{contract.expiry_date}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Renewal Reminder</span>
                    <strong>{contract.renewal_reminder}</strong>
                  </div>
                </div>
              </div>

              {/* Related */}
              <div className="details-card">
                <div className="card-header">
                  <h3>Related</h3>
                </div>

                <div className="summary-list">
                  <div className="summary-item">
                    <span>Documents</span>
                    <strong>{contract.documents} Files</strong>
                  </div>

                  <div className="summary-item">
                    <span>Obligations</span>
                    <strong>{contract.obligations} Items</strong>
                  </div>

                  <div className="summary-item">
                    <span>Tasks</span>
                    <strong>{contract.tasks} Tasks</strong>
                  </div>

                  <div className="summary-item">
                    <span>Compliance Score</span>
                    <strong>{contract.compliance}%</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractDetails;