import { apiFetch } from '../../../utils/api';

export async function logout() {
  return apiFetch('/auth/logout', {
    method: 'POST',
  });
}
