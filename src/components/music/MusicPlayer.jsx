import { useContext } from 'react';
import { AudioContext } from '../../contexts/audioContext';
import 'react-h5-audio-player/lib/styles.css';

export function MusicPlayer() {
  const { 
    isPlaying, 
    volume,
    togglePlay,
    setVolume,
    playNext,
    playPrevious
  } = useContext(AudioContext);
  const currentTime = 0;
  const duration = 205; // Example duration in seconds

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
          <div className="flex-1 h-2 bg-gray-800 rounded-full cursor-pointer">
            <div 
              className="h-full bg-white rounded-full" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-400">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center space-x-16">
          {/* Shuffle Button */}
          <button className="text-gray-400 hover:text-white p-4">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 4l3 3-3 3M18 20l3-3-3-3M3 12h18M3 7h12M3 17h12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={playPrevious}
            className="text-gray-400 hover:text-white p-4 transition-transform duration-200 hover:scale-110"
          >
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-gray-200 p-8 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-200 hover:scale-110"
          >
            {isPlaying ? (
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={playNext}
            className="text-gray-400 hover:text-white p-4 transition-transform duration-200 hover:scale-110"
          >
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          {/* Repeat Button */}
          <button className="text-gray-400 hover:text-white p-4">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 1l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 11V9a4 4 0 014-4h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 23l-4-4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 13v2a4 4 0 01-4 4H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 h-2 bg-gray-600 rounded-full appearance-none cursor-pointer hover:bg-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}