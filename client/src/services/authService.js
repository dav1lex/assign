import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await authAxios.post('/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  },
  
  register: async (email, password) => {
    const response = await authAxios.post('/register', { email, password });
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await authAxios.get('/verify');
    return response.data;
  }
};