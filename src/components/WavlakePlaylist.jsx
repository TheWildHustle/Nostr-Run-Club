import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNostr } from '../contexts/nostrContext';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export const WavlakePlaylist = ({ eventId }) => {
  const { ndk } = useNostr();
  const { dispatch } = useAudioPlayer();
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlaylist = async () => {
      if (!eventId || !ndk) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch the NIP-88 playlist event
        const event = await ndk.fetchEvent(eventId);
        if (!event) {
          throw new Error('Playlist not found');
        }

        // Parse the playlist content
        const content = JSON.parse(event.content);
        const tracks = content.tracks || [];

        setPlaylist({
          id: event.id,
          name: content.name || 'Untitled Playlist',
          description: content.description || '',
          tracks: tracks,
          creator: event.pubkey,
          createdAt: event.created_at
        });
      } catch (err) {
        console.error('Error loading playlist:', err);
        setError('Failed to load playlist');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylist();
  }, [eventId, ndk]);

  const handlePlayTrack = (track, index) => {
    // Add remaining tracks to queue
    const remainingTracks = playlist.tracks.slice(index + 1);
    dispatch({ type: 'CLEAR_QUEUE' });
    remainingTracks.forEach(track => {
      dispatch({ type: 'ADD_TO_QUEUE', payload: track });
    });
    
    // Play the selected track
    dispatch({ type: 'SET_TRACK', payload: track });
    dispatch({ type: 'PLAY' });
  };

  const handlePlayAll = () => {
    if (!playlist?.tracks.length) return;
    
    // Add all tracks except first to queue
    const [firstTrack, ...remainingTracks] = playlist.tracks;
    dispatch({ type: 'CLEAR_QUEUE' });
    remainingTracks.forEach(track => {
      dispatch({ type: 'ADD_TO_QUEUE', payload: track });
    });
    
    // Play the first track
    dispatch({ type: 'SET_TRACK', payload: firstTrack });
    dispatch({ type: 'PLAY' });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!playlist) {
    return null;
  }

  return (
    <div className="wavlake-playlist">
      <div className="playlist-header">
        <div className="playlist-info">
          <h2 className="text-2xl font-bold mb-2">{playlist.name}</h2>
          {playlist.description && (
            <p className="text-gray-600 mb-4">{playlist.description}</p>
          )}
          <p className="text-sm text-gray-500">
            {playlist.tracks.length} tracks
          </p>
        </div>
        <button
          onClick={handlePlayAll}
          disabled={!playlist.tracks.length}
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Play All
        </button>
      </div>

      <div className="playlist-tracks">
        {playlist.tracks.map((track, index) => (
          <div
            key={`${track.id}-${index}`}
            className="track-item"
            onClick={() => handlePlayTrack(track, index)}
          >
            <div className="track-number">{index + 1}</div>
            <img
              src={track.artwork || '/default-album-art.svg'}
              alt={track.title}
              className="track-artwork"
            />
            <div className="track-details">
              <h3 className="track-title">{track.title}</h3>
              <p className="track-artist">{track.artist}</p>
            </div>
            <div className="track-duration">
              {formatDuration(track.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

WavlakePlaylist.propTypes = {
  eventId: PropTypes.string.isRequired
};

const formatDuration = (seconds) => {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}; 