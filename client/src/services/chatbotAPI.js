import axios from "axios";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000/api/chatbot";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const chatbotAPI = {
    chat: async (contractId, message) => {
        const response = await axios.post(
            `${API_BASE_URL}/chat`, 
            { contract_id: contractId, message }, 
            getAuthHeaders()
        );
        return response.data;
    }
};
