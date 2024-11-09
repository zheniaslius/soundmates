// Import statements
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useClerkMutation } from '@api/useClerkSWR';
import { useState } from 'react';
import BlurFade from '@components/ui/blur-fade';
import useAudioStore from '@store/audioStore';
import Spotify from '@assets/icons/Primary_Logo_Green_RGB.svg?react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Loader from './Loader';
import { useToast } from '@hooks/use-toast';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'; // Added import

type Props = {};

const schema = z.object({
  description: z.string().min(2).max(400, 'Description must be no more than 400 characters.'),
});

type FormData = z.infer<typeof schema>;

const Search = (props: Props) => {
  const { toast } = useToast();

  const [tracks, setTracks] = useState<any[]>([]);

  const { trigger, isMutating } = useClerkMutation('/search', 'post');

  const { audioUrl, setAudioUrl } = useAudioStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await trigger({ description: data.description });

      if (response?.data?.length) {
        setTracks(response?.data);
      } else {
        setTracks([]);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem when fetching songs',
      });
    }
  };

  const handlePlayPause = (previewUrl: string | null) => {
    if (!previewUrl) return;

    if (audioUrl === previewUrl) {
      setAudioUrl(null);
    } else {
      setAudioUrl(previewUrl);
    }
  };

  // Render the component
  return (
    <section className="relative">
      <div className="mb-7 lg:w-3/4">
        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-bold">Search</h1>
          <p className="mt-2">
            Find music by describing it. <br />
            Like "sad music to cry" or "epic music to slay like a queen"
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 mb-9 w-full max-w-sm">
          <div className="flex items-center space-x-2">
            <Input type="text" className="text-base" placeholder="Description" {...register('description')} />
            <Button type="submit">Search</Button>
          </div>
          {errors.description && <p className="text-red-500 mt-2">{errors.description.message}</p>}
        </form>

        {/* Tracks Grid */}
        {isMutating && <Loader />}
        {!isMutating && !!tracks?.length && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:w-3/4">
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
                      />
                    )}
                  </div>
                  {/* Track Information */}
                  <div className="mt-2 flex items-start space-x-2">
                    <a href={track.uri}>
                      <Spotify className="w-6 h-6 fill-brand-spotify cursor-pointer hover:brightness-90" />
                    </a>
                    {track.preview_url && (
                      <button onClick={() => handlePlayPause(track.preview_url)}>
                        {audioUrl === track.preview_url ? (
                          <PauseIcon className="w-6 h-6 cursor-pointer hover:brightness-90" />
                        ) : (
                          <PlayIcon className="w-6 h-6 cursor-pointer hover:brightness-90" />
                        )}
                      </button>
                    )}
                    <p className="flex-1 line-clamp-2">{track.name}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;
