import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// This will add interceptors to the axios instance
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
instance.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios Error:', {
            config: error.config,
            response: error.response,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default instance; 