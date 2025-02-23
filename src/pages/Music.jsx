import { MusicPlayer } from '../components/music/MusicPlayer';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedPlaylist, fetchTop40, fetchTrendingRock, fetchTrendingHipHop } from '../services/wavlake';
import { useContext, useState } from 'react';
import { AudioContext } from '../contexts/audioContext';

export function Music() {
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(0);
  const { play, addToQueue } = useContext(AudioContext);

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

  const handlePlaylistSelect = (index) => {
    setSelectedPlaylistIndex(index);
    const playlist = sections[index].playlist;
    if (playlist && playlist.tracks.length > 0) {
      // Play the first track
      play(playlist.tracks[0]);
      // Add the rest to the queue
      addToQueue(playlist.tracks.slice(1));
    }
  };

  const currentPlaylist = sections[selectedPlaylistIndex]?.playlist;
  const currentTrack = currentPlaylist?.tracks[0];

  const getArtworkUrl = (track) => {
    if (!track) return '/images/default-album-art.png';
    return track.artworkUrl || track.albumArtUrl || track.artwork_url || track.artwork || '/images/default-album-art.png';
  };

  return (
    <div className="h-screen bg-black text-white flex">
      {/* Left Sidebar - Playlist Selection */}
      <div className="w-64 border-r border-gray-800 p-4">
        <div className="space-y-2">
          {sections.map(({ title, playlist }, index) => (
            playlist && (
              <button
                key={title}
                onClick={() => handlePlaylistSelect(index)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  selectedPlaylistIndex === index
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {title}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Album Art and Track Info */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <img
              src={getArtworkUrl(currentTrack)}
              alt="Album Art"
              className="w-64 h-64 mx-auto mb-4 rounded-lg shadow-lg object-cover bg-gray-800"
            />
            <h2 className="text-2xl font-bold">{currentTrack?.title || 'No Track Selected'}</h2>
            <p className="text-gray-400">{currentTrack?.artist || 'Unknown Artist'}</p>
          </div>
        </div>

        {/* Fixed Player Controls at Bottom */}
        <div className="border-t border-gray-800">
          <MusicPlayer />
        </div>
      </div>

      {/* Right Sidebar - Up Next */}
      <div className="w-64 border-l border-gray-800 p-4">
        <h3 className="text-sm font-bold uppercase mb-4">Up Next</h3>
        <div className="space-y-2">
          {currentPlaylist?.tracks.slice(1).map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
              onClick={() => {
                play(track);
                addToQueue(currentPlaylist.tracks.slice(currentPlaylist.tracks.indexOf(track) + 1));
              }}
            >
              <div className="w-10 h-10 flex-shrink-0">
                <img
                  src={getArtworkUrl(track)}
                  alt={track.title}
                  className="w-full h-full object-cover rounded bg-gray-800"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.title}</p>
                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
