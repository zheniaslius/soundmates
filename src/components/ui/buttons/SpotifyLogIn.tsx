import { Button } from '@components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
import Spotify from '@assets/icons/spotify-2.svg?react';

type Props = {};

const SpotifyLogIn = (props: Props) => {
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
