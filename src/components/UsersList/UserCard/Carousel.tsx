import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';
import Spotify from '@assets/icons/Primary_Logo_Green_RGB.svg?react';

type Props = {
  data: unknown[];
};

const MusicCarousel = ({ data, onClick, mouseEvents, getImgSrc }: Props) => {
  return (
    <Carousel
      opts={{
        align: 'start',
        watchDrag: false,
      }}
      className="lg:max-w-72 max-w-[12rem] ml-9 lg:ml-0"
    >
      <CarouselContent>
        {data?.map((artist) => (
          <CarouselItem key={artist.id} className="basis-1/2" onClick={() => onClick(artist)}>
            <img
              src={getImgSrc(artist)}
              {...mouseEvents.play}
              onMouseMove={() => mouseEvents.play.onMouseMove(artist)}
              className={'w-full aspect-square object-cover mb-1.5'}
            />
            <div className="flex items-center space-x-2">
              <a href={artist.uri} {...mouseEvents.none}>
                <Spotify className="w-6 h-6 fill-brand-spotify cursor-pointer hover:brightness-90" />
              </a>
              <span className="text-sm">{artist.name}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="top-[35%]" {...mouseEvents.none} />
      <CarouselNext className="top-[35%]" {...mouseEvents.none} />
    </Carousel>
  );
};

export default MusicCarousel;
