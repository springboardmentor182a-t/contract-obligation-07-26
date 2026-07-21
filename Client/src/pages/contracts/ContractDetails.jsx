import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, CheckCircle, Clock, FileSignature, X, Upload, Edit, Send } from 'lucide-react';
import './Contracts.css';
import { createNotification } from '../../features/notifications/services/notificationAPI';

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contractStatus, setContractStatus] = useState('Draft');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const [contract, setContract] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        // Assuming getContractById exists in contractAPI
        // const data = await getContractById(id);
        // For now, we simulate API behavior which would fail (404)
        // setContract(data);
      } catch (err) {
        console.error("Failed to fetch contract:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id]);

  const getBadgeStyle = () => {
    switch (contractStatus) {
      case 'Draft': return 'badge-primary';
      case 'Under Review': return 'badge-warning';
      case 'Approved': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      case 'Active': return 'badge-success';
      default: return '';
    }
  };

  const handleSendForReview = async () => {
    setContractStatus('Under Review');
    setTimeline([...timeline, { id: 2, date: new Date().toLocaleString(), title: 'Sent for Internal Review', desc: 'to Legal Department', status: 'completed' }]);
    try {
      await createNotification({ title: 'Approval Requested', message: `Approval requested for Contract ${id}.` });
      window.dispatchEvent(new Event('notification-created'));
    } catch (err) { console.error(err); }
  };

  const handleApprove = async () => {
    setContractStatus('Approved');
    setTimeline([...timeline, { id: 3, date: new Date().toLocaleString(), title: 'Final Approval', desc: 'by Jane Doe', status: 'completed' }]);
    try {
      await createNotification({ title: 'Contract Approved', message: `Contract ${id} has been approved.` });
      window.dispatchEvent(new Event('notification-created'));
    } catch (err) { console.error(err); }
  };
  
  const handleReject = async () => {
    setContractStatus('Rejected');
    setTimeline([...timeline, { id: 4, date: new Date().toLocaleString(), title: 'Rejected', desc: 'by Jane Doe', status: 'completed' }]);
    try {
      await createNotification({ title: 'Contract Rejected', message: `Contract ${id} has been rejected.` });
      window.dispatchEvent(new Event('notification-created'));
    } catch (err) { console.error(err); }
  };

  const handleUploadVersion = async (e) => {
    e.preventDefault();
    const newV = `v${versions.length + 1}.0`;
    const newVersions = versions.map(v => ({ ...v, current: false }));
    setVersions([{ id: newV, date: new Date().toLocaleDateString(), current: true }, ...newVersions]);
    setIsVersionModalOpen(false);
    setTimeline([...timeline, { id: Date.now(), date: new Date().toLocaleString(), title: `Version ${newV} Uploaded`, desc: 'by John Smith', status: 'completed' }]);
    try {
      await createNotification({ title: 'New Contract Version Uploaded', message: `Version ${newV} uploaded for Contract ${id}.` });
      window.dispatchEvent(new Event('notification-created'));
    } catch (err) { console.error(err); }
  };
  
  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setTimeline([...timeline, { id: Date.now(), date: new Date().toLocaleString(), title: 'New Comment', desc: commentText, status: 'completed' }]);
    try {
      await createNotification({ title: 'New Comment / @Mention', message: `New comment on Contract ${id}: "${commentText.substring(0, 30)}..."` });
      window.dispatchEvent(new Event('notification-created'));
    } catch (err) { console.error(err); }
    setCommentText('');
  };

  return (
    <div className="contract-details-container">
      <div className="back-link" onClick={() => navigate('/contracts')}>
        <ArrowLeft size={18} />
        <span>Back to Repository</span>
      </div>

      <div className="details-header">
        <div className="details-title-section flex gap-4 items-center">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-bg-light)', color: 'var(--color-primary)' }}>
            <FileText size={28} />
          </div>
          <div>
            <h1>{contract?.name || 'Unknown Contract'}</h1>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>ID: {id}</span>
              <span>Category: {contract?.category || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`badge ${getBadgeStyle()} text-sm`} style={{ padding: '0.4rem 0.8rem' }}>{contractStatus}</span>

          {contractStatus === 'Draft' && (
            <button className="btn btn-primary" onClick={handleSendForReview}>
              <Send size={18} /> Send for Review
            </button>
          )}

          {contractStatus === 'Under Review' && (
            <div className="flex gap-2">
              <button className="btn btn-success" style={{ backgroundColor: 'var(--color-success)', color: 'white' }} onClick={handleApprove}>
                <CheckCircle size={18} /> Approve Contract
              </button>
              <button className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={handleReject}>
                <X size={18} /> Reject
              </button>
            </div>
          )}

          <button className="btn btn-outline">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="details-grid">
        <div className="flex-col gap-6">
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.5rem' }}>
              <h3>Contract Information</h3>
              <button className="btn-icon" onClick={() => setIsEditModalOpen(true)}>
                <Edit size={18} />
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Company Name</span>
                <span className="info-value">{contract?.companyName || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vendor Name</span>
                <span className="info-value">{contract?.vendorName || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value">{contract?.category || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Contract Value</span>
                <span className="info-value">{contract?.value || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Effective Date</span>
                <span className="info-value">{contract?.effectiveDate || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Expiry Date</span>
                <span className="info-value text-danger">{contract?.expiry || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Responsible Person</span>
                <span className="info-value">{contract?.responsiblePerson || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Department</span>
                <span className="info-value">{contract?.department || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h3>Obligations & Milestones</h3>
              <button className="btn btn-secondary text-sm">Add Obligation</button>
            </div>
            <div className="table-container shadow-none" style={{ border: '1px solid var(--color-bg)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contract?.obligations?.length > 0 ? (
                    contract.obligations.map((obl, idx) => (
                      <tr key={idx}>
                        <td>{obl.description}</td>
                        <td>{obl.dueDate}</td>
                        <td><span className={`badge badge-${obl.status === 'Compliant' ? 'success' : 'warning'}`}>{obl.status}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center' }}>No obligations found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex-col gap-6">
          <div className="card">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <h3>Approval Workflow</h3>
            </div>
            <div className="timeline">
              {timeline.map((item) => (
                <div className="timeline-item" key={item.id}>
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-content font-semibold">{item.title}</div>
                  <div className="text-sm text-muted">{item.desc}</div>
                </div>
              ))}
              {contractStatus === 'Under Review' && (
                <div className="timeline-item">
                  <div className="timeline-date">Pending</div>
                  <div className="timeline-content font-semibold text-primary">Final Approval</div>
                  <div className="text-sm text-muted">Awaiting Jane Doe</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-bg)', paddingTop: '1rem' }}>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Type a comment or @mention someone..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button className="btn btn-primary" onClick={handlePostComment}>Post</button>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <h3>Versions & Documents</h3>
              <button className="btn-icon" onClick={() => setIsVersionModalOpen(true)}>
                <Upload size={18} />
              </button>
            </div>
            <div className="flex-col gap-2">
              {versions.map((v) => (
                <div key={v.id} className={`flex justify-between items-center p-4 border border-bg rounded-md ${!v.current ? 'bg-bg-light' : ''}`}>
                  <div className="flex items-center gap-2">
                    {v.current ? <FileSignature size={18} className="text-primary" /> : <FileText size={18} className="text-muted" />}
                    <span className={`font-semibold text-sm ${!v.current ? 'text-muted' : ''}`}>{v.id} {v.current ? '(Current)' : ''}</span>
                  </div>
                  <span className="text-xs text-muted">{v.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Contract Info</h2>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsEditModalOpen(false); }}>
              <div className="input-group">
                <label className="input-label">Company Name</label>
                <input type="text" className="input-field" defaultValue="Global Industries Ltd." />
              </div>
              <div className="input-group">
                <label className="input-label">Vendor Name</label>
                <input type="text" className="input-field" defaultValue="TechCorp Solutions Inc." />
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <input type="text" className="input-field" defaultValue="Vendor Contract" />
              </div>
              <div className="input-group">
                <label className="input-label">Responsible Person (Assignee)</label>
                <input type="text" className="input-field" defaultValue={contract?.responsiblePerson || ''} id="edit-assignee" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={async () => {
                  setIsEditModalOpen(false);
                  try {
                    await createNotification({ title: 'Contract Assigned', message: `Contract ${id} has been assigned/updated.` });
                    window.dispatchEvent(new Event('notification-created'));
                  } catch (err) { console.error(err); }
                }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Version Modal */}
      {isVersionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload New Version</h2>
              <button className="close-btn" onClick={() => setIsVersionModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUploadVersion}>
              <div className="input-group">
                <label className="input-label">Select File (PDF, DOCX)</label>
                <input type="file" className="input-field" required />
              </div>
              <div className="input-group">
                <label className="input-label">Version Notes</label>
                <textarea className="input-field" rows="3" placeholder="What changed in this version?"></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsVersionModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Upload Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetails;
