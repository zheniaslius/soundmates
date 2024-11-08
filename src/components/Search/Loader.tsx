import { Skeleton } from '@components/ui/skeleton';

const skeletonArray = Array.from({ length: 15 });

const Loader = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:w-3/4">
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
