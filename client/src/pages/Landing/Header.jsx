import React from "react";
import { Link } from "react-router-dom";
import { useUI } from "../../context/UIContext";
import { ShieldCheck, Moon, Sun } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useUI();

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--emerald)] flex items-center justify-center text-white shrink-0">
            <ShieldCheck size={20} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-[var(--text)]">
            ContractIQ
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link
            to="/login"
            className="inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-[var(--info)] rounded-[9px] hover:brightness-110 transition-all shadow-[var(--shadow)]"
          >
            Login / Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
