import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Obligations from '../pages/obligations/Obligations';

// Mock dnd-kit core
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => <div data-testid="mock-dnd-context">{children}</div>,
  closestCenter: vi.fn(),
}));

// Mock dnd-kit sortable
vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }) => <div data-testid="mock-sortable-context">{children}</div>,
  rectSortingStrategy: {},
  arrayMove: (array, from, to) => array,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
  }),
}));

// Mock dnd-kit utilities
vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: vi.fn().mockReturnValue(''),
    },
  },
}));

// Mock notifications API
vi.mock('../../features/notifications/services/notificationAPI', () => ({
  createNotification: vi.fn().mockResolvedValue({}),
}));

describe('Obligation Tracker Frontend Tests', () => {
  const mockObligations = [
    {
      id: 'OBL-101',
      description: 'Deliver initial security assessment report',
      contractId: 'CON-884',
      dueDate: '2026-09-15',
      status: 'Pending',
      priority: 'High',
      assignedTo: 'Sangavi',
      progress: '20%',
      obligationType: 'Milestone Deliverable'
    },
    {
      id: 'OBL-102',
      description: 'Pay quarterly maintenance fee',
      contractId: 'CON-902',
      dueDate: '2026-08-30',
      status: 'Completed',
      priority: 'Medium',
      assignedTo: 'Sangavi',
      progress: '100%',
      obligationType: 'Payment Obligation'
    }
  ];

  beforeEach(() => {
    // Reset global fetch mock
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/obligations')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockObligations),
        });
      }
      return Promise.reject(new Error(`Unknown mock endpoint: ${url}`));
    });
  });

  it('should render Obligation Tracker title, controls, and obligation cards', async () => {
    render(<Obligations />);

    // Wait for dynamic API to resolve and load state
    await waitFor(() => {
      expect(screen.getByText('Deliver initial security assessment report')).toBeInTheDocument();
    });

    // Check header and stats count
    expect(screen.getByText('Obligation Tracking')).toBeInTheDocument();
    expect(screen.getByText('Pay quarterly maintenance fee')).toBeInTheDocument();

    // Verify search input is rendered
    expect(screen.getByPlaceholderText('Search contracts...')).toBeInTheDocument();
  });

  it('should filter obligations by search term', async () => {
    render(<Obligations />);

    await waitFor(() => {
      expect(screen.getByText('Deliver initial security assessment report')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search contracts...');
    fireEvent.change(searchInput, { target: { value: 'quarterly' } });

    // Assessment report should be hidden, maintenance fee should be visible
    expect(screen.queryByText('Deliver initial security assessment report')).not.toBeInTheDocument();
    expect(screen.getByText('Pay quarterly maintenance fee')).toBeInTheDocument();
  });

  it('should open and close the Add Obligation modal', async () => {
    render(<Obligations />);

    // Click "Add Obligation" button
    const addButton = screen.getByText('Add Obligation');
    fireEvent.click(addButton);

    // Modal elements should be visible
    expect(screen.getByText('Add New Obligation')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

    // Click Cancel/Close button
    const closeButton = screen.getByText('Cancel');
    fireEvent.click(closeButton);

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText('Add New Obligation')).not.toBeInTheDocument();
    });
  });
});
