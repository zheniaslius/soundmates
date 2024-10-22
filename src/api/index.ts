import axios from 'axios';
import useStore from '@store';

const VITE_SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;

export const api = axios.create({
  baseURL: VITE_SERVER_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetcher = (url: string) => {
  return api.get(url).then((res) => res.data);
};

export const postFetcher = (url: string, { arg }) => {
  return api
    .post(url, {
      ...(arg && { data: arg }),
    })
    .then((res) => res.data);
};
