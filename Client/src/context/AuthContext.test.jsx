import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { getUsers } from '../features/authentication/services/getUsers';

jest.mock('../features/authentication/services/getUsers', () => ({
  getUsers: jest.fn()
}));

const TestComponent = () => {
  const { userProfile, loading, login, logout, refreshProfile } = useAuth();
  if (loading) return <div data-testid="loading">Loading...</div>;
  return (
    <div>
      <span data-testid="user">{userProfile ? userProfile.name : 'No User'}</span>
      <button onClick={() => login({ name: 'New User' })}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={refreshProfile}>Refresh</button>
    </div>
  );
};

describe('AuthContext', () => {
  let originalLocation;

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  });

  test('fetches profile on mount if token exists', async () => {
    window.localStorage.setItem('access_token', 'fake-token');
    getUsers.mockResolvedValueOnce({ name: 'Fetched User' });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId('user').textContent).toBe('Fetched User'));
    expect(getUsers).toHaveBeenCalled();
  });

  test('sets user to null if no token exists on mount', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId('user').textContent).toBe('No User'));
    expect(getUsers).not.toHaveBeenCalled();
  });

  test('login function updates user profile', async () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId('user').textContent).toBe('No User'));
    
    act(() => {
      getByText('Login').click();
    });

    expect(getByTestId('user').textContent).toBe('New User');
  });

  test('logout function clears storage and redirects', async () => {
    window.localStorage.setItem('access_token', 'fake-token');
    getUsers.mockResolvedValueOnce({ name: 'Fetched User' });

    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => expect(getByTestId('user').textContent).toBe('Fetched User'));

    act(() => {
      try {
        getByText('Logout').click();
      } catch (e) {
        // Ignore jsdom navigation error
      }
    });

    expect(window.localStorage.getItem('access_token')).toBeNull();
  });
});
