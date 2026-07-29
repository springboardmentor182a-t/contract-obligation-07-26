import { API_BASE_URL } from '../../../data/constants';

export const getUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};