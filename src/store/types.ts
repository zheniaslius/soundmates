export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  photo: string;
  provider: string;
  verified: string;
}

export interface ITokens {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}
