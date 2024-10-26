import { User } from 'lucide-react';
import useClerkSWR from '@api/useClerkSWR';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import MusicCarousel from './Carousel';

const UserCard = ({ data, mouseEvents, playAudio }) => {
  const [artistId, setArtistId] = useState<string>();
  const [trackId, setTrackId] = useState<string>();
  const user = data?._id;
  const photo = user?.images?.find((i) => i.url?.includes('height=300'));
  const { useSWR } = useClerkSWR(artistId && `/artists/${artistId}/top-tracks`);
  const { data: track } = useSWR;

  useEffect(() => {
    playAudio(artistId ? track?.data : null);
  }, [track, artistId]);

  const playTopTrack = (track) => {
    if (track.id === trackId) {
      setTrackId('');
      playAudio(null);
    } else {
      setTrackId(track.id);
      playAudio(track.preview_url);
    }
  };

  const handleArtistClick = (artist) => {
    if (artist.id === artistId) {
      setArtistId('');
    } else {
      setArtistId(artist.id);
    }
  };

  return (
    <div className="flex justify-items-center min-h-[443px]">
      <div className="relative basis-1/2 pointer-events-none">
        <div className="img">
          <img src={photo?.url} className="relative z-0 h-full w-full object-cover" />
          <div className="gradient-overlay absolute inset-0"></div>
        </div>
      </div>
      <div className="relative basis-1/2 text-left flex flex-col py-8">
        <div className="flex flex-col cursor-pointer">
          <div className="mb-2 font-semibold">
            <span>Favorite genres</span>
          </div>
          <ol
            className="text-left flex gap-4 text-xs pb-3 max-w-[20.3rem] mb-5 text-gray-400 overflow-x-scroll"
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
        <Tabs defaultValue="matches">
          <TabsList className="mb-1">
            <TabsTrigger value="matches">You both listen</TabsTrigger>
            <TabsTrigger value="songs">Top songs</TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="pr-[60px]">
            <MusicCarousel
              getImgSrc={(artist) => artist.images?.[2]?.url}
              data={data?.matchingArtists}
              onClick={handleArtistClick}
              mouseEvents={{
                ...mouseEvents,
                play: {
                  ...mouseEvents.play,
                  onMouseMove: (artist) => {
                    mouseEvents.play.onMouseMove(artist.id === artistId);
                  },
                },
              }}
            />
          </TabsContent>
          <TabsContent value="songs" className="pr-[60px]">
            <MusicCarousel
              getImgSrc={(track) => track.album.images?.[2]?.url}
              data={user?.topTracks}
              onClick={playTopTrack}
              mouseEvents={{
                ...mouseEvents,
                play: {
                  ...mouseEvents.play,
                  onMouseMove: (track) => {
                    mouseEvents.play.onMouseMove(track.id === trackId);
                  },
                },
              }}
            />
          </TabsContent>
        </Tabs>
        {user?.socialUrl && (
          <div className="mt-7">
            <button
              className="flex items-center gap-1 bg-lime-300 rounded-full py-3 px-5 shadow-bottom"
              onMouseEnter={mouseEvents.none.onMouseEnter}
              onMouseLeave={mouseEvents.none.onMouseLeave}
              onMouseMove={mouseEvents.none.onMouseMove}
            >
              <User />
              <span>Social media</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
