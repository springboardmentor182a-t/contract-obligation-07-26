import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/organizations";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const organizationAPI = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE_URL}/`, getAuthHeaders());
        return response.data;
    },
    
    getById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders());
        return response.data;
    },
    
    create: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/`, data, getAuthHeaders());
        return response.data;
    },
    
    update: async (id, data) => {
        const response = await axios.put(`${API_BASE_URL}/${id}`, data, getAuthHeaders());
        return response.data;
    },
    
    delete: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
        return response.data;
    },
    
    assignUser: async (orgId, userId) => {
        const response = await axios.post(`${API_BASE_URL}/${orgId}/users`, { user_id: userId }, getAuthHeaders());
        return response.data;
    }
};
