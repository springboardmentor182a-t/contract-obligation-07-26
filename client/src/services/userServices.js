import { API_BASE_URL } from "../data/constants";
export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
};
export const getUserById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/db/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
};
export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return await response.json();
};
export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_BASE_URL}/users/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return await response.json();
};
export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/delete/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return await response.json();
};