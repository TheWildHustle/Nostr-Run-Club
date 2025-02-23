import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPlaylistById } from '../services/wavlake';
import { PlaylistView } from '../components/Music/PlaylistView';

export function Playlist() {
  const { id } = useParams();
  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => fetchPlaylistById(id),
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Playlist</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return <PlaylistView playlist={playlist} />;
} 