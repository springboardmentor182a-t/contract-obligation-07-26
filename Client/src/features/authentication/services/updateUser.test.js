import { updateUser } from './updateUser';

global.fetch = jest.fn();

describe('updateUser service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test('should update user successfully', async () => {
    window.localStorage.setItem('access_token', 'fake-token');
    const mockUserData = { user_id: 1, name: 'John', email: 'john@test.com' };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ message: 'User updated' })
    });

    const data = await updateUser(mockUserData);
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/user/update_user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token'
      },
      body: expect.any(String)
    });
    expect(data).toEqual({ message: 'User updated' });
  });

  test('should throw error on failed update', async () => {
    window.localStorage.setItem('access_token', 'fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ detail: 'Email taken' })
    });

    await expect(updateUser({})).rejects.toThrow('Email taken');
  });
});
