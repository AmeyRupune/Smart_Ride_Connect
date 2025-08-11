import axios from 'axios';

const API_URL = 'https://localhost:5001/api'; // Update with your API URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/account/login', credentials),
  register: (userData) => api.post('/account/register', userData),
};

// Rides API
export const ridesAPI = {
  getAll: () => api.get('/rides'),
  getById: (id) => api.get(`/rides/${id}`),
  search: (params) => api.get('/rides/search', { params }),
  create: (rideData) => api.post('/rides', rideData),
  delete: (id) => api.delete(`/rides/${id}`),
  getMyRides: () => api.get('/rides/my-rides'),
};

// Bookings API
export const bookingsAPI = {
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getBookingsForRide: (rideId) => api.get(`/bookings/ride/${rideId}`),
};

// Emergency API
export const emergencyAPI = {
  triggerSOS: (sosData) => api.post('/emergency/sos', sosData),
  getSosLogById: (id) => api.get(`/emergency/logs/${id}`),
  getSosLogsByUser: (userId) => api.get(`/emergency/logs/user/${userId}`),
  getSosLogsByRide: (rideId) => api.get(`/emergency/logs/ride/${rideId}`),
};

export default api;