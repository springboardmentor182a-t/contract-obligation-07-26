import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, X, Building, Phone } from "lucide-react";
import { API_BASE } from "../../../config/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", organization: "", department: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [bannerError, setBannerError] = useState("");

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!EMAIL_REGEX.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setBannerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "Employee" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Registration failed");
      navigate("/login", { state: { message: "Account created successfully. Please log in." } });
    } catch (err) {
      setBannerError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = () => window.location.href = `${API_BASE}/auth/google/login`;

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      {bannerError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center justify-between text-sm">
          <div className="flex items-center gap-2"><AlertCircle size={16} /> {bannerError}</div>
          <button type="button" onClick={() => setBannerError("")}><X size={16} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 relative">
          <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="John Doe" disabled={loading} />
          </div>
          {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="you@company.com" disabled={loading} />
          </div>
          {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 relative">
          <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="••••••••" disabled={loading} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="••••••••" disabled={loading} />
          </div>
          {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200 mt-2">
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <div className="relative flex items-center justify-center my-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
        <span className="relative bg-white px-4 text-xs text-slate-400 uppercase">Or</span>
      </div>

      <button type="button" onClick={handleGoogleSSO} className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Sign up with Google
      </button>

      <p className="text-center text-sm text-slate-500 mt-2">
        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
      </p>
    </form>
  );
}
