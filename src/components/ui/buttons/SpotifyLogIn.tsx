import { Button } from '@components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import Spotify from '@assets/icons/spotify-2.svg?react';

const SpotifyLogIn = () => {
  return (
    <SignInButton>
      <Button className="bg-brand-lime hover:bg-brand-lime hover:brightness-75 transition-all">
        <Spotify className="w-5 h-5 fill-brand-spotiBlack" />
        <span className="text-brand-spotiBlack ml-2">Sign in</span>
      </Button>
    </SignInButton>
  );
};

export default SpotifyLogIn;
