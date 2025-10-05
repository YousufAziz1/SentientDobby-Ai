import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function apiClient(token?: string) {
  const instance = axios.create({ baseURL, withCredentials: false });
  if (token) {
    instance.interceptors.request.use((config) => {
      const headers: AxiosRequestHeaders = (config.headers || {}) as AxiosRequestHeaders;
      headers['Authorization'] = `Bearer ${token}`;
      config.headers = headers;
      return config;
    });
  }
  return instance;
}
