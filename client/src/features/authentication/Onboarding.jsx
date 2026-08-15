import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../config/api";

const ROLES = ["Administrator", "Legal Manager", "Compliance Officer", "Contract Manager", "Department Head", "Employee"];

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/auth/complete-profile`, 
        { role: selectedRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Save role to local storage as well for app state
      localStorage.setItem("role", selectedRole);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to complete profile:", error);
      alert("Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1121] text-white p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
        <p className="text-slate-400 mb-6">To set up your workspace, please select your role.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-300">Your Role</span>
            <select 
              className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
