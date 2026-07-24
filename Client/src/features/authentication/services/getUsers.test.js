import { getUsers } from './getUsers';

global.fetch = jest.fn();

describe('getUsers service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test('should fetch user profile successfully', async () => {
    window.localStorage.setItem('access_token', 'fake-token');
    const mockData = { id: 1, name: 'Test User' };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData)
    });

    const data = await getUsers();
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token'
      }
    });
    expect(data).toEqual(mockData);
  });

  test('should throw error when response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ detail: 'Token expired' })
    });

    await expect(getUsers()).rejects.toThrow('Token expired');
  });
});
