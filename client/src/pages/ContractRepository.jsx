import React, { useState } from 'react';
import Modal from '../components/Modals/Modal';
import { jsPDF } from 'jspdf';
import { useContracts } from '../hooks/useContracts';
import axios from 'axios';

const ContractRepository = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { data: contracts, setData: setContracts } = useContracts('/api/contracts/');
  const [viewContract, setViewContract] = useState(null);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = String(contract.vendor || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(contract.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(contract.owner || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || contract.status === statusFilter;
    const matchesType = typeFilter === '' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDownload = (contract) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text(`Contract: ${contract.id}`, 20, 20);
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    
    doc.text(`Vendor: ${contract.vendor}`, 20, 40);
    doc.text(`Type: ${contract.type}`, 20, 50);
    doc.text(`Value: ${contract.value}`, 20, 60);
    doc.text(`Owner: ${contract.owner}`, 20, 70);
    doc.text(`Status: ${contract.status}`, 20, 80);
    
    doc.save(`${contract.id}.pdf`);
  };

  const handleAddContract = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ownerName = localStorage.getItem('userName') || 'Admin User';
    const newContract = {
      id: formData.get('id'),
      vendor: formData.get('vendor'),
      type: formData.get('type'),
      value: formData.get('value'),
      status: 'Pending',
      owner: ownerName
    };
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/contracts/', newContract, { headers });
      if (res.status === 200 || res.status === 201) {
        setContracts(prev => [...prev, res.data]);
        setIsModalOpen(false);
      }
    } catch(err) { console.error(err); }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      if (lines.length < 2) return alert('File is empty or invalid format.');
      
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const ownerName = localStorage.getItem('userName') || 'Admin User';
      
      const newContracts = [];
      
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(val => val.trim());
        if (row.length !== headers.length) continue;
        
        const contract = { owner: ownerName, status: 'Pending' };
        headers.forEach((header, index) => {
          if (header === 'id' || header === 'vendor' || header === 'type' || header === 'value' || header === 'status') {
            contract[header] = row[index];
          }
        });
        
        if (!contract.id || !contract.vendor) continue;
        newContracts.push(contract);
      }
      
      let addedContracts = [];
      for (const contract of newContracts) {
        try {
          const token = localStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await axios.post('/api/contracts/', contract, { headers });
          if (res.status === 200 || res.status === 201) {
            addedContracts.push(res.data);
          }
        } catch(err) { console.error('Error uploading contract', contract.id, err); }
      }
      
      setContracts(prev => [...prev, ...addedContracts]);
      alert(`Successfully uploaded ${addedContracts.length} contracts!`);
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
            Contract Repository
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
            Manage, search, and upload all your corporate contracts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleBulkUpload}
          />
          <button 
            className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-[#161F2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2A364F] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="fa-solid fa-file-csv text-blue-600 dark:text-blue-400"></i>
            <span>Upload CSV</span>
          </button>
          <button 
            className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add New Contract</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="flex-1 w-full relative">
          <i className="fa-solid fa-search absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500 text-sm"></i>
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Search by vendor, ID, or owner..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="w-full md:w-44 px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-[#2A364F] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
          </select>
          <select 
            className="w-full md:w-44 px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-[#2A364F] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="NDA">NDA</option>
            <option value="MSA">MSA</option>
            <option value="SLA">SLA</option>
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0B1121]/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8E9BAE] border-b border-slate-200 dark:border-[#2A364F]">
              <tr>
                <th className="px-6 py-4">Contract ID</th>
                <th className="px-6 py-4">Counterparty</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2A364F]/60">
              {filteredContracts.map((contract, index) => {
                const isCompliant = ['active', 'approved', 'completed'].includes(String(contract.status || '').toLowerCase());
                const isPending = ['pending', 'in review'].includes(String(contract.status || '').toLowerCase());

                const badgeClass = isCompliant
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                  : isPending
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';

                return (
                  <tr key={index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{contract.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{contract.vendor}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{contract.type}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{contract.value}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{contract.owner}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button 
                          onClick={() => setViewContract(contract)} 
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
                          title="View Details"
                        >
                          <i className="fa-solid fa-eye text-sm"></i>
                        </button>
                        <button 
                          onClick={() => handleDownload(contract)} 
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
                          title="Download PDF"
                        >
                          <i className="fa-solid fa-download text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    No contracts found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contract Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload New Contract">
        <form onSubmit={handleAddContract} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Contract ID</label>
            <input 
              type="text" 
              name="id" 
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g. CTR-2026-006" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Counterparty / Vendor Name</label>
            <input 
              type="text" 
              name="vendor" 
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g. Acme Corp" 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Contract Type</label>
              <select 
                name="type" 
                className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required
              >
                <option value="NDA">NDA</option>
                <option value="MSA">MSA</option>
                <option value="SLA">SLA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Contract Value</label>
              <input 
                type="text" 
                name="value" 
                className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="$0.00" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Upload File (PDF)</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-[#2A364F] rounded-xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-[#0B1121]/50 hover:bg-slate-100 dark:hover:bg-[#0B1121] transition-colors">
              <i className="fa-solid fa-cloud-arrow-up text-2xl text-blue-600 dark:text-blue-400 mb-2"></i>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Click to upload or drag and drop</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF, DOCX up to 10MB</div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-[#161F2E] border border-slate-300 dark:border-[#2A364F] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              Save Contract
            </button>
          </div>
        </form>
      </Modal>

      {/* View Contract Modal */}
      {viewContract && (
        <Modal isOpen={true} onClose={() => setViewContract(null)} title="Contract Details">
          <div className="space-y-3 py-2 text-sm text-slate-700 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-100 dark:border-[#2A364F] pb-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Contract ID</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{viewContract.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-[#2A364F] pb-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Vendor</span>
              <span className="font-medium text-slate-900 dark:text-white">{viewContract.vendor}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-[#2A364F] pb-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Type</span>
              <span className="font-medium text-slate-900 dark:text-white">{viewContract.type}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-[#2A364F] pb-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Value</span>
              <span className="font-medium text-slate-900 dark:text-white">{viewContract.value}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-[#2A364F] pb-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Owner</span>
              <span className="font-medium text-slate-900 dark:text-white">{viewContract.owner}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{viewContract.status}</span>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-[#2A364F] mt-4">
            <button 
              onClick={() => setViewContract(null)} 
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContractRepository;
