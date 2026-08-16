import React, { useState, useEffect } from 'react';

const TaxEstimators = () => {
  const [contractValue, setContractValue] = useState(100000);
  const [taxRate, setTaxRate] = useState(15);
  const [withholdingRate, setWithholdingRate] = useState(5);

  useEffect(() => {
    fetch('/api/tax-estimators')
      .then(res => res.json())
      .then(data => {
        if (data.taxRate) setTaxRate(parseFloat(data.taxRate) || 15);
        if (data.netIncome) setContractValue(parseFloat(data.netIncome.replace(/[^0-9.]/g, '')) || 100000);
      })
      .catch(console.error);
  }, []);

  const calculatedTax = (contractValue * (taxRate / 100)).toFixed(2);
  const calculatedWithholding = (contractValue * (withholdingRate / 100)).toFixed(2);
  const netValue = (contractValue - calculatedWithholding).toFixed(2);
  const totalWithTax = (parseFloat(contractValue) + parseFloat(calculatedTax)).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
          Tax & Exposure Estimator
        </h1>
        <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
          Calculate corporate tax liabilities, VAT/GST estimates, and withholding on contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white m-0 pb-3 border-b border-slate-100 dark:border-[#2A364F]">
            Contract Parameters
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Gross Contract Value ($)</label>
            <input type="number" className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white" value={contractValue} onChange={(e) => setContractValue(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">VAT / GST Rate (%)</label>
            <input type="number" className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Withholding Tax Rate (%)</label>
            <input type="number" className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white" value={withholdingRate} onChange={(e) => setWithholdingRate(Number(e.target.value))} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white m-0 pb-3 border-b border-slate-100 dark:border-[#2A364F]">Estimated Breakdown</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#2A364F]/60">
                <span className="text-[#64748B] dark:text-[#8E9BAE]">Base Value:</span>
                <span className="font-semibold text-slate-900 dark:text-white">${Number(contractValue).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#2A364F]/60">
                <span className="text-[#64748B] dark:text-[#8E9BAE]">Estimated VAT/GST ({taxRate}%):</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">+${Number(calculatedTax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#2A364F]/60">
                <span className="text-[#64748B] dark:text-[#8E9BAE]">Withholding ({withholdingRate}%):</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">-${Number(calculatedWithholding).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#2A364F]/60">
                <span className="text-[#64748B] dark:text-[#8E9BAE]">Net Payout:</span>
                <span className="font-semibold text-slate-900 dark:text-white">${Number(netValue).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#2A364F] flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Total Value:</span>
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">${Number(totalWithTax).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxEstimators;
