import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://rentrack.site/api',
  headers: {
    Accept: 'application/json',
  },
});

export default api;
