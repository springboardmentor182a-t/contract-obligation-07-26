import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Buttons/Button';
import Card from '../components/DataDisplay/Card';
import { Shield, FileText, Activity } from 'lucide-react';
import '../assets/global.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
          Welcome to <span style={{ color: 'var(--color-primary)' }}>ContractIQ</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          The intelligent platform for managing, tracking, and securing your contract obligations seamlessly.
        </p>
        <div className="flex gap-4" style={{ justifyContent: 'center' }}>
          <Button variant="primary" onClick={() => navigate('/login')}>Sign In</Button>
          <Button variant="outline" onClick={() => navigate('/signup')}>Request Access</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem' }}>
            <FileText size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Centralized Repository</h3>
            <p className="text-muted">Store and manage all your contracts in one secure, easily accessible location.</p>
          </div>
        </Card>
        
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem' }}>
            <Activity size={48} style={{ color: 'var(--color-success)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Obligation Tracking</h3>
            <p className="text-muted">Never miss a deadline or compliance requirement with automated tracking.</p>
          </div>
        </Card>
        
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem' }}>
            <Shield size={48} style={{ color: 'var(--color-warning)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Enterprise Security</h3>
            <p className="text-muted">Bank-grade encryption and role-based access controls for your sensitive documents.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
