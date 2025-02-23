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

  const featuredPlaylists = [featuredPlaylist].filter(p => p !== undefined);
  const trendingPlaylists = [top40Playlist, trendingRockPlaylist, trendingHipHopPlaylist].filter(pl => pl !== undefined);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Music for Your Run</h1>
      <PlaylistSection title="Featured" playlists={featuredPlaylists} />
      <PlaylistSection title="Trending" playlists={trendingPlaylists} />
    </div>
  );
}
