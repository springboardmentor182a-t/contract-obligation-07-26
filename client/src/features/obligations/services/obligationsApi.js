import BASE_URL from "../../../config/api";

export async function listObligations() {
  const response = await fetch(`${BASE_URL}/obligations/`);

  if (!response.ok) {
    throw new Error("Failed to fetch obligations");
  }

  return await response.json();
}

export async function getObligation(id) {
  const response = await fetch(`${BASE_URL}/obligations/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch obligation");
  }

  return await response.json();
}

export async function createObligation(payload) {
  const response = await fetch(`${BASE_URL}/obligations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create obligation");
  }

  return await response.json();
}

export async function updateObligation(id, payload) {
  const response = await fetch(`${BASE_URL}/obligations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update obligation");
  }

  return await response.json();
}

export async function deleteObligation(id) {
  const response = await fetch(`${BASE_URL}/obligations/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete obligation");
  }

  return await response.json();
}

export async function getObligationStats() {
  const response = await fetch(`${BASE_URL}/obligations/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch obligation stats");
  }

  return await response.json();
}