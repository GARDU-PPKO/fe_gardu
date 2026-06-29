import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://165.232.166.139:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

export default api;
