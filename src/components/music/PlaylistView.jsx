import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { fetchTrackLnurl } from '../../services/wavlake';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export function PlaylistView({ playlist }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = playlist.tracks[currentTrackIndex];
  const upcomingTracks = playlist.tracks.slice(currentTrackIndex + 1);

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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="text-center py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">NOSTR RUN CLUB</h1>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Current Track Image */}
            <div className="relative w-full max-w-lg mx-auto aspect-square mb-6">
              <img
                src={currentTrack.artworkUrl || currentTrack.albumArtUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Track Info */}
            <h2 className="text-2xl font-bold mb-2">{currentTrack.title}</h2>
            <p className="text-gray-400 mb-6">{currentTrack.artist}</p>

            {/* Audio Controls */}
            <AudioPlayer
              autoPlay
              src={currentTrack.mediaUrl}
              onClickNext={playNext}
              onClickPrevious={playPrevious}
              onEnded={playNext}
              showSkipControls
              className="bg-transparent"
              customProgressBarSection={[
                "CURRENT_TIME",
                "PROGRESS_BAR",
                "DURATION",
              ]}
              customControlsSection={[
                "ADDITIONAL_CONTROLS",
                "MAIN_CONTROLS",
                "VOLUME_CONTROLS",
              ]}
            />

            {/* Lightning Button */}
            {lnurl && (
              <div className="mt-4">
                <a
                  href={`lightning:${lnurl}`}
                  className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition"
                >
                  ⚡️ Support Artist
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Up Next Sidebar */}
        <div className="w-80 border-l border-gray-800 p-4">
          <h3 className="text-lg font-bold mb-4">Up Next</h3>
          <div className="space-y-4">
            {upcomingTracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-900 p-2 rounded"
                onClick={() => setCurrentTrackIndex(currentTrackIndex + index + 1)}
              >
                <img
                  src={track.artworkUrl || track.albumArtUrl}
                  alt={track.title}
                  className="w-12 h-12 object-cover"
                />
                <div>
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                </div>
              </div>
            ))}
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