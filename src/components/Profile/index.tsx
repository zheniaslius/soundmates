import React, { useEffect, useState } from 'react';
import BlurFade from '@components/ui/blur-fade';
import { useClerkMutation } from '@api/useClerkSWR';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import Loader from './Loader';
import useAudioStore from '@store/audioStore';
import { Slider } from '@components/ui/slider';

type Props = {};

const Profile = (props: Props) => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { audioUrl, setAudioUrl } = useAudioStore();
  const [timeRange, setTimeRange] = useState('medium_term');

  const limit = 20; // Number of items to fetch per request

  const { trigger } = useClerkMutation('/top-tracks', 'get');

  const fetchMoreData = async () => {
    const response = await trigger({ limit, offset, time_range: timeRange });
    if (response?.data?.items.length) {
      setTracks((prevTracks) => [...prevTracks, ...response.data.items]);
      setOffset((prevOffset) => prevOffset + limit);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  useEffect(() => {
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayPause = (previewUrl: string | null) => {
    if (!previewUrl) {
      return;
    }

    if (audioUrl === previewUrl) {
      setAudioUrl(null);
    } else {
      setAudioUrl(previewUrl);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const selectedValue = value[0];
    let timeRangeValue = 'medium_term';
    if (selectedValue === 1) {
      timeRangeValue = 'long_term';
    } else if (selectedValue === 2) {
      timeRangeValue = 'medium_term';
    } else if (selectedValue === 3) {
      timeRangeValue = 'short_term';
    }
    setTimeRange(timeRangeValue);
    setTracks([]);
    setOffset(0);
    setHasMore(true);
  };

  return (
    <section id="photos" className="relative">
      <div className="mb-7 flex xs:flex-col lg:flex-row justify-between items-center w-3/4">
        <h1 className="text-4xl font-bold">My Top Tracks</h1>
        <div className="flex items-center space-x-4 my-4">
          <span className="text-sm">Older</span>
          <Slider
            defaultValue={[2]}
            max={3}
            min={1}
            step={1}
            className="w-32"
            onValueChange={handleSliderChange}
          />
          <span className="text-sm">Newer</span>
        </div>
      </div>
      <InfiniteScroll
        dataLength={tracks.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={<p>You have seen all top tracks.</p>}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 lg:w-3/4">
          {tracks.map((track, idx) => (
            <BlurFade key={track.id} delay={0.15 + idx * 0.05} inView>
              <div className="relative group">
                <div className="relative">
                  <img
                    className="w-full h-auto rounded-lg object-contain"
                    src={track.album.images?.find((img) => img.width === 300)?.url}
                    alt={track.name}
                  />

                  {track.preview_url && (
                    <button
                      onClick={() => handlePlayPause(track.preview_url)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {audioUrl === track.preview_url ? (
                        <PauseIcon className="w-10" />
                      ) : (
                        <PlayIcon className="w-10" />
                      )}
                    </button>
                  )}
                </div>

                <p className="mt-2 text-center">{track.name}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default Profile;
