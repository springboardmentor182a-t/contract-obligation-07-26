import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroShield from '../components/HeroShield';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page bg-slate-50 relative overflow-hidden flex min-h-screen">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-400/20 mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 backdrop-blur-3xl z-10">
        <div className="w-full max-w-md px-8">
          <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Secure Portal Login</h1>
          <p className="text-gray-600 mb-8">Access your ContractIQ enterprise account.</p>
          
          {error && <div className="bg-red-50 text-[#EF4444] p-3 rounded-md mb-6 text-sm">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Corporate Email</label>
              <input 
                type="email" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all bg-white text-black" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm font-semibold text-[#1E3A8A] hover:underline">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all bg-white text-black" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="w-full bg-[#1E3A8A] text-white p-3 rounded-md font-semibold hover:bg-[#152a6b] transition-all duration-200" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an enterprise account? <Link to="/signup" className="text-[#1E3A8A] font-semibold hover:underline">Request Access</Link>
          </div>
        </div>
      </div>

      {/* Right Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A8A] items-center justify-center flex-col relative overflow-hidden">
        <div className="z-10 text-center px-12 flex flex-col items-center justify-center w-full">
          {/* Custom SVG Hero Shield */}
          <div className="w-80 h-80 mb-6 drop-shadow-2xl">
            <HeroShield />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Enterprise Grade Security</h2>
          <p className="text-[#F8FAFC] text-lg opacity-80">End-to-end encrypted contract management for global organizations.</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full border-[20px] border-white"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full border-[15px] border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
