import React, { useCallback, useEffect, useState } from "react";
import {
  X,
  Upload,
  Eye,
  Download,
  Trash2,
  FileText,
} from "lucide-react";

import {
  uploadDocument,
  getDocuments,
  previewDocument,
  downloadDocument,
  removeDocument,
} from "../../services/contractAPI";

export default function ViewContractModal({
  contract,
  onClose,
}) {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const loadDocuments = useCallback(async () => {
    if (!contract?.id) return;
    try {
      const data = await getDocuments(contract.id);
      setDocuments(data || []);
    } catch (error) {
      console.error(error);
    }
  }, [contract]);

  useEffect(() => {
    if (contract) {
      loadDocuments();
    }
  }, [contract, loadDocuments]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      await uploadDocument(contract.id, file);

      await loadDocuments();
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      await removeDocument(id);
      await loadDocuments();
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  };

  const handlePreview = async (id) => {
    const previewWindow = window.open("", "_blank");
    try {
      const objectUrl = await previewDocument(id);
      if (previewWindow) {
        previewWindow.location = objectUrl;
      }
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch (error) {
      if (previewWindow) previewWindow.close();
      console.error(error);
      alert("Preview failed.");
    }
  };

  const handleDownload = async (document) => {
    try {
      await downloadDocument(document.id, document.original_name);
    } catch (error) {
      console.error(error);
      alert("Download failed.");
    }
  };

  if (!contract) return null;

  return (
    <div className="modal-overlay">
      <div className="view-contract-modal">

        <div className="modal-header">
          <h2>Contract Details</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">

          <div className="detail-row">
            <span>Contract Name</span>
            <strong>{contract.contract_name}</strong>
          </div>

          <div className="detail-row">
            <span>Contract Number</span>
            <strong>{contract.contract_number}</strong>
          </div>

          <div className="detail-row">
            <span>Vendor</span>
            <strong>{contract.vendor}</strong>
          </div>

          <div className="detail-row">
            <span>Department</span>
            <strong>{contract.department}</strong>
          </div>

          <div className="detail-row">
            <span>Contract Type</span>
            <strong>{contract.contract_type}</strong>
          </div>

          <div className="detail-row">
            <span>Contract Value</span>
            <strong>
              ₹
              {contract.contract_value
                ? Number(contract.contract_value).toLocaleString("en-IN")
                : "0"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <strong>{contract.status}</strong>
          </div>

          <div className="detail-row">
            <span>Start Date</span>
            <strong>
              {contract.start_date
                ? new Date(contract.start_date).toLocaleDateString("en-IN")
                : "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>End Date</span>
            <strong>
              {contract.end_date
                ? new Date(contract.end_date).toLocaleDateString("en-IN")
                : "-"}
            </strong>
          </div>

          <div className="detail-description">
            <span>Description</span>

            <p>
              {contract.description || "No description available."}
            </p>
          </div>

          <hr style={{ margin: "25px 0" }} />

          <div className="documents-section">

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3>Documents</h3>

              <label
                className={`primary-btn ${uploading ? "disabled" : ""}`}
                htmlFor="contract-upload"
                style={{ opacity: uploading ? 0.6 : 1, cursor: uploading ? "wait" : "pointer" }}
              >
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload Document"}
              </label>

              <input
                id="contract-upload"
                type="file"
                disabled={uploading}
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </div>
                        {documents.length === 0 ? (
              <div className="no-documents">
                <FileText size={48} />
                <h4>No Documents</h4>
                <p>Upload PDF or DOCX files for this contract.</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="document-card"
                >
                  <div className="document-left">
                    <div className="document-icon">
                      <FileText size={22} />
                    </div>

                    <div className="document-info">
                      <div className="document-name">
                        {doc.original_name}
                      </div>

                      <div className="document-meta">
                        {doc.file_size >= 1024 * 1024
                          ? `${(
                              doc.file_size /
                              (1024 * 1024)
                            ).toFixed(2)} MB`
                          : `${(
                              doc.file_size / 1024
                            ).toFixed(1)} KB`}
                      </div>
                    </div>
                  </div>

                  <div className="document-actions">
                    <button
                      className="document-icon-btn"
                      title="Preview"
                      onClick={() => handlePreview(doc.id)}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="document-icon-btn"
                      title="Download"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download size={18} />
                    </button>

                    <button
                      className="document-icon-btn document-delete-btn"
                      title="Delete"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>

        </div>

        <div className="modal-footer">
          <button
            className="primary-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
