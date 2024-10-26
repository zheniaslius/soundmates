import { MouseEvent as ReactMouseEvent, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, type PanInfo } from 'framer-motion';
import { MoveLeft, MoveRight } from 'lucide-react';
import { Play, Pause } from 'lucide-react';

import { cn } from '@/lib/utils';
import UserCard from '@components/UsersList/UserCard';
import Skeleton from '@components/UsersList/UserCard/Skeleton';

const START_INDEX = 0;
const DRAG_THRESHOLD = 150;
const FALLBACK_WIDTH = 509;

const CURSOR_SIZE = 60;

export default function UsersList({ data, isLoading }) {
  const containerRef = useRef<HTMLUListElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(START_INDEX);
  const canScrollPrev = activeSlide > 0;
  const canScrollNext = activeSlide < data?.length - 1;
  const offsetX = useMotionValue(0);
  const animatedX = useSpring(offsetX, {
    damping: 20,
    stiffness: 150,
  });

  const playAudio = (audioUrl) => {
    const previousAudio = audioRef.current;

    if (previousAudio) {
      previousAudio.pause();
      previousAudio.currentTime = 0;
      previousAudio.src = '';
      previousAudio.load();
    }

    if (!audioUrl) {
      setHoverType('play');
      return;
    }

    const newAudio = new Audio(audioUrl);
    audioRef.current = newAudio;

    newAudio
      .play()
      .then(() => setHoverType('pause'))
      .catch((error) => {
        console.error('Error playing audio:', error);
      });
  };

  const [isDragging, setIsDragging] = useState(false);
  function handleDragSnap(_: MouseEvent, { offset: { x: dragOffset } }: PanInfo) {
    //reset drag state
    setIsDragging(false);
    containerRef.current?.removeAttribute('data-dragging');

    //stop drag animation (rest velocity)
    animatedX.stop();

    const currentOffset = offsetX.get();

    //snap back if not dragged far enough or if at the start/end of the list
    if (
      Math.abs(dragOffset) < DRAG_THRESHOLD ||
      (!canScrollPrev && dragOffset > 0) ||
      (!canScrollNext && dragOffset < 0)
    ) {
      animatedX.set(currentOffset);
      return;
    }

    let offsetWidth = 0;
    /*
      - start searching from currently active slide in the direction of the drag
      - check if the drag offset is greater than the width of the current item
      - if it is, add/subtract the width of the next/prev item to the offsetWidth
      - if it isn't, snap to the next/prev item
    */
    for (
      let i = activeSlide;
      dragOffset > 0 ? i >= 0 : i < itemsRef.current.length;
      dragOffset > 0 ? i-- : i++
    ) {
      const item = itemsRef.current[i];
      if (item === null) continue;
      const itemOffset = item.offsetWidth;

      const prevItemWidth = itemsRef.current[i - 1]?.offsetWidth ?? FALLBACK_WIDTH;
      const nextItemWidth = itemsRef.current[i + 1]?.offsetWidth ?? FALLBACK_WIDTH;

      if (
        (dragOffset > 0 && //dragging left
          dragOffset > offsetWidth + itemOffset && //dragged past item
          i > 1) || //not the first/second item
        (dragOffset < 0 && //dragging right
          dragOffset < offsetWidth + -itemOffset && //dragged past item
          i < itemsRef.current.length - 2) //not the last/second to last item
      ) {
        dragOffset > 0 ? (offsetWidth += prevItemWidth) : (offsetWidth -= nextItemWidth);
        continue;
      }

      if (dragOffset > 0) {
        //prev
        offsetX.set(currentOffset + offsetWidth + prevItemWidth);
        setActiveSlide(i - 1);
      } else {
        //next
        offsetX.set(currentOffset + offsetWidth - nextItemWidth);
        setActiveSlide(i + 1);
      }
      break;
    }
  }

  function getOffsetXForSlide(index) {
    if (!containerRef.current || !itemsRef.current[index]) return 0;

    const containerWidth = containerRef.current.offsetWidth;
    let cumulativeWidth = 0;
    const gap = 40; // Adjust if your gap size is different

    for (let i = 0; i < index; i++) {
      const item = itemsRef.current[i];
      if (item) {
        cumulativeWidth += item.offsetWidth + gap;
      }
    }

    const activeItem = itemsRef.current[index];
    const activeItemWidth = activeItem.offsetWidth;

    const totalWidth = cumulativeWidth + activeItemWidth / 2;
    const offset = containerWidth / 2 - totalWidth;

    return offset;
  }

  function scrollNext() {
    if (!canScrollNext) return;

    const newActiveSlide = activeSlide + 1;
    const newOffsetX = getOffsetXForSlide(newActiveSlide);

    offsetX.set(newOffsetX);
    setActiveSlide(newActiveSlide);
  }

  function scrollPrev() {
    if (!canScrollPrev) return;

    const newActiveSlide = activeSlide - 1;
    const newOffsetX = getOffsetXForSlide(newActiveSlide);

    offsetX.set(newOffsetX);
    setActiveSlide(newActiveSlide);
  }

  const [hoverType, setHoverType] = useState<'prev' | 'next' | 'click' | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const animatedHoverX = useSpring(mouseX, {
    damping: 20,
    stiffness: 400,
    mass: 0.1,
  });
  const animatedHoverY = useSpring(mouseY, {
    damping: 20,
    stiffness: 400,
    mass: 0.1,
  });

  function navButtonHover({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
    const parent = currentTarget.offsetParent;
    if (!parent) return;
    const { left: parentLeft, top: parentTop } = parent.getBoundingClientRect();

    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const offsetFromCenterX = clientX - centerX;
    const offsetFromCenterY = clientY - centerY;

    mouseX.set(left - parentLeft + offsetFromCenterX / 4);
    mouseY.set(top - parentTop + offsetFromCenterY / 4);
  }

  function disableDragClick(e: ReactMouseEvent<HTMLAnchorElement>) {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const getCursorText = () => {
    if (hoverType === 'none') {
      return null;
    }
    if (hoverType === 'click') {
      return 'spotify';
    }
    if (hoverType === 'play') {
      return <Play className="flex justify-center w-[65px]" />;
    }
    if (hoverType === 'pause') {
      return <Pause className="flex justify-center w-[60px]" />;
    }
    return hoverType ?? 'drag';
  };

  if (!data?.length && !isLoading) return null;

  return (
    <div className="min-h-screen overflow-x-hidden container mt-24">
      <div className="mb-9">
        <h1 className="text-4xl font-bold">Your matches</h1>
      </div>
      <div className="group mx-6 ">
        <motion.div
          className={cn(
            'pointer-events-none absolute z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
          )}
          style={{
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            x: animatedHoverX,
            y: animatedHoverY,
          }}
        >
          <motion.div
            layout
            className={cn(
              'grid h-full place-items-center rounded-full bg-lime-300',
              hoverType === 'click' && 'absolute inset-5 h-auto',
              hoverType === 'none' && 'bg-transparent'
            )}
          >
            <motion.span
              layout="position"
              className={cn(
                'w-full select-none text-center font-medium uppercase text-gray-900',
                (hoverType === 'prev' || hoverType === 'next') && 'absolute inset-x-0 top-2',
                hoverType === 'click' && 'absolute top-full mt-0.5 w-auto text-sm font-bold text-lime-300'
              )}
            >
              {getCursorText()}
            </motion.span>
          </motion.div>
        </motion.div>
        <div className="relative">
          <motion.ul
            ref={containerRef}
            className="flex gap-20 cursor-none items-start"
            style={{
              x: animatedX,
            }}
            drag="x"
            dragConstraints={{
              left: -(FALLBACK_WIDTH * (data?.length - 1)),
              right: FALLBACK_WIDTH,
            }}
            onMouseMove={({ currentTarget, clientX, clientY }) => {
              const parent = currentTarget.offsetParent;
              if (!parent) return;
              const { left, top } = parent.getBoundingClientRect();
              mouseX.set(clientX - left - CURSOR_SIZE / 2);
              mouseY.set(clientY - top - CURSOR_SIZE / 2);
            }}
            onDragStart={() => {
              containerRef.current?.setAttribute('data-dragging', 'true');
              setIsDragging(true);
            }}
            onDragEnd={handleDragSnap}
          >
            {(isLoading ? Array.from(new Array(5)) : data).map((user, index) => {
              const active = index === activeSlide;
              return (
                <motion.li
                  layout
                  key={user?._id?._id}
                  ref={(el) => (itemsRef.current[index] = el)}
                  className={cn(
                    'group relative shrink-0 select-none px-3 transition-opacity duration-300',
                    !active && 'opacity-40 blur-sm pointer-events-none'
                  )}
                  transition={{
                    ease: 'easeInOut',
                    duration: 0.4,
                  }}
                  style={{
                    flexBasis: 680,
                  }}
                >
                  <div className="block" draggable={false} onClick={disableDragClick}>
                    <div className={cn('grid overflow-hidden rounded-lg bg-brand-bg')}>
                      {isLoading ? (
                        <Skeleton />
                      ) : (
                        <UserCard
                          data={user}
                          playAudio={playAudio}
                          mouseEvents={{
                            play: {
                              onMouseEnter: () => setHoverType('play'),
                              onMouseMove: (isHoverAndPlay) => {
                                if (isHoverAndPlay) {
                                  audioRef.current ? setHoverType('pause') : setHoverType('play');
                                } else setHoverType('play');
                              },
                              onMouseLeave: () => setHoverType(null),
                            },
                            none: {
                              onMouseEnter: () => setHoverType('none'),
                              onMouseMove: (e) => navButtonHover(e),
                              onMouseLeave: () => setHoverType(null),
                            },
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className={cn('mt-4 flex justify-center', !active && 'hidden')}>
                    {isLoading ? (
                      <div className="rounded-full bg-slate-300 h-6 w-40 animate-pulse"></div>
                    ) : (
                      <Link
                        to={user?._id?.spotifyUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-none text-xl font-bold leading-tight transition-colors group-hover:text-lime-300"
                        draggable={false}
                        onClick={disableDragClick}
                        onMouseEnter={() => setHoverType('click')}
                        onMouseLeave={() => setHoverType(null)}
                      >
                        {user?._id?.displayName}
                      </Link>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
          {canScrollPrev && (
            <button
              type="button"
              className="group absolute left-[10%] top-1/3 z-20 grid aspect-square place-content-center rounded-full transition-colors"
              style={{
                width: CURSOR_SIZE,
                height: CURSOR_SIZE,
              }}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              onMouseEnter={() => setHoverType('prev')}
              onMouseMove={(e) => navButtonHover(e)}
              onMouseLeave={() => setHoverType(null)}
            >
              <span className="sr-only">Previous Guide</span>
              <MoveLeft className="h-10 w-10 stroke-[1.5] transition-colors group-enabled:group-hover:text-gray-900 group-disabled:opacity-50" />
            </button>
          )}
          <button
            type="button"
            className="group absolute right-[10%] top-1/3 z-20 grid aspect-square place-content-center rounded-full transition-colors"
            style={{
              width: CURSOR_SIZE,
              height: CURSOR_SIZE,
            }}
            onClick={scrollNext}
            disabled={!canScrollNext}
            onMouseEnter={() => setHoverType('next')}
            onMouseMove={(e) => navButtonHover(e)}
            onMouseLeave={() => setHoverType(null)}
          >
            <span className="sr-only">Next Guide</span>
            <MoveRight className="h-10 w-10 stroke-[1.5] transition-colors group-enabled:group-hover:text-gray-900 group-disabled:opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}
