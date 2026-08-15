import React from 'react';
import Header from './Landing/Header';
import HeroSection from './Landing/HeroSection';
import StatsStrip from './Landing/StatsStrip';
import FeatureGrid from './Landing/FeatureGrid';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header />
      <HeroSection />
      <StatsStrip />
      <FeatureGrid />
    </div>
  );
};

export default Landing;
