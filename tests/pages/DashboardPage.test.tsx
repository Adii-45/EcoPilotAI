import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../../src/pages/DashboardPage';
import { useStore } from '../../src/store/store';

// Mock the store
vi.mock('../../src/store/store', () => ({
  useStore: vi.fn(),
}));

describe('DashboardPage', () => {
  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    sustainabilityScore: 75,
    streak: 5,
    totalCarbonSaved: 10.5,
    level: 3,
  };

  const mockHabits = [
    {
      id: 'habit-1',
      title: 'Use Reusable Bag',
      completedToday: false,
      xpReward: 10,
      co2SavingsKg: 0.5,
      difficulty: 'Easy',
    },
    {
      id: 'habit-2',
      title: 'Bike to Work',
      completedToday: true,
      xpReward: 50,
      co2SavingsKg: 2.0,
      difficulty: 'Hard',
    }
  ];

  const mockSimulation = {
    carUsage: 100,
    meatConsumption: 3,
    energyEfficiency: 50,
    shoppingFrequency: 50,
  };

  beforeEach(() => {
    // Default mock implementation
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const state = {
        user: mockUser,
        habits: mockHabits,
        simulation: mockSimulation,
        completeHabit: vi.fn(),
      };
      return selector(state);
    });
  });

  it('renders user greeting correctly', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Good morning, Test User!/i)).toBeInTheDocument();
  });

  it('displays the sustainability score', () => {
    render(<DashboardPage />);
    // Our score is 75
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText(/\/100/i)).toBeInTheDocument();
  });

  it('displays the active mission card', () => {
    render(<DashboardPage />);
    expect(screen.getByText("Today's Eco Mission")).toBeInTheDocument();
    expect(screen.getByText("Daily Eco Warrior")).toBeInTheDocument();
  });

  it('renders habits and their completion status', () => {
    render(<DashboardPage />);
    
    // Uncompleted habit
    expect(screen.getByText('Use Reusable Bag')).toBeInTheDocument();
    
    // Completed habit
    const completedHabit = screen.getByText('Bike to Work');
    expect(completedHabit).toBeInTheDocument();
    expect(completedHabit).toHaveClass('line-through'); // Check if it gets the completed styling
  });

  it('shows total XP earned today', () => {
    render(<DashboardPage />);
    // habit-2 is completed and gives 50 XP
    expect(screen.getByText(/Total Earned Today: 50 XP/i)).toBeInTheDocument();
  });

  it('displays correct dynamic insight for high car usage', () => {
    // Override simulation for high car usage
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      return selector({
        user: mockUser,
        habits: mockHabits,
        simulation: { ...mockSimulation, carUsage: 200 },
        completeHabit: vi.fn(),
      });
    });

    render(<DashboardPage />);
    expect(screen.getByText(/Transportation contributes most of your footprint/i)).toBeInTheDocument();
  });

  it('displays correct dynamic insight for high meat consumption', () => {
    // Override simulation for high meat consumption, car usage must be <= 150
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      return selector({
        user: mockUser,
        habits: mockHabits,
        simulation: { ...mockSimulation, carUsage: 100, meatConsumption: 6 },
        completeHabit: vi.fn(),
      });
    });

    render(<DashboardPage />);
    expect(screen.getByText(/Reducing meat consumption could significantly lower emissions/i)).toBeInTheDocument();
  });
});
