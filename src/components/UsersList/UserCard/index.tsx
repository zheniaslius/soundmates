import { MessageSquare } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';

const UserCard = ({ data, mouseEvents }) => {
  const user = data?._id;
  const photo = user?.images?.find((i) => i.url?.includes('height=300'));

  return (
    <div className="flex justify-items-center">
      <div className="relative basis-1/2 pointer-events-none">
        <div className="img">
          <img src={photo?.url} className="relative z-0 h-full object-cover" />
          <div className="gradient-overlay absolute inset-0"></div>
        </div>
      </div>
      <div className="relative text-left flex flex-col py-8 -ml-14">
        <div className="flex flex-col">
          <div className="mb-2 font-semibold">
            <span>Favorite genres</span>
          </div>
          <ol
            className="text-left flex gap-4 text-xs pb-3 mb-5 text-gray-400 max-w-72 overflow-x-scroll"
            onMouseEnter={mouseEvents.none.onMouseEnter}
            onMouseLeave={mouseEvents.none.onMouseLeave}
            onMouseMove={mouseEvents.none.onMouseMove}
          >
            {user?.topGenres?.map((genre: { count: number; genre: string }) => (
              <li className="bg-gray-500 bg-opacity-20	px-3 py-1 rounded-2xl backdrop-blur-sm">
                <span className="whitespace-nowrap text-nowrap">{genre?.genre}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mb-5">
          <div className="mb-2 font-semibold">
            <span>You both listen to</span>
          </div>
          <Carousel
            opts={{
              align: 'start',
              watchDrag: false,
            }}
            className="max-w-80"
          >
            <CarouselContent>
              {data?.matchingArtists?.map((artist, index) => (
                <CarouselItem key={artist.id} className="lg:basis-1/3">
                  <img
                    src={artist.images?.[2]?.url}
                    className="w-full aspect-square object-cover"
                    onMouseEnter={mouseEvents.play.onMouseEnter}
                    onMouseLeave={mouseEvents.play.onMouseLeave}
                    onMouseMove={mouseEvents.play.onMouseMove}
                  />
                  <span className=" text-xs">{artist.name}</span>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="mx-auto mt-auto">
          <button className="flex items-center gap-3 bg-lime-300 rounded-full py-3.5 px-9 shadow-bottom">
            <MessageSquare className="h-5 w-5" />
            <span>Social account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
