import { useAuth } from '@clerk/clerk-react';
import { api } from '@api';
import useSWRMutation from 'swr/mutation';

export function useClerkMutation(
  url: string | null,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' = 'post'
) {
  const { getToken } = useAuth();

  const fetcher = async (url: string | null, { arg }) => {
    const token = await getToken();
    const headers = { Authorization: `Bearer ${token}` };

    if (method === 'get') {
      // For GET requests
      return api
        .get(url, {
          headers,
          ...(arg && { params: arg }),
        })
        .then((res) => res.data);
    } else {
      // For POST, PUT, DELETE, PATCH
      return api[method](url, arg, { headers }).then((res) => res.data);
    }
  };

  return useSWRMutation(url, fetcher);
}
