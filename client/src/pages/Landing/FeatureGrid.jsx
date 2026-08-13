import React from "react";
import { FileEdit, Search, BrainCircuit, Library, TrendingUp, MessageSquareText } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      title: "Contract Creation",
      description: "Draft flawless contracts in minutes using our intuitive, guided contract generation wizard.",
      icon: <FileEdit size={24} />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-[rgba(59,130,246,0.12)]"
    },
    {
      title: "Redline Analysis",
      description: "Automatically detect and analyze high-risk clauses in third-party paper during negotiations.",
      icon: <Search size={24} />,
      color: "text-red-600 dark:text-[#DC2626]",
      bg: "bg-red-100 dark:bg-[rgba(239,68,68,0.12)]"
    },
    {
      title: "Negotiation Intelligence",
      description: "Leverage historical contract data and AI insights to negotiate better terms and improve margins.",
      icon: <BrainCircuit size={24} />,
      color: "text-purple-600 dark:text-[#7C3AED]",
      bg: "bg-purple-100 dark:bg-[rgba(139,92,246,0.12)]"
    },
    {
      title: "Template Library",
      description: "Standardize your legal language with a centralized, pre-approved playbook of dynamic templates.",
      icon: <Library size={24} />,
      color: "text-emerald-600 dark:text-[#10B981]",
      bg: "bg-emerald-100 dark:bg-[rgba(16,185,129,0.12)]"
    },
    {
      title: "Revenue Intelligence",
      description: "Identify missed revenue opportunities, unbilled services, and upcoming high-value renewals easily.",
      icon: <TrendingUp size={24} />,
      color: "text-amber-600 dark:text-[#D97706]",
      bg: "bg-amber-100 dark:bg-[rgba(245,158,11,0.12)]"
    },
    {
      title: "Response Drafting",
      description: "Generate compliant, legally-sound responses to counter-proposals automatically using our AI engine.",
      icon: <MessageSquareText size={24} />,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-100 dark:bg-[rgba(6,182,212,0.12)]"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-display font-bold text-[var(--text)] mb-4">
          Everything you need for contract lifecycle management
        </h2>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Powerful tracking, monitoring, and compliance features wrapped in an intuitive interface.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-12 h-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold font-display text-[var(--text)] mb-2">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 flex-1">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
