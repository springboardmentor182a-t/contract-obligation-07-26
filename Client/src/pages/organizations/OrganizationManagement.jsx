import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Search, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Globe,
  Mail,
  Phone
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import Badge from '../../components/DataDisplay/Badge';
import Dropdown from '../../components/Buttons/Dropdown';
import Modal from '../../components/Modals/Modal';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';
import { 
  getOrganizations, 
  updateOrganization, 
  deactivateOrganization, 
  deleteOrganization, 
  createOrganization 
} from '../../features/organizations/services/organizationAPI';

const orgTypeOptions = [
  { value: 'Private Limited', label: 'Private Limited' },
  { value: 'Public Limited', label: 'Public Limited' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Government', label: 'Government' },
  { value: 'LLP', label: 'LLP' },
  { value: 'NGO', label: 'NGO' }
];

const countryOptions = [
  { value: 'India', label: 'India' },
  { value: 'USA', label: 'USA' },
  { value: 'UK', label: 'UK' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' }
];

const stateOptions = [
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh' },
  { value: 'Goa', label: 'Goa' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Manipur', label: 'Manipur' },
  { value: 'Meghalaya', label: 'Meghalaya' },
  { value: 'Mizoram', label: 'Mizoram' },
  { value: 'Nagaland', label: 'Nagaland' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Sikkim', label: 'Sikkim' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Tripura', label: 'Tripura' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Uttarakhand', label: 'Uttarakhand' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
  { value: 'Ladakh', label: 'Ladakh' },
  { value: 'Lakshadweep', label: 'Lakshadweep' },
  { value: 'Puducherry', label: 'Puducherry' }
];

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const data = await getOrganizations();
      setOrganizations(data || []);
    } catch (err) {
      console.error(err);
      // Fallback to empty array on error
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrgs = organizations.filter(org => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = org.company_name?.toLowerCase().includes(searchLower);
    const typeMatch = org.organization_type?.toLowerCase().includes(searchLower);
    const emailMatch = org.offical_email?.toLowerCase().includes(searchLower);
    const cityMatch = org.city?.toLowerCase().includes(searchLower);
    return nameMatch || typeMatch || emailMatch || cityMatch;
  });

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    const newOrg = {
      organization_type: e.target.organization_type.value,
      company_name: e.target.company_name.value,
      registration_number: e.target.registration_number.value,
      gst_number: e.target.gst_number.value,
      contact_number: e.target.contact_number.value,
      offical_email: e.target.offical_email.value,
      country: e.target.country.value,
      state: e.target.state.value,
      city: e.target.city.value,
      is_active: e.target.is_active.value === 'true',
      join_date: new Date().toISOString()
    };
    
    try {
      await createOrganization(newOrg);
      alert('Organization added successfully!');
      setIsAddOrgModalOpen(false);
      fetchOrganizations();
    } catch (err) {
      alert(err.message || "Failed to create organization.");
    }
  };

  const handleUpdateOrg = async (e) => {
    e.preventDefault();
    try {
      await updateOrganization({
        ...editingOrg,
        join_date: editingOrg.join_date || new Date().toISOString()
      });
      alert('Organization updated successfully!');
      setEditingOrg(null);
      fetchOrganizations();
    } catch (err) {
      alert(err.message || "Failed to update organization.");
    }
  };

  const handleToggleOrgStatus = async (orgToToggle) => {
    try {
      await deactivateOrganization(orgToToggle.organization_id);
      fetchOrganizations();
    } catch (err) {
      alert(err.message || "Failed to change organization status.");
    }
  };

  const handleDeleteOrg = async (id) => {
    if (window.confirm("Are you sure you want to remove this organization?")) {
      try {
        await deleteOrganization(id);
        fetchOrganizations();
      } catch (err) {
        alert(err.message || "Failed to delete organization.");
      }
    }
  };

  return (
    <div className="dashboard-container fade-in">
      {/* Header */}
      <div className="dashboard-header mb-2 stagger-1">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building size={28} className="text-primary" /> Organization Management
          </h1>
          <p className="text-muted mt-1">Manage partner organizations, clients, and their details.</p>
        </div>
        <div className="dashboard-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="header-search" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', width: '250px' }}>
            <Search size={16} className="text-muted" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search organizations..." 
              value={searchTerm}
              onChange={handleSearch}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setIsAddOrgModalOpen(true)}>
            Add Organization
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid stagger-1 mb-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">Total Organizations</p>
            <div className="stat-icon" style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(107, 142, 177, 0.15)' }}>
              <Building size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3>{organizations.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">Active</p>
            <div className="stat-icon" style={{ color: 'var(--color-success)', backgroundColor: 'rgba(46, 204, 113, 0.15)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3>{organizations.filter(o => o.is_active).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">Inactive</p>
            <div className="stat-icon" style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(231, 76, 60, 0.15)' }}>
              <XCircle size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3>{organizations.filter(o => !o.is_active).length}</h3>
          </div>
        </div>
      </div>

      {/* Organization Table */}
      <div className="dashboard-card stagger-2" style={{ overflow: 'visible' }}>
        <div className="activity-table-wrapper" style={{ overflow: 'visible' }}>
          <table className="activity-table">
            <thead>
              <tr>
                <th>Organization Details</th>
                <th>Type</th>
                <th>Registration / GST</th>
                <th>Location</th>
                <th>Status</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                    Loading organizations...
                  </td>
                </tr>
              ) : filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <tr key={org.organization_id}>
                    <td>
                      <div className="table-user">
                        <div className="table-avatar" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                          {(org.company_name || 'O').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ marginBottom: '0.1rem', color: 'var(--color-text)' }}>{org.company_name}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Mail size={12} /> {org.offical_email}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                            <Phone size={12} /> {org.contact_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="neutral">{org.organization_type}</Badge>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', display: 'block' }}>Reg: {org.registration_number || 'N/A'}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', display: 'block' }}>GST: {org.gst_number || 'N/A'}</span>
                    </td>
                    <td>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>{org.city}, {org.state}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Globe size={12} /> {org.country}
                      </p>
                    </td>
                    <td>
                      <Badge variant={org.is_active ? 'success' : 'danger'}>{org.is_active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Dropdown 
                        label={<MoreVertical size={16} />}
                        hideArrow
                        onSelect={(item) => {
                          if (item.action === 'edit') setEditingOrg({ ...org });
                          if (item.action === 'toggleStatus') handleToggleOrgStatus(org);
                          if (item.action === 'delete') handleDeleteOrg(org.organization_id);
                        }}
                        items={[
                          { label: 'Edit Organization', action: 'edit' },
                          { label: org.is_active ? 'Deactivate' : 'Activate', action: 'toggleStatus' },
                          { label: 'Remove', action: 'delete', danger: true }
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                    No organizations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Organization Modal */}
      <Modal 
        isOpen={isAddOrgModalOpen} 
        onClose={() => setIsAddOrgModalOpen(false)}
        title="Add New Organization"
      >
        <form onSubmit={handleCreateOrg} id="add-org-form" style={{ padding: '0.5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <FormInput label="Company Name" name="company_name" type="text" required />
            <FormInput label="Official Email" name="offical_email" type="email" required />
            
            <FormSelect 
              label="Organization Type"
              name="organization_type"
              options={orgTypeOptions}
              defaultValue="Private Limited"
            />
            <FormInput label="Contact Number" name="contact_number" type="tel" required />

            <FormInput label="Registration Number" name="registration_number" type="text" required />
            <FormInput label="GST Number" name="gst_number" type="text" required />
            
            <FormSelect 
              label="Country" 
              name="country" 
              options={countryOptions}
              defaultValue="India"
            />
            <FormSelect 
              label="State" 
              name="state" 
              options={stateOptions}
              defaultValue="Maharashtra"
            />
            
            <FormInput label="City" name="city" type="text" required />
            <FormSelect 
              label="Status"
              name="is_active"
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]}
              defaultValue="true"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsAddOrgModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Organization</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Organization Modal */}
      {editingOrg && (
        <Modal 
          isOpen={!!editingOrg} 
          onClose={() => setEditingOrg(null)}
          title="Edit Organization Details"
        >
          <form onSubmit={handleUpdateOrg} id="edit-org-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormInput 
                label="Company Name" 
                type="text" 
                required 
                value={editingOrg.company_name || ''} 
                onChange={(e) => setEditingOrg({...editingOrg, company_name: e.target.value})} 
              />
              <FormInput 
                label="Official Email" 
                type="email" 
                required 
                value={editingOrg.offical_email || ''} 
                onChange={(e) => setEditingOrg({...editingOrg, offical_email: e.target.value})} 
              />

              <FormSelect 
                label="Organization Type"
                value={editingOrg.organization_type || 'Private Limited'}
                onChange={(e) => setEditingOrg({...editingOrg, organization_type: e.target.value})}
                options={orgTypeOptions}
              />
              <FormInput 
                label="Contact Number" 
                type="tel" 
                required 
                value={editingOrg.contact_number || ''} 
                onChange={(e) => setEditingOrg({...editingOrg, contact_number: e.target.value})} 
              />

              <FormInput 
                label="Registration Number" 
                type="text" 
                required 
                value={editingOrg.registration_number || ''} 
                onChange={(e) => setEditingOrg({...editingOrg, registration_number: e.target.value})} 
              />
              <FormInput 
                label="GST Number" 
                type="text" 
                required 
                value={editingOrg.gst_number || ''} 
                onChange={(e) => setEditingOrg({...editingOrg, gst_number: e.target.value})} 
              />

              <FormSelect 
                label="Country" 
                value={editingOrg.country || 'India'}
                onChange={(e) => setEditingOrg({...editingOrg, country: e.target.value})}
                options={countryOptions}
              />
              <FormSelect 
                label="State" 
                value={editingOrg.state || 'Maharashtra'}
                onChange={(e) => setEditingOrg({...editingOrg, state: e.target.value})}
                options={stateOptions}
              />

              <FormInput 
                label="City" 
                type="text" 
                required 
                value={editingOrg.city || ''} 
                onChange={(e) => setEditingOrg({...editingOrg, city: e.target.value})} 
              />
              <FormSelect 
                label="Status"
                value={editingOrg.is_active ? 'true' : 'false'}
                onChange={(e) => setEditingOrg({...editingOrg, is_active: e.target.value === 'true'})}
                options={[
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' }
                ]}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button type="button" variant="outline" onClick={() => setEditingOrg(null)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default OrganizationManagement;
