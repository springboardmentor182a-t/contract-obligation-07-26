import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeContracts, setActiveContracts] = useState('—');

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setActiveContracts(res.data.active_contracts ?? '—'))
      .catch(() => { });
  }, []);

  const dark = isDarkMode;



  const s = {
    page: {
      minHeight: '100vh',
      background: dark ? 'linear-gradient(135deg, #0B1121 0%, #0d1530 100%)' : '#f8fafc',
      color: dark ? '#f8fafc' : '#0f172a',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflowX: 'hidden',
    },
    blob1: {
      position: 'absolute', top: '-10%', left: '-10%',
      width: '40%', height: '40%', borderRadius: '50%',
      background: 'rgba(59,130,246,0.15)', filter: 'blur(120px)',
      pointerEvents: 'none',
    },
    blob2: {
      position: 'absolute', bottom: '-10%', right: '-10%',
      width: '40%', height: '40%', borderRadius: '50%',
      background: 'rgba(20,184,166,0.15)', filter: 'blur(120px)',
      pointerEvents: 'none',
    },
    nav: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1.5rem 2rem',
      borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
      position: 'relative', zIndex: 10,
    },
    navBrand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    navIcon: {
      width: 40, height: 40, background: '#2563eb', borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
    },
    navName: { fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
    navActions: { display: 'flex', alignItems: 'center', gap: '1rem' },
    themeBtn: {
      background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem',
      transition: 'transform 0.2s', padding: '0.25rem',
    },
    loginBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      fontWeight: 600, fontSize: '0.9rem', padding: '0.5rem 1rem',
      borderRadius: 8, color: dark ? '#94a3b8' : '#475569',
      transition: 'background 0.2s',
    },
    demoNavBtn: {
      background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer',
      fontWeight: 700, fontSize: '0.9rem', padding: '0.6rem 1.4rem',
      borderRadius: 10, boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
      transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
    },
    hero: {
      position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '6rem 1rem 4rem',
    },
    h1: {
      fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
      fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
      margin: '0 0 1.5rem',
    },
    gradientSpan: {
      background: 'linear-gradient(90deg, #3b82f6, #14b8a6)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      color: dark ? '#94a3b8' : '#64748b',
      maxWidth: 600, lineHeight: 1.7, margin: '0 auto 2.5rem',
    },
    ctaBtn: {
      background: '#2563eb', color: '#fff', border: 'none',
      cursor: 'pointer', fontWeight: 800,
      fontSize: '1.1rem', padding: '1rem 2.5rem',
      borderRadius: 9999, opacity: 1,
      boxShadow: '0 0 40px -10px rgba(37,99,235,0.7)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
    },
    mockFrame: {
      marginTop: '4rem', width: '100%', maxWidth: 900,
      borderRadius: 20,
      border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
      background: dark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(20px)', padding: '1.5rem',
      boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)',
    },
    mockTopBar: {
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      borderBottom: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
      paddingBottom: '1rem', marginBottom: '1.25rem',
    },
    dot: (color) => ({ width: 12, height: 12, borderRadius: '50%', background: color }),
    mockLabel: { fontSize: '0.85rem', fontWeight: 600, color: dark ? '#94a3b8' : '#64748b', marginLeft: '0.5rem' },
    mockGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' },
    mockCard: {
      borderRadius: 12,
      background: dark ? 'rgba(30,41,59,0.8)' : '#f1f5f9',
      border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
      padding: '1rem',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 110,
    },
    mockNum: { fontSize: '1.75rem', fontWeight: 800 },
    mockSmall: { fontSize: '0.75rem', color: '#94a3b8' },
    barsCard: {
      borderRadius: 12,
      background: dark ? 'rgba(30,41,59,0.8)' : '#f1f5f9',
      border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
      padding: '1rem', minHeight: 110,
      display: 'flex', alignItems: 'flex-end', gap: '0.4rem',
    },
    section: {
      padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto',
      position: 'relative', zIndex: 5,
    },
    sectionTitle: {
      fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800,
      textAlign: 'center', marginBottom: '0.75rem',
    },
    sectionSub: {
      textAlign: 'center', fontSize: '1.05rem',
      color: dark ? '#94a3b8' : '#64748b', marginBottom: '3rem',
    },
    bentoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'auto auto',
      gap: '1.25rem',
    },
    bentoLarge: {
      gridColumn: 'span 2', gridRow: 'span 2',
      borderRadius: 24, padding: '2rem',
      border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
      background: dark ? 'rgba(30,41,59,0.5)' : '#ffffff',
      position: 'relative', overflow: 'hidden', minHeight: 280,
      transition: 'border-color 0.2s',
    },
    bentoSmall: {
      borderRadius: 24, padding: '1.75rem',
      border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
      background: dark ? 'rgba(30,41,59,0.5)' : '#ffffff',
      transition: 'border-color 0.2s',
    },
    featureIcon: (bg, color) => ({
      width: 44, height: 44, borderRadius: 14,
      background: bg, color: color, fontSize: '1.1rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    }),
    featureTitle: { fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' },
    featureDesc: { fontSize: '0.95rem', color: dark ? '#94a3b8' : '#64748b', lineHeight: 1.65 },
    featureTitleSm: { fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' },
    featureDescSm: { fontSize: '0.85rem', color: dark ? '#94a3b8' : '#64748b', lineHeight: 1.6 },
  };

  const bars = [40, 70, 45, 90, 65, 100, 80];

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span style={s.navName}>ContractIQ</span>
        </div>
        <div style={s.navActions}>
          <button style={s.themeBtn} onClick={toggleTheme} title="Toggle Theme">
            {dark ? '🌙' : '☀️'}
          </button>
          <button style={s.demoNavBtn} onClick={() => navigate('/login')}>
            Login / Register
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main style={s.hero}>
        <h1 style={s.h1}>
          Contract Compliance,<br />
          <span style={s.gradientSpan}>Automated and Secured.</span>
        </h1>
        <p style={s.subtitle}>
          Extract obligations, track renewals, and mitigate risks in real-time with our
          AI-powered legal intelligence platform.
        </p>
        <button
          style={s.ctaBtn}
          onClick={() => navigate('/login')}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Get Started <span>→</span>
        </button>

        {/* Mock dashboard preview */}
        <div style={s.mockFrame}>
          <div style={s.mockTopBar}>
            <div style={s.dot('#ef4444')} />
            <div style={s.dot('#f59e0b')} />
            <div style={s.dot('#22c55e')} />
            <span style={s.mockLabel}>Dashboard Overview</span>
          </div>
          <div style={s.mockGrid}>
            <div style={s.mockCard}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>📄</div>
              <div>
                <div style={s.mockNum}>{activeContracts}</div>
                <div style={s.mockSmall}>Active Contracts</div>
              </div>
            </div>
            <div style={s.barsCard}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(to top, #2563eb, #14b8a6)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Feature Bento Grid */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Powerful tools, simple workflow.</h2>
        <p style={s.sectionSub}>Designed to scale with your legal team.</p>

        <div style={s.bentoGrid}>
          {/* Large card */}
          <div style={s.bentoLarge}>
            <div style={s.featureIcon('rgba(59,130,246,0.12)', '#3b82f6')}>🔄</div>
            <h3 style={s.featureTitle}>Smart Renewals</h3>
            <p style={s.featureDesc}>
              Never miss a deadline. Automated alerts for upcoming renewals with contextual insights on performance and obligations.
            </p>
            <div style={{ position: 'absolute', bottom: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(59,130,246,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          </div>

          {/* Small cards */}
          <div style={s.bentoSmall}>
            <div style={s.featureIcon('rgba(245,158,11,0.12)', '#f59e0b')}>⚠️</div>
            <h3 style={s.featureTitleSm}>Risk Tracking</h3>
            <p style={s.featureDescSm}>Identify high-liability clauses and non-standard terms instantly.</p>
          </div>

          <div style={s.bentoSmall}>
            <div style={s.featureIcon('rgba(20,184,166,0.12)', '#14b8a6')}>🧠</div>
            <h3 style={s.featureTitleSm}>AI Analysis</h3>
            <p style={s.featureDescSm}>Intelligent redlining and contract summarization powered by NLP.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
