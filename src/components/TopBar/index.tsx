import { UserIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import Sound from '@assets/icons/noun-sound-4888408.svg?react';
import { SheetTrigger } from '@components/ui/sheet';
import { Button } from '@components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import SpotifyLogIn from '@components/ui/buttons/SpotifyLogIn';

type Props = {};

const TopBar = (props: Props) => {
  const { isSignedIn, signOut } = useAuth();

  return (
    <nav className="container mx-auto flex justify-between py-8">
      <Sound className="h-12 fill-brand-lime " />
      {!isSignedIn ? (
        <SpotifyLogIn />
      ) : (
        <div className="flex items-center">
          <SheetTrigger asChild>
            <Button variant={'ghost'}>
              <UserIcon height={22} />
            </Button>
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
