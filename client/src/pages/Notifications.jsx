import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([
    { id: 1, type: 'danger', icon: 'fa-triangle-exclamation', title: 'Action Required: MSA Expiring', text: 'TechFlow Inc MSA is expiring in 15 days.', time: '2 hours ago', read: false, details: 'Please review the TechFlow Inc MSA and contact the vendor regarding renewal terms before the expiration date to avoid service disruption.' },
    { id: 2, type: 'success', icon: 'fa-check-circle', title: 'Obligation Met', text: 'Quarterly compliance audit completed.', time: '5 hours ago', read: false, details: 'The compliance audit for Q2 has been successfully completed and signed off by the auditor.' },
    { id: 3, type: 'primary', icon: 'fa-file-signature', title: 'New Contract Uploaded', text: 'Jane Doe uploaded "Acme Corp NDA".', time: '1 day ago', read: true, details: 'Acme Corp NDA was uploaded and is pending your signature.' },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Notifications</h1>
        <button onClick={markAllRead} className="premium-button" style={{ width: 'auto', padding: '8px 16px', margin: 0, backgroundColor: 'white', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', boxShadow: 'none' }}>
          Mark all as read
        </button>
      </div>
      
      <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
        {notifs.map((n, idx) => (
          <div key={n.id} style={{ borderBottom: idx !== notifs.length - 1 ? '1px solid #e5e7eb' : 'none', transition: 'background-color 0.2s', backgroundColor: n.read ? 'transparent' : 'rgba(30, 58, 138, 0.03)' }}>
            <div 
              style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }} 
              onClick={() => toggleExpand(n.id)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'} 
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '16px', backgroundColor: n.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : n.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 58, 138, 0.1)', color: n.type === 'danger' ? 'var(--danger-color)' : n.type === 'success' ? 'var(--success-color)' : 'var(--primary-color)' }}>
                <i className={`fa-solid ${n.icon}`}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.read ? 500 : 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{n.title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{n.text}</div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                {n.time}
                <i className={`fa-solid fa-chevron-${expandedId === n.id ? 'up' : 'down'}`} style={{ marginLeft: '12px', color: '#9ca3af' }}></i>
              </div>
            </div>
            
            {expandedId === n.id && (
              <div style={{ padding: '0 24px 20px 80px', animation: 'slideUp 0.3s ease-out' }}>
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '14px', color: 'var(--text-secondary)', border: '1px solid #e5e7eb' }}>
                  <p style={{ margin: '0 0 12px 0' }}>{n.details}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="premium-button" style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', margin: 0 }} onClick={(e) => { e.stopPropagation(); navigate(n.type === 'danger' ? '/contracts' : '/dashboard'); }}>
                      Take Action
                    </button>
                    <button className="premium-button" style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', margin: 0, backgroundColor: 'white', color: 'var(--text-secondary)', border: '1px solid #d1d5db', boxShadow: 'none' }} onClick={(e) => { e.stopPropagation(); toggleExpand(n.id); }}>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
