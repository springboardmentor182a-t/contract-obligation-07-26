
const API = `${process.env.REACT_APP_API_URL}/renewals/`;
export async function getRenewals() {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Failed to fetch renewals");
  }

  return await response.json();
}

export async function addRenewal(data) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.log(result);
    throw new Error(JSON.stringify(result));
  }

  return result;
}

  


export async function updateRenewal(id, data) {
  const response = await fetch(API + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function deleteRenewal(id) {
  const response = await fetch(API + id, {
    method: "DELETE",
  });

  return await response.json();
}