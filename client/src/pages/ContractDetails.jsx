import "../../styles/details.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Tabs from "../../components/Tabs/Tabs";

import {
  FiArrowLeft,
  FiFileText,
  FiEdit2,
  FiMoreVertical,
} from "react-icons/fi";

import { Link } from "react-router-dom";

function ContractDetails() {
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
                  <h2>Master Services Agreement</h2>

                  <span className="status-badge active">
                    Active
                  </span>
                </div>

                <p className="contract-id">
                  Contract ID:
                  <span> CON-2024-001</span>
                </p>

                <p className="company-name">
                  Acme Corporation
                </p>
              </div>
            </div>

            <div className="contract-header-center">
              <div>
                <span>Start Date</span>
                <h4>01 Jan 2024</h4>
              </div>

              <div>
                <span>End Date</span>
                <h4>31 Dec 2024</h4>
              </div>

              <div>
                <span>Contract Value</span>
                <h4>$250,000</h4>
              </div>

              <div>
                <span>Days Remaining</span>
                <h4 className="green-text">
                  225 Days
                </h4>
              </div>
            </div>

            <div className="contract-header-right">
              <button className="edit-btn">
                <FiEdit2 />
                Edit Contract
              </button>

              <button className="action-btn">
                Actions
                <FiMoreVertical />
              </button>
            </div>
          </div>

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
                    <p>Master Services Agreement</p>
                  </div>

                  <div className="info-item">
                    <label>Contract ID</label>
                    <p>CON-2024-001</p>
                  </div>

                  <div className="info-item">
                    <label>Contract Type</label>
                    <p>Service Agreement</p>
                  </div>

                  <div className="info-item">
                    <label>Status</label>
                    <span className="status-active">
                      Active
                    </span>
                  </div>

                  <div className="info-item">
                    <label>Priority</label>
                    <p>High</p>
                  </div>

                  <div className="info-item">
                    <label>Vendor</label>
                    <p>Acme Corporation</p>
                  </div>

                  <div className="info-item full-width">
                    <label>Description</label>
                    <p>
                      This Master Services Agreement governs all
                      software development and support services
                      provided by Acme Corporation.
                    </p>
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
                    <p>$250,000</p>
                  </div>

                  <div className="info-item">
                    <label>Paid Amount</label>
                    <p>$125,000</p>
                  </div>

                  <div className="info-item">
                    <label>Outstanding</label>
                    <p>$125,000</p>
                  </div>

                  <div className="info-item">
                    <label>Currency</label>
                    <p>USD</p>
                  </div>
                </div>

                <div className="payment-progress">
                  <div className="progress-top">
                    <span>Payment Progress</span>
                    <span>50%</span>
                  </div>

                  <div className="progress-line">
                    <div
                      className="progress-fill"
                      style={{ width: "50%" }}
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
                    <p>Automatic</p>
                  </div>

                  <div className="info-item">
                    <label>Renewal Date</label>
                    <p>31 Dec 2024</p>
                  </div>

                  <div className="info-item">
                    <label>Notice Period</label>
                    <p>60 Days</p>
                  </div>

                  <div className="info-item">
                    <label>Auto Renewal</label>
                    <p>Enabled</p>
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
                      Active
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Priority</span>
                    <strong>High</strong>
                  </div>

                  <div className="summary-item">
                    <span>Contract Value</span>
                    <strong>$250,000</strong>
                  </div>

                  <div className="summary-item">
                    <span>Currency</span>
                    <strong>USD</strong>
                  </div>

                  <div className="summary-item">
                    <span>Payment Terms</span>
                    <strong>Net 30</strong>
                  </div>

                  <div className="summary-item">
                    <span>Renewal</span>
                    <strong>Automatic</strong>
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
                    <strong>15 May 2024</strong>
                  </div>

                  <div className="summary-item">
                    <span>Effective Date</span>
                    <strong>01 Jan 2024</strong>
                  </div>

                  <div className="summary-item">
                    <span>Expiry Date</span>
                    <strong>31 Dec 2024</strong>
                  </div>

                  <div className="summary-item">
                    <span>Renewal Reminder</span>
                    <strong>01 Nov 2024</strong>
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
                    <strong>8 Files</strong>
                  </div>

                  <div className="summary-item">
                    <span>Obligations</span>
                    <strong>12 Items</strong>
                  </div>

                  <div className="summary-item">
                    <span>Tasks</span>
                    <strong>5 Pending</strong>
                  </div>

                  <div className="summary-item">
                    <span>Compliance Score</span>
                    <strong>96%</strong>
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