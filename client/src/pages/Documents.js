import React, { useState, useEffect } from 'react';
import PageContainer from '../layout/PageContainer';
import Navbar from '../layout/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Documents = () => {
  const [tableData, setTableData] = useState([]);
  const [kpis, setKpis] = useState({ 
    totalDocuments: 0, totalFolders: 0, storageUsedGB: 0, storageMaxGB: 20, storagePercent: 0, recentlyAdded: 0, expiringSoon: 0 
  });
  const [loading, setLoading] = useState(true);

  // Live Sync States
  const [liveContracts, setLiveContracts] = useState([]);
  const [liveUsers, setLiveUsers] = useState([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterContract, setFilterContract] = useState("All Contracts");
  const [filterUploader, setFilterUploader] = useState("All Users");

  // Navigation & Modal States
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  
  // Form States
  const [newDocName, setNewDocName] = useState("");
  const [newDocSize, setNewDocSize] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadFolderSelection, setUploadFolderSelection] = useState("current"); 
  const [uploadNewFolderName, setUploadNewFolderName] = useState("");
  const [selectedContractId, setSelectedContractId] = useState("-");

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userName = storedUser?.name || 'Guest User';

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/documents');
      const data = await response.json();
      setTableData(data.documents);
      setKpis(data.kpi);
      
      setLiveContracts(data.contracts || []);
      setLiveUsers(data.users || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    let finalParentId = currentFolderId;

    if (uploadFolderSelection === "new") {
        const folderRes = await fetch('http://localhost:8000/api/v1/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_folder: true, name: uploadNewFolderName, type: "Folder", size: "-", uploader: userName, parent_id: currentFolderId })
        });
        const folderData = await folderRes.json();
        finalParentId = folderData.id;
    } else if (uploadFolderSelection !== "current") {
        finalParentId = uploadFolderSelection === "root" ? null : parseInt(uploadFolderSelection);
    }

    let cName = "";
    if(selectedContractId !== "-") {
        const found = liveContracts.find(c => c.contractId === selectedContractId);
        if(found) cName = found.name;
    }

    await fetch('http://localhost:8000/api/v1/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          is_folder: false, name: newDocName, type: "PDF", size: newDocSize, 
          uploader: userName, parent_id: finalParentId,
          contract_id: selectedContractId, contract_name: cName
      })
    });
    
    setShowUploadModal(false);
    setNewDocName(""); setNewDocSize(""); setUploadNewFolderName(""); setUploadFolderSelection("current"); setSelectedContractId("-");
    fetchDocuments(); 
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8000/api/v1/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_folder: true, name: newFolderName, type: "Folder", size: "-", uploader: userName, parent_id: currentFolderId })
    });
    setShowFolderModal(false);
    setNewFolderName("");
    fetchDocuments(); 
  };

  const clearFilters = () => {
    setSearchTerm(""); setFilterType("All Types"); setFilterContract("All Contracts"); setFilterUploader("All Users");
  };

  const allFolders = tableData.filter(d => d.isFolder);
  const dropdownTypes = ["All Types", ...new Set(tableData.filter(d => !d.isFolder).map(d => d.type))];
  
  const existingDocContracts = tableData.map(d => d.contractId).filter(c => c && c !== "-");
  const dropdownContracts = ["All Contracts", ...new Set([...existingDocContracts, ...liveContracts.map(c => c.contractId)])];
  const dropdownUsers = ["All Users", ...liveUsers];

  const filteredData = tableData.filter(row => {
    if ((row.parentId || null) !== currentFolderId) return false;
    if (searchTerm && !row.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterType !== "All Types" && row.type !== filterType) return false;
    if (filterContract !== "All Contracts" && row.contractId !== filterContract) return false;
    if (filterUploader !== "All Users" && row.uploader !== filterUploader) return false;
    return true;
  });

  const currentFolderObj = currentFolderId ? tableData.find(d => d.id === currentFolderId) : null;
  const storageData = [{ name: 'Used', value: kpis.storageUsedGB, color: '#5f27cd' }, { name: 'Available', value: kpis.storageMaxGB - kpis.storageUsedGB, color: '#e0e0e0' }];

  if (loading) return (<PageContainer><Navbar /><div style={{ padding: '20px' }}>Loading Documents Dashboard...</div></PageContainer>);

  return (
    <PageContainer>
      <Navbar />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>Documents</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Store, manage and access all contract related documents.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowUploadModal(true)} style={{ padding: '8px 16px', background: 'white', color: '#5f27cd', border: '1px solid #5f27cd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            ↑ Upload Document
          </button>
          <button onClick={() => setShowFolderModal(true)} style={{ padding: '8px 16px', background: '#5f27cd', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            + New Folder
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div className="card" style={{ flex: 1, padding: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}><div style={{ background: '#f3e5f5', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>📄</div><span style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>Total Documents</span></div>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{kpis.totalDocuments}</h2><span style={{ color: '#2ecc71', fontSize: '12px', fontWeight: 'bold' }}>↑ Live Data</span>
        </div>
        <div className="card" style={{ flex: 1, padding: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}><div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>📁</div><span style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>Total Folders</span></div>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{kpis.totalFolders}</h2><span style={{ color: '#2ecc71', fontSize: '12px', fontWeight: 'bold' }}>↑ Live Data</span>
        </div>
        <div className="card" style={{ flex: 1, padding: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}><div style={{ background: '#e8f5e9', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>⏱️</div><span style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>Storage Used</span></div>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{kpis.storageUsedGB} GB</h2>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>of {kpis.storageMaxGB} GB ({kpis.storagePercent}%)</div>
          <div style={{ height: '4px', background: '#eee', borderRadius: '2px', width: '100%' }}><div style={{ height: '100%', width: `${kpis.storagePercent}%`, background: '#2ecc71', borderRadius: '2px' }}></div></div>
        </div>
        <div className="card" style={{ flex: 1, padding: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}><div style={{ background: '#fff8e1', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>🎁</div><span style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>Recently Added</span></div>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{kpis.recentlyAdded}</h2><span style={{ color: '#2ecc71', fontSize: '12px', fontWeight: 'bold' }}>Past 7 days</span>
        </div>
        <div className="card" style={{ flex: 1, padding: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}><div style={{ background: '#ffebee', padding: '10px', borderRadius: '8px', fontSize: '18px' }}>⚠️</div><span style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>Expiring Soon</span></div>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{kpis.expiringSoon}</h2><span style={{ color: '#5f27cd', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Tied to active alerts</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left Side: Table Area */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div className="card" style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', flex: 1 }}>
              <span style={{ color: '#888', marginRight: '8px' }}>🔍</span>
              <input type="text" placeholder="Search documents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Type</span>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ border: 'none', fontWeight: '500', outline: 'none', background: 'transparent' }}>
                {dropdownTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Contract</span>
              <select value={filterContract} onChange={(e) => setFilterContract(e.target.value)} style={{ border: 'none', fontWeight: '500', outline: 'none', background: 'transparent', maxWidth: '120px' }}>
                {dropdownContracts.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Uploaded By</span>
              <select value={filterUploader} onChange={(e) => setFilterUploader(e.target.value)} style={{ border: 'none', fontWeight: '500', outline: 'none', background: 'transparent' }}>
                {dropdownUsers.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <button onClick={clearFilters} style={{ border: 'none', background: 'transparent', color: '#5f27cd', fontWeight: 'bold', cursor: 'pointer' }}>Clear</button>
          </div>

          <div className="card" style={{ padding: '0' }}>
            {currentFolderObj && (
                <div style={{ padding: '15px 15px 0 15px', display: 'flex', alignItems: 'center' }}>
                    <span onClick={() => setCurrentFolderId(currentFolderObj.parentId || null)} style={{ cursor: 'pointer', color: '#5f27cd', fontWeight: 'bold' }}>
                        ← Back
                    </span>
                    <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
                        Currently inside: <strong>{currentFolderObj.name}</strong>
                    </span>
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: currentFolderObj ? '10px' : '0' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555' }}>Name</th>
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555' }}>Type</th>
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555' }}>Contract</th>
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555' }}>Uploaded By</th>
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555' }}>Date</th>
                  <th style={{ padding: '12px 15px', fontSize: '13px', color: '#555' }}>Size</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No items found.</td></tr>
                ) : filteredData.map((row) => (
                  <tr key={row.id} 
                      onClick={() => row.isFolder ? setCurrentFolderId(row.id) : setViewDoc(row)} 
                      style={{ borderBottom: '1px solid #f1f1f1', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '12px 15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{row.isFolder ? '📁' : '📄'}</span>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '13px', color: '#5f27cd' }}>{row.name}</div>
                          <div style={{ fontSize: '11px', color: '#888' }}>{row.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 15px' }}>
                      <span style={{ color: row.typeColor || '#333', fontWeight: 'bold', fontSize: '12px', background: row.isFolder ? '#f3e5f5' : 'transparent', padding: row.isFolder ? '2px 8px' : '0', borderRadius: '4px' }}>
                        {row.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 15px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{row.contractId}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{row.contractName}</div>
                    </td>
                    <td style={{ padding: '12px 15px', fontSize: '12px', fontWeight: '500' }}>{row.uploader}</td>
                    <td style={{ padding: '12px 15px', fontSize: '12px' }}>{row.date}</td>
                    <td style={{ padding: '12px 15px', fontSize: '12px' }}>{row.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Storage Overview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', fontSize: '14px' }}>Storage Overview</h4>
            <div style={{ height: '160px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={storageData} innerRadius={50} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                    {storageData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{kpis.storageUsedGB} GB</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Used</div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5f27cd' }}></span> Used</span>
                <span style={{ color: '#555' }}>{kpis.storageUsedGB} GB ({kpis.storagePercent}%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e0e0e0' }}></span> Available</span>
                <span style={{ color: '#555' }}>{(kpis.storageMaxGB - kpis.storageUsedGB).toFixed(2)} GB ({100 - kpis.storagePercent}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Document Viewer Modal */}
      {viewDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '600px', padding: '20px', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{viewDoc.name}</h3>
                    <button onClick={() => setViewDoc(null)} style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }}>✖</button>
                </div>
                <div style={{ background: '#f8f9fa', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px dashed #ccc' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
                    <p style={{ color: '#555', marginBottom: '5px' }}>Document preview rendering is limited in this environment.</p>
                    <p style={{ fontSize: '12px', color: '#888' }}>Size: {viewDoc.size} | Uploaded by: {viewDoc.uploader} | {viewDoc.date}</p>
                    <button onClick={() => setViewDoc(null)} style={{ marginTop: '20px', padding: '10px 20px', background: '#5f27cd', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Close Viewer
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Advanced Upload Modal (Supports Contract Linking & Folder Creation) */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '450px', padding: '25px' }}>
            <h3 style={{ marginBottom: '15px' }}>Upload New Document</h3>
            <form onSubmit={handleUploadDocument}>
              
              <label style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Destination Folder</label>
              <select value={uploadFolderSelection} onChange={(e) => setUploadFolderSelection(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}>
                <option value="current">Current Directory {currentFolderObj ? `(${currentFolderObj.name})` : '(Root)'}</option>
                <option value="root">Root Directory</option>
                {allFolders.map(f => <option key={f.id} value={f.id}>Folder: {f.name}</option>)}
                <option value="new" style={{ fontWeight: 'bold', color: '#5f27cd' }}>+ Create New Folder...</option>
              </select>

              {uploadFolderSelection === "new" && (
                  <input type="text" placeholder="Enter new folder name..." required value={uploadNewFolderName} onChange={(e) => setUploadNewFolderName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #5f27cd', outline: 'none', background: '#f8f9fa' }} />
              )}

              <label style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>Link to Contract (Optional)</label>
              <select value={selectedContractId} onChange={(e) => setSelectedContractId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}>
                <option value="-">None / General File</option>
                {liveContracts.map(c => (
                    <option key={c.contractId} value={c.contractId}>{c.contractId} - {c.name}</option>
                ))}
              </select>

              <label style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>File Details</label>
              <input type="text" placeholder="Document Name (e.g. Agreement.pdf)" required value={newDocName} onChange={(e) => setNewDocName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }} />
              <input type="text" placeholder="File Size (e.g. 2.5 MB)" required value={newDocSize} onChange={(e) => setNewDocSize(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: '10px 20px', border: 'none', background: '#eee', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', border: 'none', background: '#5f27cd', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Upload Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standard Folder Creation Modal */}
      {showFolderModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', padding: '20px' }}>
            <h3>Create New Folder</h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>This folder will be created in {currentFolderObj ? `'${currentFolderObj.name}'` : 'the root directory'}.</p>
            <form onSubmit={handleCreateFolder}>
              <input type="text" placeholder="Folder Name" required value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowFolderModal(false)} style={{ padding: '10px 20px', border: 'none', background: '#eee', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', border: 'none', background: '#5f27cd', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Create Folder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Documents;