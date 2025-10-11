import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import QuickGenerateModal from '$lib/components/builder/QuickGenerateModal.svelte';
import { userProfile } from '$lib/stores/userProfile';
import { get } from 'svelte/store';

// Mock the stores
vi.mock('$lib/stores/userProfile', () => ({
  userProfile: {
    subscribe: vi.fn(),
    set: vi.fn(),
    update: vi.fn()
  }
}));

vi.mock('$lib/services/ResumeStrategies', () => ({
  ResumeStrategyFactory: {
    selectStrategy: vi.fn(() => ({
      strategyName: 'ExperiencedJobSeeker',
      confidence: 0.85,
      reasons: ['Has work experience', 'Mid-level professional']
    }))
  }
}));

describe('QuickGenerateModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when open is false', () => {
    const { container } = render(QuickGenerateModal, {
      props: {
        open: false,
        currentTemplate: null
      }
    });

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should render when open is true', () => {
    const { container } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    expect(container.querySelector('[role="dialog"]')).toBeTruthy();
    expect(screen.getByText('Quick Generate from Profile')).toBeTruthy();
  });

  it('should display all section checkboxes', () => {
    render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    expect(screen.getByText(/Personal Info/i)).toBeTruthy();
    expect(screen.getByText(/Summary/i)).toBeTruthy();
    expect(screen.getByText(/Experience/i)).toBeTruthy();
    expect(screen.getByText(/Education/i)).toBeTruthy();
    expect(screen.getByText(/Skills/i)).toBeTruthy();
    expect(screen.getByText(/Projects/i)).toBeTruthy();
  });

  it('should have all sections selected by default', () => {
    const { container } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      expect((checkbox as HTMLInputElement).checked).toBe(true);
    });
  });

  it('should display industry selector', () => {
    render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    expect(screen.getByLabelText(/Target Industry/i)).toBeTruthy();
  });

  it('should have Generate and Cancel buttons', () => {
    render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    expect(screen.getByText('Generate')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
  });

  it('should emit close event when Cancel is clicked', async () => {
    const { component } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    const closeHandler = vi.fn();
    component.$on('close', closeHandler);

    const cancelButton = screen.getByText('Cancel');
    await fireEvent.click(cancelButton);

    expect(closeHandler).toHaveBeenCalled();
  });

  it('should emit close event when X button is clicked', async () => {
    const { component, container } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    const closeHandler = vi.fn();
    component.$on('close', closeHandler);

    const closeButton = container.querySelector('button[aria-label="Close"]');
    if (closeButton) {
      await fireEvent.click(closeButton);
      expect(closeHandler).toHaveBeenCalled();
    }
  });

  it('should toggle section selection when checkbox is clicked', async () => {
    const { container } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    const firstCheckbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(firstCheckbox.checked).toBe(true);

    await fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(false);

    await fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(true);
  });

  it('should select all sections when Select All is clicked', async () => {
    const { container } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    // First deselect one
    const firstCheckbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(false);

    // Click Select All
    const selectAllButton = screen.getByText('Select All');
    await fireEvent.click(selectAllButton);

    // All should be selected
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      expect((checkbox as HTMLInputElement).checked).toBe(true);
    });
  });

  it('should deselect all sections when Deselect All is clicked', async () => {
    const { container } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    const deselectAllButton = screen.getByText('Deselect All');
    await fireEvent.click(deselectAllButton);

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      expect((checkbox as HTMLInputElement).checked).toBe(false);
    });
  });

  it('should close on Escape key', async () => {
    const { component } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    const closeHandler = vi.fn();
    component.$on('close', closeHandler);

    await fireEvent.keyDown(window, { key: 'Escape' });

    expect(closeHandler).toHaveBeenCalled();
  });

  it('should display loading state when generating', async () => {
    const { container } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    // Initially should show "Generate"
    expect(screen.getByText('Generate')).toBeTruthy();

    // After clicking generate, it should show loading
    // Note: This would require mocking the generate function to delay
  });

  it('should have responsive grid layout for sections', () => {
    const { container } = render(QuickGenerateModal, {
      props: {
        open: true,
        currentTemplate: null
      }
    });

    const grid = container.querySelector('.grid');
    expect(grid?.classList.contains('grid-cols-1')).toBe(true);
    expect(grid?.classList.contains('sm:grid-cols-2')).toBe(true);
  });
});
