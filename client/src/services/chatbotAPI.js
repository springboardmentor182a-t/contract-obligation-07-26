import axios from "axios";

import { API_BASE } from "../config/api";

const API_BASE_URL = `${API_BASE}/chatbot`;

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
