const API_BASE = 'https://dummyjson.com';

export const API = {
  /**
   * Fetch paginated tasks
   */
  fetchTasks: async (limit: number, skip: number) => {
    const response = await fetch(`${API_BASE}/todos?limit=${limit}&skip=${skip}`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  /**
   * Add a new task
   */
  addTask: async (todo: string, userId: number = 1) => {
    const response = await fetch(`${API_BASE}/todos/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo, completed: false, userId }),
    });
    if (!response.ok) throw new Error('Failed to add task');
    return response.json();
  },

  /**
   * Update task completion status
   */
  updateTask: async (id: number, completed: boolean) => {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: number) => {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.json();
  },
};
