import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Spotify from '@assets/icons/spotify-2.svg?react';
import Sound from '@assets/icons/noun-sound-4888408.svg?react';
import { SignInButton } from '@clerk/clerk-react';
import SpotifyLogIn from '@components/ui/buttons/SpotifyLogIn';

const Login = () => {
  return (
    <Card className="card">
      <CardHeader className="text-center pt-0">
        <Sound className="h-16 w-16 fill-brand-lime mx-auto" />
        <CardTitle className="text-xl text-brand-gray-100">Login to HarmonyMatch</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <SpotifyLogIn />
      </CardContent>
    </Card>
  );
};

export default Login;
