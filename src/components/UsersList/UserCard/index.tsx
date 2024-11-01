import { User } from 'lucide-react';
import { useClerkMutation } from '@api/useClerkSWR';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import MusicCarousel from './Carousel';
import { UsersIcon, MusicalNoteIcon, PercentBadgeIcon } from '@heroicons/react/20/solid';
import useAudioStore from '@store/audioStore';
import AlertLinkDialog from './AlertLinkDialog';
import { AlertDialog, AlertDialogTrigger } from '@components/ui/alert-dialog';

const UserCard = ({ data, mouseEvents, playAudio }) => {
  const [artistId, setArtistId] = useState<string>();
  const [trackId, setTrackId] = useState<string>();
  const { audioUrl, setAudioUrl } = useAudioStore();
  const user = data?._id;
  const photo = user?.images?.find((i) => i.url?.includes('height=300'));
  const { trigger } = useClerkMutation(artistId ? `/artists/${artistId}/top-tracks` : null, 'get');

  useEffect(() => {
    const playArtist = async () => {
      if (artistId) {
        const { data: trackData } = await trigger();
        if (trackData) {
          setAudioUrl(trackData);
        }
      }
    };
    playArtist();
  }, [trigger, artistId, setAudioUrl]);

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
      setAudioUrl(null);
    } else {
      setArtistId(artist.id);
    }
  };

  const matchingScore = data?.matchingScore && `${(data.matchingScore * 100).toFixed(0)}%`;
  const scoreColor = data?.matchingScore > 0.6 ? 'text-lime-300' : 'text-orange-300';

  const defaultTabsValue = data?.matchingArtists?.length ? 'matches' : 'songs';

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-items-center min-h-[455px]">
        <div className="relative lg:basis-1/2 pointer-events-none">
          <div className="img">
            <img src={photo?.url} className="relative z-0 h-60 w-60 lg:h-full lg:w-full object-cover" />
          </div>
          {!!matchingScore && (
            <div className="pl-4 lg:pl-0 absolute bottom-4 lg:bottom-8 w-full flex items-center lg:justify-center sm:lg:justify-start">
              <span
                className={`flex items-center text-sm lg:text-base font-bold ${scoreColor} backdrop-blur-md bg-gray-800 bg-opacity-60 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full shadow-xl`}
              >
                <PercentBadgeIcon className="w-5 lg:w-6 h-5 lg:h-6 mr-2" />
                {matchingScore}
              </span>
            </div>
          )}
        </div>
        <div className="relative lg:basis-1/2 text-left flex flex-col py-4 lg:py-8 xs:px-6 lg:px-0">
          <div className="flex flex-col cursor-pointer">
            <div className="mb-2 font-semibold">
              <span>Favorite genres</span>
            </div>
            <ol
              className="text-left flex gap-2 lg:gap-4 text-xs lg:text-sm pb-3 xs:max-w-[20rem] lg:max-w-[20.3rem] mb-5 text-gray-400 overflow-x-scroll"
              {...mouseEvents.none}
            >
              {user?.topGenres?.map((genre, index) => (
                <li
                  key={index}
                  className="bg-gray-500 bg-opacity-20 px-2 lg:px-3 py-1 rounded-2xl backdrop-blur-sm"
                >
                  <span className="whitespace-nowrap">{genre.genre}</span>
                </li>
              ))}
            </ol>
          </div>
          <Tabs defaultValue={defaultTabsValue}>
            <TabsList className="mb-1 overflow-x-auto" {...mouseEvents.none}>
              <TabsTrigger value="matches">
                <UsersIcon height={16} className="mr-1" />
                You both listen
              </TabsTrigger>
              <TabsTrigger value="songs">
                <MusicalNoteIcon height={16} className="mr-1" />
                Top songs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="matches" className="pr-4 lg:pr-[80px]">
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
            <TabsContent value="songs" className="pr-4 lg:pr-[80px]">
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
            <AlertDialog>
              <AlertDialogTrigger className="mt-0 lg:mt-7 lg:ml-16 mb-2">
                <button
                  className="flex lg:margin-0 mx-auto items-center gap-1 bg-lime-300 hover:brightness-75 transition-all rounded-full py-2 lg:py-3 px-4 lg:px-5 shadow-bottom"
                  {...mouseEvents.none}
                >
                  <User className="text-brand-dark" />
                  <span className="text-brand-dark">Social media</span>
                </button>
              </AlertDialogTrigger>
              <AlertLinkDialog url={user?.socialUrl} />
            </AlertDialog>
          )}
        </div>
      </div>
      <AlertDialog />
    </>
  );
};

export default UserCard;
