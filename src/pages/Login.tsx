import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Spotify from '@assets/spotify-2.svg?react';
import Sound from '@assets/noun-sound-4888408.svg?react';

const Login = () => {
  return (
    <Card className="card">
      <CardHeader className="text-center pt-0">
        <Sound className="h-16 w-16 fill-brand-lime mx-auto" />
        <CardTitle className="text-xl text-brand-gray-100">Login to HarmonyMatch</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <Button className="bg-brand-lime hover:bg-brand-lime hover:brightness-75">
          <Spotify className="w-5 h-5 fill-brand-spotiBlack" />
          <span className="text-brand-spotiBlack ml-2">
            <SignInButton />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Login;
