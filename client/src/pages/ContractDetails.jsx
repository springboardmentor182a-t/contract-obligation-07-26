import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import ContractInfoCard from '../features/ai-analysis/components/ContractInfoCard.jsx';
import AIAnalysisDashboard from '../features/ai-analysis/components/AIAnalysisDashboard.jsx';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const ContractDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [contract, setContract] = useState(location.state?.contract || null);

  useEffect(() => {
    if (!contract) {
      axios.get(`${API_BASE}/api/contracts`)
        .then(res => {
          const list = Array.isArray(res.data) ? res.data : (res.data?.contracts || []);
          const found = list.find(c => c.id === id || c.contract_id === id) || list[0];
          setContract(found || {
            contract_id: 'CTR-8941',
            vendor: 'Acme Enterprise Solutions',
            title: 'Master Cloud & Professional Services Agreement',
            value: 350000.0,
            term_months: 24,
            status: 'Active',
            vendor_risk: 6.8,
            compliance_flags: 2,
            uncapped: true,
            text: `1. INDEMNIFICATION: The Vendor shall hold unlimited liability for any claims.
2. TERMINATION: The Company may terminate immediately at its sole discretion without prior notice.
3. DISPUTE RESOLUTION: Disputes shall be submitted to offshore arbitration in non-standard jurisdiction.
4. RENEWAL: This Agreement shall auto-renew automatically for successive 3-year terms with accelerated liquidated damages.`
          });
        })
        .catch(() => {
          setContract({
            contract_id: 'CTR-8941',
            vendor: 'Acme Enterprise Solutions',
            title: 'Master Cloud & Professional Services Agreement',
            value: 350000.0,
            term_months: 24,
            status: 'Active',
            vendor_risk: 6.8,
            compliance_flags: 2,
            uncapped: true
          });
        });
    }
  }, [id, contract]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Contracts
        </button>
      </div>

      <ContractInfoCard contract={contract} />
      <AIAnalysisDashboard contract={contract} />
    </div>
  );
};

export default ContractDetails;
