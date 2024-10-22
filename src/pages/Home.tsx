import UsersList from '@components/UsersList';
import TopBar from '@components/TopBar';
import useClerkSWR from '@api/useClerkSWR';

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
    <div>
      <TopBar />
      {!error && <UsersList data={users} isLoading={isLoading} />}
    </div>
  );
};

export default Home;
