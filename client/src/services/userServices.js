import BASE_URL from "../config/api";

/* ---------------- GET ALL USERS ---------------- */

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users/`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
};

/* ---------------- GET USER BY ID ---------------- */

export const getUserById = async (id) => {
  const response = await fetch(`${BASE_URL}/users/db/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
};

/* ---------------- CREATE USER ---------------- */

export const createUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/users/create`, {
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

/* ---------------- UPDATE USER ---------------- */

export const updateUser = async (id, userData) => {
  const response = await fetch(`${BASE_URL}/users/update/${id}`, {
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

/* ---------------- DELETE USER ---------------- */

export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/users/delete/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return await response.json();
};
