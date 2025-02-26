// axiosConfig.ts
import axios from 'axios';
import { BASE_API_URL } from '@/routes/routes';

const api = axios.create({
  baseURL: BASE_API_URL,
});

export default api;
