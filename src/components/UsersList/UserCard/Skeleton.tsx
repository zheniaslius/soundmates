import { MessageSquare } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const Skeleton = () => {
  return (
    <div className="flex justify-items-center h-[380px]">
      <div className="relative basis-1/2 pointer-events-none">
        <div className="img">
          <div className="gradient-overlay absolute inset-0"></div>
        </div>
      </div>
      <div className="relative text-left flex flex-col py-8 -ml-14">
        <div className="flex flex-col">
          <div className="mb-2 font-semibold">
            <span>Favorite genres</span>
          </div>
          <ol className="text-left flex gap-4 text-xs pb-3 mb-5 animate-pulse">
            <div className="rounded-full bg-slate-300 h-6 w-14"></div>
            <div className="rounded-full bg-slate-300 h-6 w-14"></div>
            <div className="rounded-full bg-slate-300 h-6 w-14"></div>
            <div className="rounded-full bg-slate-300 h-6 w-14"></div>
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
            className="max-w-80 animate-pulse"
          >
            <CarouselContent>
              {Array.from(new Array(3)).map((_, index) => (
                <CarouselItem key={index} className="lg:basis-1/3">
                  <div className="aspect-square bg-slate-300 h-24"></div>
                  <div className="rounded-full bg-slate-300 h-4 w-20 mt-2"></div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="mx-auto mt-auto animate-pulse">
          <div className="flex items-center rounded-full bg-slate-300 h-[52px] w-[210px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
