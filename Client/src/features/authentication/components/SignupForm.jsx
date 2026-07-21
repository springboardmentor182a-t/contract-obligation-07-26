import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Building, Briefcase, BadgeCheck, MapPin, Users, Calendar, Hash, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import FormInput from '../../../components/Form/FormInput';

const rolesList = [
  { id: 'Admin', title: 'Admin', desc: 'System setup & management', icon: <User size={24} /> },
  { id: 'Legal Manager', title: 'Legal Manager', desc: 'Manage legal obligations', icon: <Briefcase size={24} /> },
  { id: 'Compliance Officer', title: 'Compliance Officer', desc: 'Ensure regulatory compliance', icon: <BadgeCheck size={24} /> },
  { id: 'Contract Manager', title: 'Contract Manager', desc: 'Handle contract lifecycles', icon: <Building size={24} /> },
];

const SignupForm = ({ onSubmit, disabled }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    name: '', employeeId: '', email: '', phone: '', password: '', confirmPassword: '',
    companyName: '', department: '', designation: '', officeLocation: '',
    superAdmin: 'No', permissionGroup: 'Global',
    barRegistrationNumber: '', yearsOfExperience: '', specialization: '',
    complianceCertification: '',
    assignedDepartments: '',
    departmentName: '', numberOfTeamMembers: '',
    dateOfJoining: '', reportingManager: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    
    if (name === 'role') {
      if (value === 'Legal Manager') newFormData.department = 'Legal';
      else if (value === 'Compliance Officer') newFormData.department = 'Compliance';
      else if (value === 'Admin') newFormData.department = 'Administration';
      else if (value === 'Contract Manager') newFormData.department = 'Contracts';
      else newFormData.department = '';
    }
    
    setFormData(newFormData);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && !formData.role) {
      alert("Please select a role to continue.");
      return;
    }

    const form = e.target.closest('form');
    if (form && !form.reportValidity()) {
      return;
    }

    setStep(s => s + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(s => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSubmit(formData);
  };

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>Choose your role</h3>
        <p className="text-muted" style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>Select the account type that best describes your responsibilities.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {rolesList.map(r => {
          const isSelected = formData.role === r.id;
          return (
            <div 
              key={r.id}
              onClick={() => handleChange({ target: { name: 'role', value: r.id } })}
              style={{
                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {r.icon}
              </div>
              <div>
                <h4 style={{ fontWeight: '600', color: 'var(--color-text-dark)', marginBottom: '0.25rem' }}>{r.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{r.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleNext} disabled={!formData.role} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', borderBottom: '2px solid var(--color-bg)', paddingBottom: '0.5rem' }}>Basic Information</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Full Name</label>
          <div className="input-with-icon">
            <User size={18} className="input-icon" />
            <FormInput type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Employee ID</label>
          <div className="input-with-icon">
            <Hash size={18} className="input-icon" />
            <FormInput type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="EMP-1234" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Official Email</label>
          <div className="input-with-icon">
            <Mail size={18} className="input-icon" />
            <FormInput type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@company.com" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Phone Number</label>
          <div className="input-with-icon">
            <Phone size={18} className="input-icon" />
            <FormInput type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Password</label>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon" />
            <FormInput type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Confirm Password</label>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon" />
            <FormInput type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={handleBack} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
          <ChevronLeft size={18} /> Back
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const isAutoDepartment = ['Admin', 'Legal Manager', 'Compliance Officer', 'Contract Manager'].includes(formData.role);
    return (
      <div className="animate-fade-in">
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', borderBottom: '2px solid var(--color-bg)', paddingBottom: '0.5rem' }}>Organization Details</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {formData.role === 'Admin' && (
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Company Name</label>
              <div className="input-with-icon">
                <Building size={18} className="input-icon" />
                <FormInput type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your Company" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
              </div>
            </div>
          )}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Department</label>
            <div className="input-with-icon">
              <Briefcase size={18} className="input-icon" />
              <FormInput 
                type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" required 
                readOnly={isAutoDepartment}
                style={{ width: '100%', paddingLeft: '2.5rem', backgroundColor: isAutoDepartment ? 'var(--color-bg)' : '' }} 
              />
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Designation</label>
            <div className="input-with-icon">
              <BadgeCheck size={18} className="input-icon" />
              <FormInput type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Office Location</label>
            <div className="input-with-icon">
              <MapPin size={18} className="input-icon" />
              <FormInput type="text" name="officeLocation" value={formData.officeLocation} onChange={handleChange} placeholder="Office Location" required style={{ width: '100%', paddingLeft: '2.5rem' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" onClick={handleBack} disabled={disabled} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
            <ChevronLeft size={18} /> Back
          </button>
          <button type="submit" disabled={disabled} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            {disabled ? 'Creating...' : 'Create Account'} <CheckCircle2 size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      
      {/* STEPS INDICATOR */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: '15%', right: '15%', height: '3px', backgroundColor: 'var(--color-border)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '15px', left: '15%', width: step === 1 ? '0%' : step === 2 ? '35%' : '70%', height: '3px', backgroundColor: 'var(--color-primary)', zIndex: 0, transition: 'width 0.3s ease-out' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%', position: 'relative', zIndex: 1 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                backgroundColor: step >= s ? 'var(--color-primary)' : 'var(--color-surface)',
                color: step >= s ? 'white' : 'var(--color-text-muted)',
                border: `2px solid ${step >= s ? 'var(--color-primary)' : 'var(--color-border)'}`,
                fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.3s'
              }}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: step >= s ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {s === 1 ? 'Role' : s === 2 ? 'Basic Info' : 'Details'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </form>
    </div>
  );
};

export default SignupForm;
