import axios from 'axios';
import { environment } from './environment';

// Create axios instance with base URL
const api = axios.create({
  baseURL: environment.baseUrl,
  timeout: 100000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 