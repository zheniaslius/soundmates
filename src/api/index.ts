import axios from 'axios';

const VITE_SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;

export const api = axios.create({
  baseURL: VITE_SERVER_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});
