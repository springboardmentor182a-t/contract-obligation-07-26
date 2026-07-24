import { renderHook, act } from '@testing-library/react';
import { useVerifyPassword } from './useVerifyPassword';

describe('useVerifyPassword hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  test('should verify valid password', async () => {
    const { result } = renderHook(() => useVerifyPassword());
    
    let isValid;
    act(() => {
      result.current.verifyPassword('longpassword').then(res => { isValid = res; });
    });
    
    expect(result.current.isVerifying).toBe(true);
    
    await act(async () => {
      jest.runAllTimers();
    });
    
    expect(result.current.isVerifying).toBe(false);
    expect(isValid).toBe(true);
  });

  test('should fail short password', async () => {
    const { result } = renderHook(() => useVerifyPassword());
    
    let isValid;
    act(() => {
      result.current.verifyPassword('short').then(res => { isValid = res; });
    });
    
    await act(async () => {
      jest.runAllTimers();
    });
    
    expect(isValid).toBe(false);
  });
});
