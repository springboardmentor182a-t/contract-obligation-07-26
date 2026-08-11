const API = "http://localhost:8000/api/v1/renewals/";

export async function getRenewals() {
  const response = await fetch(API);

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    result = text;
  }

  if (!response.ok) {
    throw new Error(
      typeof result === "string"
        ? result
        : JSON.stringify(result)
    );
  }

  return result;
}

export async function addRenewal(data) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    result = text;
  }

  if (!response.ok) {
    throw new Error(
      typeof result === "string"
        ? result
        : JSON.stringify(result)
    );
  }

  return result;
}

export async function updateRenewal(id, data) {
  const response = await fetch(`${API}${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    result = text;
  }

  if (!response.ok) {
    throw new Error(
      typeof result === "string"
        ? result
        : JSON.stringify(result)
    );
  }

  return result;
}

export async function deleteRenewal(id) {
  const response = await fetch(`${API}${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    result = text;
  }

  if (!response.ok) {
    throw new Error(
      typeof result === "string"
        ? result
        : JSON.stringify(result)
    );
  }

  return result;
}