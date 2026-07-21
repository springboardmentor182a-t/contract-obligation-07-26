import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const getContracts = async () => {
  const response = await API.get("/contracts");
  return response.data;
};

export const getContract = async (id) => {
  const response = await API.get(`/contracts/${id}`);
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