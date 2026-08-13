import React from "react";
import { ShieldCheck } from "lucide-react";

function AuthLeftPanel() {
  return (
    <section className="hidden lg:flex w-1/2 flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-[#0B1121] via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Subtle glowing effect behind the logo */}
      <div className="absolute w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Large Premium Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-900/50">
          <ShieldCheck size={48} />
        </div>

        {/* Main Tagline */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Strong compliance builds stronger organizations.
        </h1>

        {/* Subtle Subtitle */}
        <p className="text-lg text-slate-400">
          Secure, AI-powered contract and obligation management.
        </p>
      </div>
    </section>
  );
}

export default AuthLeftPanel;
