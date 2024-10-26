import UsersList from '@components/UsersList';
import TopBar from '@components/TopBar';
import useClerkSWR from '@api/useClerkSWR';
import Blob from '@components/Blob';
import { Canvas } from '@react-three/fiber';

type Props = {};

const Home = (props: Props) => {
  const { useSWR } = useClerkSWR('/users', {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { data, error, isLoading } = useSWR;
  const matches = data?.data?.matches?.matches;
  const users = isLoading ? Array.from(new Array(3)) : matches;

  return (
    <div className="relative">
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
        }}
      >
        <Blob />
      </Canvas>
    </div>
  );
};

export default Home;
