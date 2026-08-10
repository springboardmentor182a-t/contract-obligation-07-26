import axios from "axios";

// Supports both Vite and Create React App
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://contract-obligation-demo-group-c.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE,
});
// ======================
// Contract APIs
// ======================

export const getContracts = async () => {
  const response = await API.get("/contracts");
  return response.data;
};

export const getContract = async (id) => {
  const response = await API.get(`/contracts/${id}`);
  return response.data;
};

export const getContractInsights = async (id) => {
  const response = await API.get(`/insights/${id}`);
  return response.data;
};

export const createContract = async (contract) => {
  const response = await API.post("/contracts", contract);
  return response.data;
};

export const updateContract = async (id, contract) => {
  const response = await API.put(`/contracts/${id}`, contract);
  return response.data;
};

export const deleteContract = async (id) => {
  const response = await API.delete(`/contracts/${id}`);
  return response.data;
};

// ======================
// Document APIs
// ======================

// Upload Document
export const uploadDocument = async (contractId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post(
    `/contracts/${contractId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Get Documents
export const getDocuments = async (contractId) => {
  const response = await API.get(`/contracts/${contractId}/documents`);
  return response.data;
};

// Preview Document URL
export const previewDocument = (documentId) => {
  return `/api/contracts/documents/${documentId}/preview`;
};

// Download Document URL
export const downloadDocument = (documentId) => {
  return `/api/contracts/documents/${documentId}/download`;
};

// Delete Document
export const removeDocument = async (documentId) => {
  const response = await API.delete(`/contracts/documents/${documentId}`);
  return response.data;
};
