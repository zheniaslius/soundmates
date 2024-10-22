import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useAuth, UserButton } from '@clerk/clerk-react';
import useStore from '@store';
import { useEffect } from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const TokenProvider = () => {
  const { isSignedIn } = useAuth();
  const { user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      navigate('/dashboard');
      return;
    }
    if (isSignedIn) {
      navigate('/finish-sign-in');
    }
  }, [isSignedIn, navigate, user]);

  return null;
};

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <TokenProvider />
      <Outlet />
    </ClerkProvider>
  );
}
