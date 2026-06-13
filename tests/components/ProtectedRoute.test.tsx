import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import * as AuthContextModule from '../../src/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate-to">{to}</div>),
    Outlet: vi.fn(() => <div data-testid="outlet" />),
    useLocation: vi.fn(() => ({ pathname: '/protected' }))
  };
});

describe('ProtectedRoute', () => {
  it('renders loading spinner when loading is true', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ loading: true, currentUser: null, logout: vi.fn() } as any);
    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute />
      </BrowserRouter>
    );
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('navigates to login when user is not authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ loading: false, currentUser: null, logout: vi.fn() } as any);
    const { getByTestId } = render(
      <BrowserRouter>
        <ProtectedRoute />
      </BrowserRouter>
    );
    expect(getByTestId('navigate-to')).toHaveTextContent('/login');
  });

  it('renders outlet when user is authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ loading: false, currentUser: { uid: '123' }, logout: vi.fn() } as any);
    const { getByTestId } = render(
      <BrowserRouter>
        <ProtectedRoute />
      </BrowserRouter>
    );
    expect(getByTestId('outlet')).toBeInTheDocument();
  });
});
