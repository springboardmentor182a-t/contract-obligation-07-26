import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';
import Navbar from '../layout/Navbar';
import { API_BASE_URL } from '../data/constants';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filter States ---
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterPriority, setFilterPriority] = useState('All Priorities');

  // --- Interactive Modals & Dropdowns ---
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  // --- Interactive Preferences State ---
  const [prefs, setPrefs] = useState({
    email: true,
    inApp: true,
    push: false,
    weekly: true
  });

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`);
      const data = await res.json();
      setNotifications(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Close the action menu if the user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = () => setActionMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // --- API Handlers ---
  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/notifications/read`, { method: 'PUT' });
      setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  // --- Smart Routing ---
  // Routes the user to the correct dashboard to fix the issue based on the ID prefix
  const handleResolveIssue = (id) => {
    if (id.startsWith('con_')) navigate('/contracts');
    else if (id.startsWith('comp_')) navigate('/compliance');
    else navigate('/documents');
  };

  const togglePref = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  const clearFilters = () => { setSearchTerm(''); setFilterType('All Types'); setFilterPriority('All Priorities'); };

  // --- Dynamic Live KPIs ---
  const allCount = notifications.length;
  const unreadCount = notifications.filter(n => n.isUnread).length;
  const mentionsCount = notifications.filter(n => n.type === 'Mentions').length;
  const alertsCount = notifications.filter(n => n.type === 'Alerts').length;
  const systemCount = notifications.filter(n => n.type === 'System').length;
  const othersCount = allCount - (alertsCount + mentionsCount + systemCount);

  const tabs = [
    { name: 'All', count: allCount },
    { name: 'Unread', count: unreadCount },
    { name: 'Mentions', count: mentionsCount },
    { name: 'Alerts', count: alertsCount },
    { name: 'System', count: systemCount },
  ];

  const dropdownTypes = ["All Types", ...new Set(notifications.map(n => n.type))];
  const dropdownPriorities = ["All Priorities", ...new Set(notifications.map(n => n.priority))];

  // --- Live Frontend Filtering ---
  const filteredData = notifications.filter(n => {
    if (activeTab === 'Unread' && !n.isUnread) return false;
    if (activeTab === 'Mentions' && n.type !== 'Mentions') return false;
    if (activeTab === 'Alerts' && n.type !== 'Alerts') return false;
    if (activeTab === 'System' && n.type !== 'System') return false;
    
    if (searchTerm && !n.title.toLowerCase().includes(searchTerm.toLowerCase()) && !n.desc.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterType !== 'All Types' && n.type !== filterType) return false;
    if (filterPriority !== 'All Priorities' && n.priority !== filterPriority) return false;
    
    return true;
  });

  const PrefToggle = ({ label, propKey }) => (
    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'center' }}>
      <span>{label}</span> 
      <span 
        onClick={() => togglePref(propKey)}
        style={{ color: prefs[propKey] ? '#2ecc71' : '#888', background: prefs[propKey] ? '#e8f5e9' : '#f5f5f5', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', transition: '0.2s', userSelect: 'none' }}>
        {prefs[propKey] ? 'On' : 'Off'}
      </span>
    </li>
  );

  if (loading) return (<PageContainer><Navbar /><div style={{ padding: '20px' }}>Loading Live Notifications...</div></PageContainer>);

  return (
    <PageContainer>
      <Navbar />

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>Notifications</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Stay updated with important alerts and activities.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleMarkAllAsRead} style={{ padding: '8px 16px', background: 'white', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ✓ Mark all as read
          </button>
          <button onClick={() => navigate('/settings')} style={{ padding: '8px 16px', background: 'white', color: '#5f27cd', border: '1px solid #5f27cd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ⚙ Notification Settings
          </button>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #eee', marginBottom: '20px', paddingBottom: '10px' }}>
        {tabs.map((tab) => (
          <div 
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            style={{ cursor: 'pointer', fontWeight: activeTab === tab.name ? 'bold' : '500', color: activeTab === tab.name ? '#5f27cd' : '#666', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {tab.name}
            <span style={{ background: activeTab === tab.name ? '#f3e5f5' : '#f0f0f0', color: activeTab === tab.name ? '#5f27cd' : '#888', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
              {tab.count}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left Side: Main Content */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Filters Bar */}
          <div className="card" style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', flex: 1 }}>
              <span style={{ color: '#888', marginRight: '8px' }}>🔍</span>
              <input type="text" placeholder="Search notifications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Type</span>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ border: 'none', fontWeight: '500', outline: 'none', background: 'transparent' }}>
                {dropdownTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Priority</span>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ border: 'none', fontWeight: '500', outline: 'none', background: 'transparent' }}>
                {dropdownPriorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button onClick={clearFilters} style={{ border: 'none', background: 'transparent', color: '#5f27cd', fontWeight: 'bold', cursor: 'pointer' }}>Clear</button>
          </div>

          <div className="card" style={{ padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                  <th style={{ padding: '12px 15px', width: '30px' }}><input type="checkbox" /></th>
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555' }}>Notification</th>
                  <th style={{ padding: '12px 15px', width: '100px' }}></th> 
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555', textAlign: 'right' }}>Time ↑↓</th>
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555', textAlign: 'center', width: '60px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                   <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No notifications found matching your criteria.</td></tr>
                ) : filteredData.map((row) => (
                  <tr key={row.id} 
                      onClick={() => setSelectedNotif(row)} // Click row to view details
                      style={{ borderBottom: '1px solid #f1f1f1', background: row.isUnread ? '#fdfdff' : 'transparent', transition: '0.2s', cursor: 'pointer' }} 
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'} 
                      onMouseLeave={(e) => e.currentTarget.style.background = row.isUnread ? '#fdfdff' : 'transparent'}
                  >
                    <td style={{ padding: '15px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" />
                        {row.isUnread ? <div style={{ width: '8px', height: '8px', background: '#5f27cd', borderRadius: '50%' }}></div> : <div style={{ width: '8px', height: '8px' }}></div>}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: row.iconBg, width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                          {row.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: row.isUnread ? 'bold' : '600', fontSize: '14px', color: '#333', marginBottom: '4px' }}>{row.title}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{row.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <span style={{ background: row.priorityBg, color: row.priorityColor, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {row.priority}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '12px', color: '#666', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.time}</td>
                    
                    {/* --- Interactive Action Menu --- */}
                    <td style={{ padding: '15px', position: 'relative', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <span 
                        style={{ color: '#888', cursor: 'pointer', padding: '5px 10px', fontSize: '18px' }} 
                        onClick={() => setActionMenuId(actionMenuId === row.id ? null : row.id)}
                      >
                        •••
                      </span>
                      {actionMenuId === row.id && (
                        <div style={{ position: 'absolute', right: '40px', top: '30px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '6px', zIndex: 100, width: '160px', textAlign: 'left', overflow: 'hidden', border: '1px solid #eee' }}>
                          <div style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '13px', color: '#333' }} onClick={() => { setSelectedNotif(row); setActionMenuId(null); }}>👁️ View Details</div>
                          <div style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '13px', color: '#333' }} onClick={() => { handleResolveIssue(row.id); setActionMenuId(null); }}>🚀 Resolve Issue</div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Widgets */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#5f27cd' }}>🔔</span> Notification Summary</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#333' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{color: '#5f27cd'}}>📫</span> All Notifications</span> <strong>{allCount}</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{color: '#9b59b6'}}>🛡️</span> Unread</span> <strong>{unreadCount}</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{color: '#e74c3c'}}>⚠️</span> Alerts</span> <strong>{alertsCount}</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{color: '#3498db'}}>👥</span> Mentions</span> <strong>{mentionsCount}</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{color: '#e67e22'}}>⚙️</span> System</span> <strong>{systemCount}</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}><span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888' }}>••• Others</span> <strong>{othersCount}</strong></li>
            </ul>
            <button onClick={() => { setActiveTab('All'); window.scrollTo(0,0); }} style={{ width: '100%', marginTop: '15px', padding: '10px', background: 'white', color: '#5f27cd', border: '1px solid #5f27cd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>View all notifications</button>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#5f27cd' }}>⚙️</span> Preferences</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#333' }}>
              <PrefToggle label="Email Notifications" propKey="email" />
              <PrefToggle label="In-App Notifications" propKey="inApp" />
              <PrefToggle label="Push Notifications" propKey="push" />
              <PrefToggle label="Weekly Digest" propKey="weekly" />
            </ul>
            <button onClick={() => navigate('/settings')} style={{ width: '100%', marginTop: '15px', padding: '10px', background: 'white', color: '#5f27cd', border: '1px solid #5f27cd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Manage Preferences</button>
          </div>
        </div>
      </div>

      {/* --- Notification Details Modal --- */}
      {selectedNotif && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '500px', padding: '30px', background: 'white', position: 'relative' }}>
                <button onClick={() => setSelectedNotif(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✖</button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ background: selectedNotif.iconBg, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        {selectedNotif.icon}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{selectedNotif.title}</h3>
                        <span style={{ background: selectedNotif.priorityBg, color: selectedNotif.priorityColor, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{selectedNotif.priority} Priority</span>
                    </div>
                </div>

                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '20px' }}>
                    <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>{selectedNotif.desc}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>Received: {selectedNotif.time}</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setSelectedNotif(null)} style={{ padding: '8px 16px', background: 'white', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
                        <button onClick={() => handleResolveIssue(selectedNotif.id)} style={{ padding: '8px 16px', background: '#5f27cd', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Go to Dashboard →</button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </PageContainer>
  );
};

export default Notifications;