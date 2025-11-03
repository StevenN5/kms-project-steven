import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  
  if (userInfo) {
    try {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo?.token) {
        config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
      }
    } catch (error) {
      console.error('Error parsing userInfo:', error);
      localStorage.removeItem('userInfo');
    }
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;