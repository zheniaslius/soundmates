import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';
import { Skeleton } from '@components/ui/skeleton';
import { TabsList, TabsTrigger } from '@components/ui/tabs';
import { UsersIcon, MusicalNoteIcon } from '@heroicons/react/20/solid';

const SkeletonCard = () => {
  return (
    <div className="flex justify-items-center min-h-[455px]">
      <div className="relative basis-1/2 pointer-events-none">
        <div className="img">
          <div className="relative z-0 h-full w-full object-cover" />
        </div>
      </div>
      <div className="relative text-left flex flex-col py-8 -ml-14">
        <div className="flex flex-col">
          <div className="mb-2 font-semibold">
            <span>Favorite genres</span>
          </div>
          <ol className="text-left flex gap-4 text-xs pb-3 mb-5">
            <Skeleton className="rounded-full w-20 h-6"></Skeleton>
            <Skeleton className="rounded-full w-20 h-6"></Skeleton>
            <Skeleton className="rounded-full w-20 h-6"></Skeleton>
          </ol>
        </div>
        <div className="mb-5">
          <TabsList className="mb-2">
            <TabsTrigger value="matches">
              <UsersIcon height={16} className="mr-1" />
              You both listen
            </TabsTrigger>
            <TabsTrigger value="songs">
              <MusicalNoteIcon height={16} className="mr-1" />
              Top songs
            </TabsTrigger>
          </TabsList>
          <Carousel
            opts={{
              align: 'start',
              watchDrag: false,
            }}
            className="max-w-80"
          >
            <CarouselContent>
              {Array.from(new Array(3)).map((_, index) => (
                <CarouselItem key={index} className="lg:basis-1/2">
                  <Skeleton className="w-full aspect-square object-cover mb-1.5" />
                  <Skeleton className="rounded-full h-5 w-20 mt-2" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="mx-auto mt-auto">
          <Skeleton className="flex items-center rounded-full  h-[52px] w-[210px]" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
