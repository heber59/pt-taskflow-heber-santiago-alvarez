import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';
import { TaskProvider } from '@/context/TaskContext';
import { Task } from '@/types';
import React from 'react';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockTask: Task = {
  id: 1,
  todo: 'Test task',
  completed: false,
  userId: 1,
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <TaskProvider>
      {component}
    </TaskProvider>
  );
};

describe('TaskCard', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        todos: [mockTask],
        total: 1,
        skip: 0,
        limit: 10,
      }),
    });
  });

  it('should render task content', async () => {
    renderWithProvider(<TaskCard task={mockTask} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test task')).toBeInTheDocument();
    });
  });

  it('should show pending status by default', async () => {
    renderWithProvider(<TaskCard task={mockTask} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Pending/)).toBeInTheDocument();
    });
  });

  it('should show completed status when task is completed', async () => {
    const completedTask: Task = {
      ...mockTask,
      completed: true,
    };

    renderWithProvider(<TaskCard task={completedTask} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Completed/)).toBeInTheDocument();
    });
  });

  it('should have mark done button', async () => {
    renderWithProvider(<TaskCard task={mockTask} />);
    
    const button = screen.getByText(/Mark Done/);
    expect(button).toBeInTheDocument();
  });

  it('should have delete button', async () => {
    renderWithProvider(<TaskCard task={mockTask} />);
    
    const deleteButton = screen.getByRole('button', { name: '' });
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onStateChange when toggling task', async () => {
    const onStateChange = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        todos: [mockTask],
        total: 1,
        skip: 0,
        limit: 10,
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderWithProvider(
      <TaskCard task={mockTask} onStateChange={onStateChange} />
    );
    
    const markButton = screen.getByText(/Mark Done/);
    fireEvent.click(markButton);

    await waitFor(() => {
      expect(onStateChange).toHaveBeenCalled();
    });
  });
});
