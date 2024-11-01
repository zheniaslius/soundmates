import { Skeleton } from '@components/ui/skeleton';

type Props = {};

const skeletonArray = Array.from({ length: 20 });

const Loader = (props: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 lg:w-3/4">
      {skeletonArray.map((_, idx) => (
        <div key={idx} className="relative">
          <Skeleton className="w-full h-[160px] lg:h-[200px] rounded-lg" />
          <Skeleton className="mt-2 h-4 w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
};

export default Loader;
