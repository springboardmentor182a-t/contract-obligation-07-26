import { loginService } from './login';

global.fetch = jest.fn();

describe('loginService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test('should login successfully and save token', async () => {
    const mockCredentials = { email: 'test@test.com', password: 'password' };
    const mockResponse = { access_token: 'fake-token', user_id: 123 };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse)
    });

    const data = await loginService(mockCredentials);

    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockCredentials)
    });
    expect(window.localStorage.getItem('access_token')).toBe('fake-token');
    expect(window.localStorage.getItem('user_id')).toBe('123');
    expect(data).toEqual(mockResponse);
  });

  test('should throw error on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ detail: 'Invalid credentials' })
    });

    await expect(loginService({})).rejects.toThrow('Invalid credentials');
  });
});
