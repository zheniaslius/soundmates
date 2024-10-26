import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';
import { cn } from '@/lib/utils';

type Props = {
  data: unknown[];
};

const MusicCarousel = ({ data, onClick, mouseEvents, getImgSrc, classNames }: Props) => {
  return (
    <Carousel
      opts={{
        align: 'start',
        watchDrag: false,
      }}
      className="max-w-72"
    >
      <CarouselContent>
        {data?.map((artist) => (
          <CarouselItem
            key={artist.id}
            className="lg:basis-1/2"
            onClick={() => onClick(artist)}
            onMouseEnter={mouseEvents.play.onMouseEnter}
            onMouseLeave={mouseEvents.play.onMouseLeave}
            onMouseMove={() => mouseEvents.play.onMouseMove(artist)}
          >
            <img src={getImgSrc(artist)} className={'w-full aspect-square object-cover mb-1.5'} />
            <span className="text-base">{artist.name}</span>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        className="top-[35%]"
        onMouseEnter={mouseEvents.none.onMouseEnter}
        onMouseLeave={mouseEvents.none.onMouseLeave}
        onMouseMove={mouseEvents.none.onMouseMove}
      />
      <CarouselNext
        className="top-[35%]"
        onMouseEnter={mouseEvents.none.onMouseEnter}
        onMouseLeave={mouseEvents.none.onMouseLeave}
        onMouseMove={mouseEvents.none.onMouseMove}
      />
    </Carousel>
  );
};

export default MusicCarousel;
