import { useAudioPlayer } from '../../hooks/useAudioPlayer.jsx';
import { useWavlake } from '../../hooks/useWavlake.jsx';

export function MusicPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    volume,
    queue,
    togglePlay,
    setVolume,
    playNext
  } = useAudioPlayer();

  const {
    isLoading,
    error
  } = useWavlake();

  return (
    <div className="music-player bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {/* Now Playing Section */}
      <div className="now-playing mb-4">
        {currentTrack ? (
          <div className="flex items-center space-x-4">
            <img 
              src={currentTrack.artwork || '/default-album-art.png'} 
              alt="Album Art"
              className="w-16 h-16 rounded-md"
            />
            <div>
              <h3 className="font-bold">{currentTrack.title}</h3>
              <p className="text-gray-400">{currentTrack.artist}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No track playing</p>
        )}
      </div>

      {/* Controls Section */}
      <div className="controls flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={() => playNext()}
          className="p-2 hover:bg-gray-700 rounded-full"
          disabled={!queue.length}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
        </button>

        <button
          onClick={togglePlay}
          className="p-3 bg-green-500 hover:bg-green-600 rounded-full"
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button
          onClick={() => playNext()}
          className="p-2 hover:bg-gray-700 rounded-full"
          disabled={!queue.length}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
        </button>
      </div>

      {/* Volume Control */}
      <div className="volume-control flex items-center space-x-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Queue Section */}
      {queue.length > 0 && (
        <div className="queue mt-4">
          <h4 className="text-sm font-bold mb-2">Next in queue</h4>
          <div className="space-y-2">
            {queue.slice(0, 3).map((track, index) => (
              <div key={track.id} className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">{index + 1}</span>
                <span className="truncate">{track.title}</span>
                <span className="text-gray-400">- {track.artist}</span>
              </div>
            ))}
            {queue.length > 3 && (
              <p className="text-gray-400 text-sm">
                +{queue.length - 3} more tracks
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message mt-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        </div>
      )}
    </div>
  );
} 