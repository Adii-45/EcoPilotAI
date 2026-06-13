import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SimulatorPage from '../../src/pages/SimulatorPage';
import { useStore } from '../../src/store/store';

vi.mock('../../src/store/store', () => ({
  useStore: vi.fn(),
}));

describe('SimulatorPage', () => {
  const mockSimulation = {
    carUsage: 100,
    meatConsumption: 3,
    energyEfficiency: 50,
    shoppingFrequency: 50,
  };
  const mockUpdateSimulation = vi.fn();

  beforeEach(() => {
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const state = {
        simulation: mockSimulation,
        updateSimulation: mockUpdateSimulation,
        applySimulation: vi.fn(),
      };
      return selector(state);
    });
  });

  it('renders correctly with simulation data', () => {
    render(<SimulatorPage />);
    expect(screen.getByText('Future Impact Simulator')).toBeInTheDocument();
    expect(screen.getByText('100 miles/wk')).toBeInTheDocument();
  });

  it('updates slider value when interacted with', () => {
    render(<SimulatorPage />);
    
    const carSlider = screen.getByLabelText('Car Usage', { selector: 'input[type="range"]' });
    fireEvent.change(carSlider, { target: { value: '200' } });

    // The displayed value should update
    expect(screen.getByText('200 miles/wk')).toBeInTheDocument();
  });

  it('applies scenario presets correctly', () => {
    render(<SimulatorPage />);
    
    // Click 'Car-Free'
    const carFreeBtn = screen.getByRole('button', { name: '🚲 Car-Free' });
    fireEvent.click(carFreeBtn);

    // Car usage should be 0 miles/wk
    expect(screen.getByText('0 miles/wk')).toBeInTheDocument();
  });
});
