import axios from 'axios';
import useStore from '@store';

const VITE_SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;

export const api = axios.create({
  baseURL: VITE_SERVER_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});
