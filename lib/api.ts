import { enviroment } from '@/config/enviroment/enviroment';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export const api = axios.create({
  baseURL: enviroment.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure automatic retries for idempotent requests
axiosRetry(api, {
  retries: enviroment.API_RETRY_COUNT,
  retryDelay: (retryCount) => {
    return retryCount * enviroment.API_RETRY_TIMEOUT;
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 500;
  },
});

export const API = {
  fetchTasks: async (limit: number, skip: number) => {
    const response = await api.get(`?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  addTask: async (todo: string, userId: number = 1) => {
    const response = await api.post('/add', {
      todo,
      completed: false,
      userId,
    });
    return response.data;
  },

  updateTask: async (id: number, completed: boolean) => {
    const response = await api.patch(`/${id}`, {
      completed,
    });
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};
