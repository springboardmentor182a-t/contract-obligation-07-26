import BASE_URL from "../../../config/api";

export async function listContracts() {
  const response = await fetch(`${BASE_URL}/contracts/`);

  if (!response.ok) {
    throw new Error("Failed to fetch contracts");
  }

  return await response.json();
}