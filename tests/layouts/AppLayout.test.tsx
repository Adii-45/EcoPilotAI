import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from '../../src/layouts/AppLayout';

// Mock contexts and store
vi.mock('../../src/store/store', () => ({
  useStore: vi.fn().mockImplementation((selector) => {
    const state = {
      user: { id: 'user-1', name: 'Test User', level: 1 },
      notifications: [],
      habits: [],
      achievements: [],
      markNotificationRead: vi.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock('../../src/contexts/ThemeContext', () => ({
  useTheme: vi.fn().mockReturnValue({
    theme: 'light',
    toggleTheme: vi.fn(),
  }),
}));

describe('AppLayout Navigation', () => {
  it('renders sidebar navigation links correctly', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppLayout />
      </MemoryRouter>
    );

    // Main nav links
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /AI Coach/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Habit Tracker/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Impact Report/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Achievements/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Simulator/i })).toBeInTheDocument();
    
    // Additional links
    expect(screen.getByRole('link', { name: /Settings/i })).toBeInTheDocument();
  });

  it('renders user info in header', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Level 1')).toBeInTheDocument();
  });
});
