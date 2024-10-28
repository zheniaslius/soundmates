import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { ITokens } from './types';
import { AccessToken } from '@spotify/web-api-ts-sdk';

type Store = {
  user: null;
  accessToken?: AccessToken;
  audioUrl?: string;
  setUser: (user: unknown) => void;
  setToken: (accessToken: AccessToken) => void;
};

const useStore = create<Store>(
  devtools(
    persist(
      (set) => ({
        accessToken: {},
        user: null,
        audioUrl: null,

        setAudioUrl: (url) => set({ audioUrl: url }),
        setUser: (user) => set(() => ({ user })),
        setToken: (accessToken) => set(() => ({ accessToken })),
        setStore: (newState) => set((state) => ({ ...state, ...newState })),
      }),
      {
        name: 'user-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )
);

export default useStore;
