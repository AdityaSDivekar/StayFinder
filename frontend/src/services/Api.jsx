import axios from 'axios';

const api = axios.create({
  // In development, this should be proxied by the Vite dev server.
  // In production, this will be handled by the Vercel rewrite rules.
  baseURL: '/api',
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      return Promise.reject({ ...error, isUnauthorized: true });
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

// ========== LISTINGS ==========

export const getAllListings = async (location = '', page = 1, limit = 8) => {
  try {
    const response = await api.get('/listings', {
      params: { location, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch listings');
  }
};
export const getListing = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response.data.data;
};

export const createListing = async (listingData) => {
  const response = await api.post('/listings', listingData);
  return response.data.data;
};

export const updateListing = async (id, listingData) => {
  const response = await api.put(`/listings/${id}`, listingData);
  return response.data.data;
};

export const deleteListing = async (id) => {
  const response = await api.delete(`/listings/${id}`);
  return response.data.data;
};

export const getMyListings = async () => {
  const response = await api.get('/listings/my-listings');
  return response.data.data;
};

// ========== BOOKINGS ==========

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data.data;
};

export const getUserBookings = async () => {
  const response = await api.get('/bookings');
  return response.data.data;
};

// ========== USER ==========
export const applyToBecomeHost = async () => {
  const response = await api.post('/user/apply-to-become-host');
  return response.data.data;
};
