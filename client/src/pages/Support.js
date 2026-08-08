import React, { useState, useEffect } from 'react';
import PageContainer from '../layout/PageContainer';
import Navbar from '../layout/Navbar';
import { API_BASE_URL } from '../data/constants';

const Support = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const displayName = storedUser?.name || 'Guest User';
  const displayEmail = storedUser?.email || 'guest@company.com';

  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'faq', 'guide', 'video', 'call', 'resource_status', 'resource_api', 'resource_community', null

  const [formData, setFormData] = useState({
    name: displayName,
    email: displayEmail,
    subject: '',
    priority: 'Medium',
    message: ''
  });

  // --- Fetch Live Tickets ---
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/support/tickets`);
      const data = await res.json();
      setTickets(data);
    } catch (e) {
      console.error("Failed to fetch tickets", e);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // --- Handle Live Form Submission ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert("Support ticket submitted successfully! Our team will review it shortly.");
        setFormData({ ...formData, subject: '', message: '', priority: 'Medium' });
        fetchTickets(); // Refresh the table instantly
      }
    } catch (error) {
      console.error("Error submitting ticket", error);
      alert("Failed to submit ticket.");
    }
  };

  // --- Handle Call Request (Raises a Ticket) ---
  const handleCallSubmit = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const topic = e.target.topic.value;
    
    const payload = {
      name: formData.name || displayName,
      email: formData.email || displayEmail,
      subject: `Callback Request: ${topic}`,
      priority: 'High',
      message: `User requested a callback regarding: ${topic}. Contact number: ${phone}`
    };

    try {
      const response = await fetch(`${API_BASE_URL}/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert('Call requested! An agent will dial you shortly. A ticket has been raised for tracking.');
        setActiveModal(null);
        fetchTickets();
      }
    } catch (error) {
      console.error("Error submitting call request", error);
    }
  };

  // --- Scroll to Form ---
  const scrollToContactForm = () => {
    const element = document.getElementById('contact-support-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Realistic Knowledge Base Data ---
  const knowledgeBase = [
    { id: 1, title: 'How to add a new Master Services Agreement (MSA)', desc: 'Learn the step-by-step process to create, upload, and manage new MSAs in the Contract Repository.', tag: 'Contracts', color: '#5f27cd', bg: '#f3e5f5' },
    { id: 2, title: 'Understanding automated compliance tracking', desc: 'Detailed breakdown of how ContractIQ monitors your active obligations and calculates risk levels.', tag: 'Compliance', color: '#f39c12', bg: '#fff8e1' },
    { id: 3, title: 'Configuring custom renewal alerts', desc: 'How to set up 30, 60, or 90-day automated email notifications for upcoming contract expirations.', tag: 'Obligations', color: '#2ecc71', bg: '#e8f5e9' },
    { id: 4, title: 'Managing Role-Based Access Control (RBAC)', desc: 'Admin guide to assigning View-Only, Editor, or Admin permissions to specific departments.', tag: 'Users', color: '#3498db', bg: '#e3f2fd' },
    { id: 5, title: 'Exporting audit-ready compliance reports', desc: 'Generate PDF or CSV reports for internal audits and stakeholder reviews.', tag: 'Reports', color: '#5f27cd', bg: '#f3e5f5' },
  ];

  // --- Live Search Filtering ---
  const filteredArticles = knowledgeBase.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTickets = tickets.filter(tkt => 
    tkt.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tkt.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tkt.id.toString().includes(searchTerm)
  );

  // --- UI Helpers ---
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Open': return { color: '#2ecc71', bg: '#e8f5e9' };
      case 'In Progress': return { color: '#3498db', bg: '#e3f2fd' };
      case 'Resolved': return { color: '#2ecc71', bg: '#e8f5e9' };
      case 'Closed': return { color: '#888', bg: '#f5f5f5' };
      default: return { color: '#555', bg: '#eee' };
    }
  };

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'High': return { color: '#e74c3c', bg: '#feebee' };
      case 'Medium': return { color: '#f39c12', bg: '#fff8e1' };
      case 'Low': return { color: '#2ecc71', bg: '#e8f5e9' };
      default: return { color: '#555', bg: '#eee' };
    }
  };

  // --- Render Modals ---
  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
          
          {activeModal === 'faq' && (
            <>
              <h2 style={{ marginTop: 0, color: '#333' }}>Frequently Asked Questions</h2>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div><strong>Q: How do I reset my password?</strong><p style={{ color: '#666', margin: '5px 0' }}>A: Navigate to the Login screen and click "Forgot Password". A reset link will be sent to your registered company email.</p></div>
                <div><strong>Q: Can I restore a deleted contract?</strong><p style={{ color: '#666', margin: '5px 0' }}>A: Yes. Deleted contracts are kept in the 'Archived' state for 30 days before permanent deletion. Contact an Admin to restore it.</p></div>
                <div><strong>Q: Why is my compliance score dropping?</strong><p style={{ color: '#666', margin: '5px 0' }}>A: Your score decreases when obligations are marked as "At Risk" or "Non-Compliant". Check your Compliance Dashboard for specific flagged items.</p></div>
              </div>
            </>
          )}

          {activeModal === 'guide' && (
            <>
              <h2 style={{ marginTop: 0, color: '#333' }}>Platform User Guide</h2>
              <div style={{ marginTop: '20px' }}>
                <h4>Getting Started with ContractIQ</h4>
                <ol style={{ color: '#666', lineHeight: '1.8' }}>
                  <li>Navigate to the <strong>Contracts</strong> dashboard using the sidebar.</li>
                  <li>Click the purple <strong>+ Add Contract</strong> button at the top right.</li>
                  <li>Fill in the mandatory fields: Party Name, Start/End Dates, and Value.</li>
                  <li>Upload the signed PDF document in the Attachments section.</li>
                  <li>Click Save. The system will automatically parse deadlines and create calendar events.</li>
                </ol>
              </div>
            </>
          )}

          {activeModal === 'video' && (
            <>
              <h2 style={{ marginTop: 0, color: '#333' }}>Video Tutorials</h2>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                  <div style={{ width: '100%', height: '200px', background: '#ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', marginBottom: '10px' }}>
                    ▶️ Video Player Placeholder (Platform Walkthrough)
                  </div>
                  <strong>ContractIQ Complete Platform Walkthrough (15:00)</strong>
                </div>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                  <div style={{ width: '100%', height: '200px', background: '#ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', marginBottom: '10px' }}>
                    ▶️ Video Player Placeholder (Compliance)
                  </div>
                  <strong>Setting up your first Compliance Obligation (05:30)</strong>
                </div>
              </div>
            </>
          )}

          {activeModal === 'call' && (
            <>
              <h2 style={{ marginTop: 0, color: '#333' }}>Request a Support Call</h2>
              <p style={{ color: '#666' }}>Our technical support team is available Monday-Friday, 9 AM - 5 PM EST.</p>
              <form onSubmit={handleCallSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input type="text" name="phone" placeholder="Your Phone Number" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }} />
                <select name="topic" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}>
                  <option value="">Select Topic...</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Billing">Billing / Subscription</option>
                  <option value="Onboarding">Training / Onboarding</option>
                  <option value="Others">Others</option>
                </select>
                <button type="submit" style={{ padding: '10px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📞 Request Callback</button>
              </form>
            </>
          )}

          {/* NEW: Interactive Live Resource Modals */}
          {activeModal === 'resource_status' && (
            <>
              <h2 style={{ marginTop: 0, color: '#333' }}>System Status</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '15px', height: '15px', background: '#2ecc71', borderRadius: '50%', boxShadow: '0 0 10px #2ecc71' }}></div>
                <strong style={{ color: '#2ecc71', fontSize: '18px' }}>All Systems Operational</strong>
              </div>
              <p style={{ color: '#666' }}><strong>Uptime (Last 90 days):</strong> 99.99%</p>
              <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>API Services: <strong style={{ color: '#2ecc71' }}>Operational</strong></li>
                <li>PostgreSQL Database: <strong style={{ color: '#2ecc71' }}>Operational</strong></li>
                <li>Document Storage: <strong style={{ color: '#2ecc71' }}>Operational</strong></li>
                <li>Notifications Pipeline: <strong style={{ color: '#2ecc71' }}>Operational</strong></li>
              </ul>
            </>
          )}

          {activeModal === 'resource_api' && (
            <>
              <h2 style={{ marginTop: 0, color: '#333' }}>API Documentation</h2>
              <p style={{ color: '#666' }}>Integrate ContractIQ directly into your internal tools. Below is a quick start example:</p>
              <div style={{ background: '#282c34', color: '#abb2bf', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', overflowX: 'auto', marginBottom: '15px' }}>
                <code>
                  curl -X GET "https://api.contractiq.com/v1/contracts" \<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                </code>
              </div>
              <p style={{ color: '#666', fontSize: '13px' }}>To generate a production API key, navigate to Settings &gt; Developer &gt; API Keys.</p>
              <button onClick={() => setActiveModal(null)} style={{ padding: '10px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>Read Full Documentation</button>
            </>
          )}

          {activeModal === 'resource_community' && (
            <>
              <h2 style={{ marginTop: 0, color: '#333' }}>Community Forum</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>Welcome to the ContractIQ developer and user community!</p>
              <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '10px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <h4 style={{ margin: '0 0 5px 0', color: '#3498db' }}>Discussion: Best practices for tracking compliance?</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Posted by Sarah J. • 12 replies</p>
              </div>
              <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '10px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <h4 style={{ margin: '0 0 5px 0', color: '#3498db' }}>Feature Request: Bulk export of obligations</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Posted by Guest User • 45 upvotes</p>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ width: '100%', padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#333', marginTop: '10px' }}>Join the Conversation →</button>
            </>
          )}

        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      <Navbar />
      {renderModal()}

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>Help & Support</h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>We're here to help you. Find answers, guides, or contact our support team.</p>
      </div>

      {/* Hero Search Section */}
      <div style={{ background: '#f8f9fc', borderRadius: '16px', padding: '40px', position: 'relative', marginBottom: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ zIndex: 2, maxWidth: '60%' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#333' }}>How can we help you today? 👋</h1>
          <p style={{ margin: '0 0 25px 0', color: '#666', fontSize: '15px' }}>Search for answers, browse tutorials, or contact our support team.</p>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '10px 15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <span style={{ color: '#888', marginRight: '10px', fontSize: '18px' }}>🔍</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for help articles, topics or keywords..." 
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }} 
            />
          </div>
        </div>
        
        {/* Abstract Headphone Graphic Representation */}
        <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div onClick={() => setActiveModal('call')} style={{ background: '#5f27cd', color: 'white', padding: '15px', borderRadius: '12px 12px 0 12px', fontSize: '24px', boxShadow: '0 10px 25px rgba(95,39,205,0.3)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} title="Request a Call">🎧</div>
          <div onClick={scrollToContactForm} style={{ background: '#3498db', color: 'white', padding: '15px', borderRadius: '12px 12px 12px 0', fontSize: '24px', boxShadow: '0 10px 25px rgba(52,152,219,0.3)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} title="Message Support">💬</div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <div style={{ background: '#f3e5f5', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📄</div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>FAQ</h3>
            </div>
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '13px', lineHeight: '1.5' }}>Find quick answers to commonly asked questions.</p>
          </div>
          <span onClick={() => setActiveModal('faq')} style={{ color: '#5f27cd', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>View FAQs →</span>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <div style={{ background: '#e8f5e9', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📖</div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>User Guide</h3>
            </div>
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '13px', lineHeight: '1.5' }}>Step-by-step guides to help you get the most out of ContractIQ.</p>
          </div>
          <span onClick={() => setActiveModal('guide')} style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>Browse Guides →</span>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <div style={{ background: '#fff8e1', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✉️</div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Contact Support</h3>
            </div>
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '13px', lineHeight: '1.5' }}>Still need help? Reach out to our support team.</p>
          </div>
          <span onClick={scrollToContactForm} style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>Contact Us →</span>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <div style={{ background: '#e3f2fd', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>▶️</div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Video Tutorials</h3>
            </div>
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '13px', lineHeight: '1.5' }}>Watch video tutorials and learn how to use ContractIQ effectively.</p>
          </div>
          <span onClick={() => setActiveModal('video')} style={{ color: '#3498db', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>Watch Videos →</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        
        {/* Popular Articles */}
        <div className="card" style={{ flex: 1.2, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Popular Articles</h3>
            {searchTerm && <span style={{ color: '#888', fontSize: '12px' }}>Filtered Results</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredArticles.map((article, idx) => (
              <div key={article.id} onClick={() => setActiveModal('guide')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '15px 0', borderBottom: idx !== filteredArticles.length - 1 ? '1px solid #f1f1f1' : 'none', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span style={{ color: '#5f27cd', fontSize: '18px', marginTop: '2px' }}>📄</span>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#333', marginBottom: '4px' }}>{article.title}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{article.desc}</div>
                  </div>
                </div>
                <span style={{ background: article.bg, color: article.color, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '15px' }}>
                  {article.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div id="contact-support-form" className="card" style={{ flex: 1, padding: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#333' }}>Contact Support</h3>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#555', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Full Name</label>
                {/* NEW: Removed readOnly so you can type */}
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', background: '#fff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#555', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Subject</label>
                <select name="subject" value={formData.subject} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}>
                  <option value="" disabled>Select a subject</option>
                  <option value="Bug">Report a Bug</option>
                  <option value="Feature">Feature Request</option>
                  <option value="Billing">Billing Issue</option>
                  <option value="Other">Other Inquiry</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#555', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Email Address</label>
                {/* NEW: Removed readOnly so you can type */}
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', background: '#fff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#555', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#555', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Message</label>
              <textarea name="message" value={formData.message} onChange={handleInputChange} required placeholder="Describe your issue in detail..." rows="4" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', resize: 'none' }}></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ padding: '10px 24px', background: '#5f27cd', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🚀</span> Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* Support Tickets Table */}
        <div className="card" style={{ flex: 1.5, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Support Tickets</h3>
            {searchTerm && <span style={{ color: '#888', fontSize: '12px' }}>Filtered Results</span>}
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '12px 0', fontSize: '12px', color: '#888', fontWeight: '600' }}>Ticket ID</th>
                <th style={{ padding: '12px 0', fontSize: '12px', color: '#888', fontWeight: '600' }}>Subject</th>
                <th style={{ padding: '12px 0', fontSize: '12px', color: '#888', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 0', fontSize: '12px', color: '#888', fontWeight: '600' }}>Priority</th>
                <th style={{ padding: '12px 0', fontSize: '12px', color: '#888', fontWeight: '600', textAlign: 'right' }}>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((tkt) => {
                const sStyle = getStatusStyle(tkt.status);
                const pStyle = getPriorityStyle(tkt.priority);
                
                return (
                  <tr key={tkt.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '12px 0', fontSize: '13px', color: '#333', fontWeight: '600' }}>#TKT-{tkt.id + 1200}</td>
                    <td style={{ padding: '12px 0', fontSize: '13px', color: '#555' }}>{tkt.subject}</td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{ background: sStyle.bg, color: sStyle.color, padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{tkt.status}</span>
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{ background: pStyle.bg, color: pStyle.color, padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{tkt.priority}</span>
                    </td>
                    <td style={{ padding: '12px 0', fontSize: '12px', color: '#666', textAlign: 'right' }}>{tkt.updated_on}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resources List */}
        <div className="card" style={{ flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Live Resources</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div onClick={() => setActiveModal('resource_status')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ background: '#e8f5e9', color: '#2ecc71', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✓</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>System Status</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>All systems operational</div>
                </div>
              </div>
              <div style={{ width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%' }}></div>
            </div>

            <div onClick={() => setActiveModal('resource_api')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ background: '#f3e5f5', color: '#5f27cd', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📄</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>API Documentation</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Integrate with ContractIQ APIs</div>
                </div>
              </div>
              <span style={{ color: '#ccc', fontWeight: 'bold' }}>{'>'}</span>
            </div>

            <div onClick={() => setActiveModal('resource_community')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ background: '#e3f2fd', color: '#3498db', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👥</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>Community Forum</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Connect and discuss with other users</div>
                </div>
              </div>
              <span style={{ color: '#ccc', fontWeight: 'bold' }}>{'>'}</span>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default Support;