import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '@components/TaskForm';
import { TaskProvider } from '@/context/tasks';
import React from 'react';
import '@testing-library/jest-dom';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <TaskProvider>
      {component}
    </TaskProvider>
  );
};

describe('TaskForm', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        todos: [],
        total: 0,
        skip: 0,
        limit: 10,
      }),
    });
  });

  it('should render form inputs', () => {
    renderWithProvider(<TaskForm />);

    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show error when input is empty', async () => {
    renderWithProvider(<TaskForm />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Task must be at least 2 characters.')).toBeInTheDocument();
    });
  });

  it('should add task on submit', async () => {
    renderWithProvider(<TaskForm />);

    const input = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'New test task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
    });

    expect(input).toHaveValue('');
  });

  it('should clear input after successful submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        todos: [],
        total: 0,
        skip: 0,
        limit: 10,
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderWithProvider(<TaskForm />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
