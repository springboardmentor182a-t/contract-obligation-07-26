
import { apiFetch } from '../../../utils/api';

export async function getUsers() {
  return apiFetch('/users/');
}

