import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse extends LoginResponse {}

interface ApiResponse<T> {
  status: string;
  token?: string;
  data?: {
    user?: User;
  };
  message?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<ApiResponse<User>>('/auth/login', { email, password });
    // Backend returns { status: 'success', token, data: { user } }
    return {
      token: response.data.token || '',
      user: response.data.data?.user || { id: '', name: '', email: '', role: '' }
    };
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('An error occurred during login');
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<ApiResponse<User>>('/auth/register', { name, email, password, role });
    // Backend returns { status: 'success', token, data: { user } }
    return {
      token: response.data.token || '',
      user: response.data.data?.user || { id: '', name: '', email: '', role: '' }
    };
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('An error occurred during registration');
  }
};

export const getDashboard = async (role: string) => {
  try {
    const response = await api.get(`/dashboard/${role}`);
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }
    throw error;
  }
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: any) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}; 