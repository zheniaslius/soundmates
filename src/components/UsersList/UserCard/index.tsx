import { User } from 'lucide-react';
import { useClerkMutation } from '@api/useClerkSWR';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import MusicCarousel from './Carousel';
import { UsersIcon, MusicalNoteIcon } from '@heroicons/react/20/solid';
import useAudioStore from '@store/audioStore';
import { extractColors } from 'extract-colors';

const UserCard = ({ data, mouseEvents, playAudio }) => {
  const [artistId, setArtistId] = useState<string>();
  const [trackId, setTrackId] = useState<string>();
  const { audioUrl, setAudioUrl } = useAudioStore();
  const user = data?._id;
  const photo = user?.images?.find((i) => i.url?.includes('height=300'));
  const { data: trackData, trigger } = useClerkMutation(artistId && `/artists/${artistId}/top-tracks`, 'get');

  // useEffect(() => {
  //   playAudio(artistId ? trackData?.data : null);
  // }, [trackData, artistId]);

  useEffect(() => {
    trigger();
  }, [trigger, artistId]);

  useEffect(() => {
    extractColors(photo?.url).then(console.log).catch(console.error);
  }, [photo?.url]);

  const playTopTrack = (track) => {
    if (track.id === trackId) {
      setTrackId('');
      setAudioUrl('');
    } else {
      setTrackId(track.id);
      setAudioUrl(track.preview_url);
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
    <div className="flex justify-items-center min-h-[455px]">
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
            <TabsTrigger value="matches">
              <UsersIcon height={16} className="mr-1" />
              You both listen
            </TabsTrigger>
            <TabsTrigger value="songs">
              <MusicalNoteIcon height={16} className="mr-1" />
              Top songs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="pr-[80px]">
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
          <TabsContent value="songs" className="pr-[80px]">
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
          <div className="mt-7 ml-16 mb-2">
            <button
              className="flex items-center gap-1 bg-lime-300 hover:brightness-75 rounded-full py-3 px-5 shadow-bottom"
              onMouseEnter={mouseEvents.none.onMouseEnter}
              onMouseLeave={mouseEvents.none.onMouseLeave}
              onMouseMove={mouseEvents.none.onMouseMove}
            >
              <User className="text-brand-dark" />
              <span className="text-brand-dark">Social media</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
