import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Outlet, useNavigate } from 'react-router-dom';
import useStore from '@store';

export default function DashboardLayout() {
  const { isSignedIn } = useAuth();
  const { user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      navigate('/');
      return;
    }
    if (isSignedIn) {
      navigate('/finish-sign-in');
    }
  }, [isSignedIn, navigate, user]);

  return <Outlet />;
}
