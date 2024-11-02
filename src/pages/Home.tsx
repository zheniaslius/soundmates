import UsersList from '@components/UsersList';
import TopBar from '@components/TopBar';
import { useClerkMutation } from '@api/useClerkSWR';
import Blob from '@components/Blob';
import { Sheet } from '@components/ui/sheet';
import { Canvas } from '@react-three/fiber';
import UpdateProfileSheet from '@components/UpdateProfileSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { useEffect, useState } from 'react';
import Profile from '@components/Profile';
import { useAuth } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import SpotifyLogIn from '@components/ui/buttons/SpotifyLogIn';
import FinishSignIn from '@components/modals/FinishSignIn';
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
} from '@components/ui/alert-dialog';

const PreventClick = ({ isPrevent, children, onClick }) => {
  return isPrevent ? (
    <div onClick={onClick}>
      <div className="container pointer-events-none">{children}</div>
    </div>
  ) : (
    <div className="container">{children}</div>
  );
};

const Home = () => {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const getUsersUrl = typeof isSignedIn === 'boolean' ? (false ? '/users' : '/users/preview') : null;
  const { data, error, isMutating: isLoading, trigger } = useClerkMutation(getUsersUrl, 'get');

  const matches = data?.data?.matches?.matches;
  const users = isLoading ? Array.from({ length: 3 }) : matches;
  const hasNoMatches = !isLoading && Array.isArray(matches) && matches.length === 0;

  const showFinishModal = location.pathname === '/finish-sign-in';

  useEffect(() => {
    trigger();
  }, [trigger, isSignedIn]);

  return (
    <div className="relative">
      <Canvas
        camera={{ position: [0.0, 0.0, 8.0] }}
        style={{
          position: 'fixed', // Change to 'fixed'
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          filter: 'blur(2px)',
        }}
      >
        <Blob color="#00ff00" />
      </Canvas>

      <Sheet>
        <TopBar />
        <PreventClick isPrevent={!isSignedIn} onClick={() => setShowModal(true)}>
          <Tabs defaultValue="matches">
            <TabsList className="mb-4 h-11">
              <TabsTrigger value="matches" className="text-lg">
                Matches
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-lg">
                My profile
              </TabsTrigger>
            </TabsList>
            <TabsContent value="matches" className="lg:pr-[80px]">
              {hasNoMatches ? (
                <div className="mb-7 flex items-center space-x-3">
                  <h1 className="text-4xl font-bold">No matches yet</h1>
                </div>
              ) : (
                !error && <UsersList data={users} isLoading={isLoading} />
              )}
            </TabsContent>
            <TabsContent value="profile" className="lg:pr-[80px]">
              <Profile />
            </TabsContent>
          </Tabs>
        </PreventClick>
        <UpdateProfileSheet />

        <AlertDialog open={showModal}>
          <AlertDialogContent className="min-h-52">
            <AlertDialogHeader>
              <AlertDialogTitle>Please sign in</AlertDialogTitle>
              <AlertDialogDescription>
                To use soundmates you need to connect your spotify account
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowModal(false)}>Cancel</AlertDialogCancel>
              <SpotifyLogIn />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <FinishSignIn open={showFinishModal} />
      </Sheet>
    </div>
  );
};

export default Home;
