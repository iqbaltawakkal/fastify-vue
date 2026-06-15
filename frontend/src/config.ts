import axios from 'axios';
import router from './router';
import { useAuthStore } from '@/stores/auth';

axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
    config.baseURL = 'http://localhost:3000/api/v1';
    const token = localStorage.getItem('auth_token');
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';
    return config;
});

axios.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => {
        const res = error.response;
        if (res?.status === 401 || res?.status === 403) {
            const authStore = useAuthStore();
            authStore.logout();
            router.push('/login');
        }
        return Promise.reject(error);
    }
);
