import { changePassword } from './changePassword';

global.fetch = jest.fn();

describe('changePassword service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test('should change password successfully', async () => {
    window.localStorage.setItem('access_token', 'fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ message: 'Password changed' })
    });

    const data = await changePassword('oldPass', 'newPass');
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/change_password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token'
      },
      body: JSON.stringify({ old_password: 'oldPass', new_password: 'newPass' })
    });
    expect(data).toEqual({ message: 'Password changed' });
  });

  test('should throw error on failed password change', async () => {
    window.localStorage.setItem('access_token', 'fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ detail: 'Incorrect old password' })
    });

    await expect(changePassword('wrong', 'newPass')).rejects.toThrow('Incorrect old password');
  });
});
