const enviroment = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  ITEMS_PER_PAGE: parseInt(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || '', 10),
  API_RETRY_COUNT: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '', 10),
  API_RETRY_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_RETRY_TIMEOUT || '', 10),
  DEBOUNCE_MS: parseInt(process.env.NEXT_PUBLIC_DEBOUNCE_MS || '', 10),
  TOTAL_STARS: 25,
};

export { enviroment };
