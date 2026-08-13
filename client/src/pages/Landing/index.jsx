import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import StatsStrip from "./StatsStrip";
import FeatureGrid from "./FeatureGrid";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <StatsStrip />
        <FeatureGrid />
      </main>

      <footer className="border-t border-[var(--border)] py-8 mt-auto text-center text-sm text-[var(--text-secondary)] transition-colors duration-200">
        <p>&copy; {new Date().getFullYear()} ContractIQ. All rights reserved.</p>
      </footer>
    </div>
  );
}
