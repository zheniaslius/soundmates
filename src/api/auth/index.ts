import { api } from '../index';

const signIn = (data: unknown, token: string | null) =>
  api.post('/auth/sign-in', data, { headers: { Authorization: 'Bearer ' + token } }).then((res) => res.data);

export default signIn;
