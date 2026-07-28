import { renderHook, act } from '@testing-library/react';
import { useSignup } from './useSignup';
import { signupService } from '../services/signup';

jest.mock('../services/signup', () => ({
  signupService: jest.fn()
}));

describe('useSignup hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle successful signup', async () => {
    signupService.mockResolvedValueOnce({ message: 'Success' });
    const { result } = renderHook(() => useSignup());

    expect(result.current.isLoading).toBe(false);
    
    let response;
    await act(async () => {
      response = await result.current.signup({ name: 'Test' });
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(response).toEqual({ message: 'Success' });
  });

  test('should handle failed signup', async () => {
    signupService.mockRejectedValueOnce(new Error('Signup failed'));
    const { result } = renderHook(() => useSignup());

    await act(async () => {
      try {
        await result.current.signup({});
      } catch (err) {
        expect(err.message).toBe('Signup failed');
      }
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Signup failed');
  });
});
