import axios from 'axios';

// Read the URL from the .env file.
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CONTRACT_API_URL = `${BASE_URL}/contracts`;

/**
 * 1. GET ALL CONTRACTS (with optional search and status filtering)
 */
export const getContracts = async (searchTerm, statusFilter) => {
  const response = await axios.get(CONTRACT_API_URL, {
    params: {
      search: searchTerm || undefined,
      status: statusFilter !== "All" ? statusFilter : undefined,
    },
  });
  return response.data;
};

/**
 * 2. GET SINGLE CONTRACT BY ID
 */
export const getContractById = async (id) => {
  const response = await axios.get(`${CONTRACT_API_URL}/${id}`);
  return response.data;
};

/**
 * 3. CREATE CONTRACT
 */
export const createContract = async (contractData) => {
  const response = await axios.post(CONTRACT_API_URL, contractData);
  return response.data;
};

/**
 * 4. UPDATE CONTRACT
 */
export const updateContract = async (id, updatedData) => {
  const response = await axios.put(`${CONTRACT_API_URL}/${id}`, updatedData);
  return response.data;
};

/**
 * 5. DELETE CONTRACT
 */
export const deleteContract = async (id) => {
  const response = await axios.delete(`${CONTRACT_API_URL}/${id}`);
  return response.data;
};