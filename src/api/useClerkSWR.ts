import useSWR from 'swr';
import { useAuth } from '@clerk/clerk-react';
import { api } from '@api';
import useSWRMutation from 'swr/mutation';

export default function useClerkSWR(url: string | undefined, opts?: unknown) {
  const { getToken } = useAuth();

  const fetcher = async (...args) => {
    return api(...args, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }).then((res) => res.data);
  };

  const postFetcher = async (url, { arg }) => {
    return api
      .post(url, arg, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      })
      .then((res) => res.data);
  };

  return { useSWR: useSWR(url, fetcher, opts), useSWRMutation: useSWRMutation(url, postFetcher) };
}
