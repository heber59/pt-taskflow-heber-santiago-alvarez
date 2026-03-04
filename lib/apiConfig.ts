export const API_RETRY_COUNT = parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3', 10);
export const API_RETRY_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_RETRY_TIMEOUT || '3000', 10);
export const API_BASE_URL = 'https://dummyjson.com/todos';
