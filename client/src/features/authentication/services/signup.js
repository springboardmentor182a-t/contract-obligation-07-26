
import { apiFetch } from '../../../utils/api';

export async function signup(userData) {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

