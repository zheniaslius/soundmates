import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import Sound from '@assets/icons/noun-sound-4888408.svg?react';
import { SheetTrigger } from '@components/ui/sheet';
import { Button } from '@components/ui/button';
import { useAuth, useUser } from '@clerk/clerk-react';
import SpotifyLogIn from '@components/ui/buttons/SpotifyLogIn';
import { Avatar, AvatarImage } from '@components/ui/avatar';
import { useLocation } from 'react-router-dom';

const TopBar = () => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const showSpotifySignin = location.pathname !== '/search';

  return (
    <nav className="container mx-auto flex justify-between py-8">
      <a href="/">
        <Sound className="h-12 fill-brand-lime " />
      </a>
      {!isSignedIn && showSpotifySignin ? <SpotifyLogIn /> : null}
      {isSignedIn && (
        <div className="flex items-center space-x-3">
          <SheetTrigger asChild>
            <Avatar className="h-8 w-8 object-contain cursor-pointer hover:brightness-90 transition-all">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
          </SheetTrigger>
          <Button variant={'ghost'} onClick={() => signOut()}>
            <ArrowLeftStartOnRectangleIcon height={22} className="text-red-500" />
          </Button>
        </div>
      )}
    </nav>
  );
};

export default TopBar;
