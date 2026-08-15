export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  // Handle empty responses
  if (response.status === 204) return null;
  
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
