import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.unmock('../../src/contexts/AuthContext');

import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';
import { auth } from '../../src/services/firebase';
import { signOut } from 'firebase/auth';

// Mock firebase auth module methods
vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...actual,
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((_auth, callback) => {
      // Call with no user initially
      callback(null);
      return () => {}; // unsubscribe function
    })
  };
});

function AuthConsumer() {
  const { currentUser, loading, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <span data-testid="user-id">{currentUser ? currentUser.uid : 'No User'}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides loading state initially, then null user', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-id')).toHaveTextContent('No User');
  });

  it('calls signOut on logout', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    const logoutBtn = screen.getByRole('button', { name: 'Logout' });
    await act(async () => {
      logoutBtn.click();
    });
    expect(signOut).toHaveBeenCalledWith(auth);
  });
});
