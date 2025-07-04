import axios from 'axios';
import useAuthStore from '@/store/authStore';

const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
})
let isRefreshing = false;

// Queue for requests that fail during token refresh
let failedQueue: any[] = [];

/**
 * Retry all requests waiting in the queue after refresh token is done
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
};

/**
 * Interceptor for handling token expiration (401 errors)
 */
api.interceptors.response.use(
  response => response, // if no error, return response
  async error => {
    const originalRequest = error.config;

    // If the response is a 401 (unauthorized) and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // mark request as retried

      // If a refresh is already happening, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest)) // retry original request after refresh
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Get role (user, trainer, stadium_owner) from Zustand store
        const { role } = useAuthStore.getState();
        const refreshUrl = `/${role}/auth/refresh-token`; // construct refresh URL

        // Send refresh request (cookies already included)
        await api.post(refreshUrl);

        // Retry all queued requests
        processQueue(null, null);

        // Retry the original failed request
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, reject all queued requests and log out
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false; // Reset flag
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);




export default api;
