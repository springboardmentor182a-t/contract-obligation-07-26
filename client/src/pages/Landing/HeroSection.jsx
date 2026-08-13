import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--info)] to-[var(--emerald)]">
          Strong compliance builds stronger organizations.
        </h1>
        <p className="text-lg sm:text-xl font-light text-slate-500 dark:text-slate-300 mb-10 max-w-3xl mx-auto">
          Manage contracts securely, automate approvals, monitor compliance, and reduce organizational risks using AI-powered workflows.
        </p>
        
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-[var(--info)] rounded-[10px] hover:-translate-y-1 hover:shadow-lg hover:brightness-110 transition-all shadow-[var(--shadow-lg)]"
        >
          Get Started Now
          <ArrowRight size={20} />
        </Link>
      </div>

    </section>
  );
}
