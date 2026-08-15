import React, { useState, useEffect } from "react";
import { organizationAPI } from "../../services/organizationAPI";
import "../../styles/user-management.css"; // Reuse existing CSS

function OrganizationManagement() {
    const [organizations, setOrganizations] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // New form state
    const [formData, setFormData] = useState({
        organization_type: "Private Limited",
        company_name: "",
        registration_number: "",
        gst_number: "",
        contact_number: "",
        offical_email: "",
        country: "",
        state: "",
        city: ""
    });

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const data = await organizationAPI.getAll();
            setOrganizations(data);
        } catch (error) {
            console.error("Failed to fetch organizations:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const newOrg = await organizationAPI.create(formData);
            setOrganizations([...organizations, newOrg]);
            setIsCreateModalOpen(false);
            // Reset form
            setFormData({
                organization_type: "Private Limited",
                company_name: "",
                registration_number: "",
                gst_number: "",
                contact_number: "",
                offical_email: "",
                country: "",
                state: "",
                city: ""
            });
        } catch (error) {
            console.error("Failed to create organization:", error);
            alert("Failed to create organization.");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this organization?");
        if (!confirmDelete) return;

        try {
            await organizationAPI.delete(id);
            setOrganizations(organizations.filter(org => org.organization_id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete organization. You might not have permission.");
        }
    };

    return (
        <div className="user-management-page" style={{ padding: '2rem' }}>
            <div className="user-management-hero">
                <div className="user-management-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <p className="hero-label">ORGANIZATION ADMINISTRATION</p>
                        <h1>Organization Management</h1>
                        <p className="hero-description">
                            Manage organizations and their details.
                        </p>
                    </div>
                    <button 
                        className="btn-primary" 
                        style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create Organization
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: '600' }}>Company Name</th>
                            <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: '600' }}>Type</th>
                            <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: '600' }}>GST No</th>
                            <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: '600' }}>Email</th>
                            <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: '600' }}>Location</th>
                            <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizations.map(org => (
                            <tr key={org.organization_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '12px 16px' }}>{org.organization_id}</td>
                                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{org.company_name || '-'}</td>
                                <td style={{ padding: '12px 16px' }}>{org.organization_type}</td>
                                <td style={{ padding: '12px 16px' }}>{org.gst_number}</td>
                                <td style={{ padding: '12px 16px' }}>{org.offical_email}</td>
                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                                    {org.city}, {org.state}, {org.country}
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <button 
                                        onClick={() => handleDelete(org.organization_id)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {organizations.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        No organizations found.
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Organization</h2>
                        <form onSubmit={handleCreate}>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Company Name</label>
                                    <input 
                                        type="text" 
                                        name="company_name"
                                        required 
                                        value={formData.company_name}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Organization Type</label>
                                    <select 
                                        name="organization_type"
                                        value={formData.organization_type}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                    >
                                        <option value="Private Limited">Private Limited</option>
                                        <option value="Public Limited">Public Limited</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Government">Government</option>
                                        <option value="LLP">LLP</option>
                                        <option value="NGO">NGO</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Registration No</label>
                                    <input 
                                        type="text" 
                                        name="registration_number"
                                        required 
                                        value={formData.registration_number}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>GST No</label>
                                    <input 
                                        type="text" 
                                        name="gst_number"
                                        required 
                                        value={formData.gst_number}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Contact Number</label>
                                    <input 
                                        type="text" 
                                        name="contact_number"
                                        required 
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Official Email</label>
                                    <input 
                                        type="email" 
                                        name="offical_email"
                                        required 
                                        value={formData.offical_email}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>City</label>
                                    <input 
                                        type="text" 
                                        name="city"
                                        required 
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>State</label>
                                    <input 
                                        type="text" 
                                        name="state"
                                        required 
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Country</label>
                                    <input 
                                        type="text" 
                                        name="country"
                                        required 
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrganizationManagement;
