import { PlaylistSection } from '../components/Music/PlaylistSection';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedPlaylist, fetchTop40, fetchTrendingRock, fetchTrendingHipHop } from '../services/wavlake';

export function Music() {
  const { data: featuredPlaylist } = useQuery({
    queryKey: ['playlist', 'featured'],
    queryFn: fetchFeaturedPlaylist,
    staleTime: Infinity,
  });

  const { data: top40Playlist } = useQuery({
    queryKey: ['playlist', 'top40'],
    queryFn: fetchTop40,
    staleTime: Infinity,
  });

  const { data: trendingRockPlaylist } = useQuery({
    queryKey: ['playlist', 'trending-rock'],
    queryFn: fetchTrendingRock,
    staleTime: Infinity,
  });

  const { data: trendingHipHopPlaylist } = useQuery({
    queryKey: ['playlist', 'trending-hiphop'],
    queryFn: fetchTrendingHipHop,
    staleTime: Infinity,
  });

  const sections = [
    { title: 'Featured', playlist: featuredPlaylist },
    { title: 'Top 40', playlist: top40Playlist },
    { title: 'Rock', playlist: trendingRockPlaylist },
    { title: 'Hip Hop', playlist: trendingHipHopPlaylist },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="text-center py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">NOSTR RUN CLUB</h1>
      </div>
      
      <div className="p-4">
        <div className="flex gap-4 justify-center flex-wrap">
          {sections.map(({ title, playlist }) => (
            playlist && (
              <PlaylistSection
                key={title}
                title={title}
                playlists={[playlist]}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
}
