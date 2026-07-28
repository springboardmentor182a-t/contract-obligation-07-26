import { signupService } from './signup';

global.fetch = jest.fn();

describe('signupService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should map roles and submit signup successfully', async () => {
    const mockData = {
      role: 'Admin',
      name: 'John Doe',
      email: 'john@test.com',
      phone: '1234567890',
      password: 'password',
      employeeId: 'EMP1',
      companyName: 'Company',
      department: 'Admin',
      designation: 'Manager',
      officeLocation: 'NY'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ message: 'Success' })
    });

    const result = await signupService(mockData);

    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/auth/register', expect.any(Object));
    const callArgs = global.fetch.mock.calls[0][1];
    const parsedBody = JSON.parse(callArgs.body);
    expect(parsedBody.role).toBe('Admin');
    expect(parsedBody.full_name).toBe('John Doe');
    expect(result).toEqual({ message: 'Success' });
  });

  test('should throw error on failed signup', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ detail: 'Email already exists' })
    });

    await expect(signupService({})).rejects.toThrow('Email already exists');
  });
});
