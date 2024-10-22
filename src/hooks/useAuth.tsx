import { createContext, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '@store';
import { getSpotifyApiInstance } from '@api/spotify';

const AuthContext = createContext(null); // Initialize context with `null` to avoid undefined access errors

export const AuthProvider = ({ children }) => {
  const { setStore, user, isAuthenticated, isLoading } = useStore();
  const navigate = useNavigate();

  const login = async (data) => {
    setStore({ user: data, isAuthenticated: true });
    navigate('/home', { replace: true });
  };

  const logout = () => {
    setStore({ user: null, isAuthenticated: false });
    navigate('/', { replace: true });
  };

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      user,
      login,
      logout,
    }),
    [isAuthenticated, user, isLoading] // Added `isAuthenticated` to dependencies
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
