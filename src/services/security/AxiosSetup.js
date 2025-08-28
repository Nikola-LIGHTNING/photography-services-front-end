import axios from 'axios';

// Add JWT token to all requests automatically
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses by clearing invalid tokens. This covers token expiration as well.
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get 401 Unauthorized, clear the stored token
    if (error.response && error.response.status === 401) {
      console.warn('Received 401 - clearing stored JWT token');
      sessionStorage.removeItem('jwtToken');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 

// Shared HTTP request helper using the configured axios instance
export async function request(method, url, data) {
  try {
    const response = await axios({ method, url, data });
    return response;
  } catch (error) {
    return error.response || { message: error.message || 'Network or request error', config: error.config };
  }
}