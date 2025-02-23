import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { fetchTrackLnurl } from '../../services/wavlake';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export function PlaylistView({ playlist }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = playlist.tracks[currentTrackIndex];

  const { data: lnurl } = useQuery({
    queryKey: ['lnurl', currentTrack.id],
    queryFn: () => fetchTrackLnurl(currentTrack.id),
    staleTime: Infinity,
  });

  const playNext = () => {
    setCurrentTrackIndex((current) =>
      current < playlist.tracks.length - 1 ? current + 1 : 0
    );
  };

  const playPrevious = () => {
    setCurrentTrackIndex((current) => (current > 0 ? current - 1 : 0));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Playlist Info */}
        <div className="md:w-1/3">
          <div className="aspect-square relative mb-4">
            <div className="grid grid-cols-2 h-full">
              {playlist.tracks.slice(0, 4).map((track) => (
                <img
                  key={track.id}
                  src={track.artworkUrl || track.albumArtUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{playlist.title}</h1>
          <p className="text-gray-600 mb-4">{playlist.tracks.length} tracks</p>
        </div>

        {/* Track List */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={currentTrack.artworkUrl || currentTrack.albumArtUrl}
                alt={currentTrack.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{currentTrack.title}</h3>
                <p className="text-gray-600">{currentTrack.artist}</p>
              </div>
            </div>
            <AudioPlayer
              autoPlay
              src={currentTrack.mediaUrl}
              onClickNext={playNext}
              onClickPrevious={playPrevious}
              onEnded={playNext}
              showSkipControls
              className="rounded-lg"
            />
            {lnurl && (
              <div className="mt-4 text-center">
                <a
                  href={`lightning:${lnurl}`}
                  className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition"
                >
                  ⚡️ Support Artist
                </a>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tracks</h2>
            <div className="space-y-2">
              {playlist.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-4 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                    index === currentTrackIndex ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setCurrentTrackIndex(index)}
                >
                  <img
                    src={track.artworkUrl || track.albumArtUrl}
                    alt={track.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{track.title}</h3>
                    <p className="text-gray-600">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PlaylistView.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        artworkUrl: PropTypes.string,
        albumArtUrl: PropTypes.string,
        mediaUrl: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
}; 