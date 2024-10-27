import UsersList from '@components/UsersList';
import TopBar from '@components/TopBar';
import { useClerkMutation } from '@api/useClerkSWR';
import Blob from '@components/Blob';
import { Sheet } from '@components/ui/sheet';
import { Canvas } from '@react-three/fiber';
import UpdateProfileSheet from '@components/UpdateProfileSheet';
import { useEffect } from 'react';

type Props = {};

const Home = (props: Props) => {
  const { data, error, isMutating: isLoading, trigger } = useClerkMutation('/users', 'get');
  const matches = data?.data?.matches?.matches;
  const users = isLoading ? Array.from(new Array(3)) : matches;

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <div className="relative">
      <Sheet>
        <TopBar />
        {!error && <UsersList data={users} isLoading={isLoading} />}
        <Canvas
          camera={{ position: [0.0, 0.0, 8.0] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            filter: 'blur(2px)',
          }}
        >
          <Blob />
        </Canvas>

        <UpdateProfileSheet />
      </Sheet>
    </div>
  );
};

export default Home;
