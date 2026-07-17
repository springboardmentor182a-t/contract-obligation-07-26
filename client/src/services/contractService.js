import axios from "axios";

const API=axios.create({

baseURL:"http://localhost:5000/api"

});

export const getContracts=async()=>{

const res=await API.get("/contracts");
return res.data;

};

export const createContract=async(data)=>{

const res=await API.post("/contracts",data);
return res.data;

};

export const updateContract=async(id,data)=>{

const res=await API.put(`/contracts/${id}`,data);
return res.data;

};

export const deleteContract=async(id)=>{

const res=await API.delete(`/contracts/${id}`);
return res.data;

};