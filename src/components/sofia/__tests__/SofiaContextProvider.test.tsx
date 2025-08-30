// Sofia Context Provider Integration Tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClerkProvider } from '@clerk/clerk-react';
import SofiaContextProvider, { usePersonalityManager } from '../SofiaContextProvider';
import { useSofiaStore } from '@/stores/sofiaStore';

// Mock dependencies
vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    userId: 'test-user-123',
  }),
  useUser: () => ({
    user: {
      firstName: 'Test',
      fullName: 'Test User',
    },
  }),
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/dashboard',
  }),
}));

vi.mock('@/contexts/LocalizationContext', () => ({
  useLocalization: () => ({
    languageCode: 'en',
  }),
}));

vi.mock('@/stores/sofiaStore', () => ({
  useSofiaStore: vi.fn(),
}));

vi.mock('@/lib/path-of-serenity', () => ({
  calculateUnlockedMilestones: () => ({
    milestones: [
      { id: 'test', name: 'Test Milestone', isUnlocked: true },
    ],
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SofiaContextProvider', () => {
  let mockSetContext: ReturnType<typeof vi.fn>;
  let mockUpdateContext: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSetContext = vi.fn();
    mockUpdateContext = vi.fn();

    (useSofiaStore as any).mockReturnValue({
      setContext: mockSetContext,
      updateContext: mockUpdateContext,
    });

    localStorageMock.getItem.mockReturnValue(null);
  });

  const TestComponent = () => {
    return <div data-testid="test-child">Test Child</div>;
  };

  it('should render children correctly', () => {
    render(
      <SofiaContextProvider>
        <TestComponent />
      </SofiaContextProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should initialize Sofia context with personality data', () => {
    render(
      <SofiaContextProvider>
        <TestComponent />
      </SofiaContextProvider>
    );

    expect(mockSetContext).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'test-user-123',
        userName: 'Test',
        documentCount: 0,
        guardianCount: 0,
        personality: expect.objectContaining({
          mode: 'adaptive',
          currentStyle: 'balanced',
          userPreferences: expect.objectContaining({
            adaptationEnabled: true,
          }),
        }),
      })
    );
  });

  it('should handle document uploaded events with personality tracking', () => {
    localStorageMock.getItem
      .mockReturnValueOnce('[]') // documents
      .mockReturnValueOnce('[]'); // guardians

    render(
      <SofiaContextProvider>
        <TestComponent />
      </SofiaContextProvider>
    );

    // Simulate document upload event
    const event = new Event('documentUploaded');
    window.dispatchEvent(event);

    expect(mockUpdateContext).toHaveBeenCalledWith(
      expect.objectContaining({
        personality: expect.objectContaining({
          mode: 'adaptive',
        }),
      })
    );
  });

  it('should handle guardian added events with personality tracking', () => {
    localStorageMock.getItem
      .mockReturnValueOnce('[]') // documents
      .mockReturnValueOnce('[]'); // guardians

    render(
      <SofiaContextProvider>
        <TestComponent />
      </SofiaContextProvider>
    );

    // Simulate guardian added event
    const event = new Event('guardianAdded');
    window.dispatchEvent(event);

    expect(mockUpdateContext).toHaveBeenCalledWith(
      expect.objectContaining({
        personality: expect.objectContaining({
          mode: 'adaptive',
        }),
      })
    );
  });
});

describe('usePersonalityManager', () => {
  const TestComponentWithHook = () => {
    const personalityManager = usePersonalityManager();
    return (
      <div data-testid="personality-manager">
        {personalityManager ? 'Manager Available' : 'No Manager'}
      </div>
    );
  };

  it('should provide personality manager when user is authenticated', () => {
    render(<TestComponentWithHook />);

    expect(screen.getByTestId('personality-manager')).toHaveTextContent('Manager Available');
  });

  it('should return null when no user is authenticated', () => {
    // Mock no user
    vi.mocked(require('@clerk/clerk-react').useAuth).mockReturnValue({
      userId: null,
    });

    render(<TestComponentWithHook />);

    expect(screen.getByTestId('personality-manager')).toHaveTextContent('No Manager');
  });
});
