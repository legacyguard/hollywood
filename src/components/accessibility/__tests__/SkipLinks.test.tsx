import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkipLinks } from '../SkipLinks';

describe('SkipLinks Component', () => {
  it('renders default skip links', () => {
    render(<SkipLinks />);

    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    expect(screen.getByText('Skip to navigation')).toBeInTheDocument();
    expect(screen.getByText('Skip to search')).toBeInTheDocument();
  });

  it('renders custom skip links', () => {
    const customLinks = [
      { id: 'custom-1', label: 'Custom Link 1', href: '#custom-1' },
      { id: 'custom-2', label: 'Custom Link 2', href: '#custom-2' },
    ];

    render(<SkipLinks links={customLinks} />);

    expect(screen.getByText('Custom Link 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Link 2')).toBeInTheDocument();
  });

  it('handles click events correctly', () => {
    const scrollIntoViewMock = vi.fn();
    const focusMock = vi.fn();

    // Create a mock element
    const mockElement = document.createElement('div');
    mockElement.id = 'main-content';
    mockElement.scrollIntoView = scrollIntoViewMock;
    mockElement.focus = focusMock;
    document.body.appendChild(mockElement);

    // Mock querySelector to return our element
    const originalQuerySelector = document.querySelector;
    document.querySelector = vi.fn((selector) => {
      if (selector === '#main-content') {
        return mockElement;
      }
      return originalQuerySelector.call(document, selector);
    });

    render(<SkipLinks />);

    const mainContentLink = screen.getByText('Skip to main content');
    fireEvent.click(mainContentLink);

    expect(focusMock).toHaveBeenCalled();
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Cleanup
    document.body.removeChild(mockElement);
    document.querySelector = originalQuerySelector;
  });

  it('applies correct accessibility attributes', () => {
    render(<SkipLinks />);

    const nav = screen.getByRole('navigation', { name: 'Skip links' });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Skip links');
  });

  it('links are keyboard accessible', () => {
    render(<SkipLinks />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      // Links should be focusable
      expect(link.tabIndex).toBeGreaterThanOrEqual(-1);
    });
  });
});
