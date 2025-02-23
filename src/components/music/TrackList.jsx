import { useState, useEffect } from 'react';
import { useWavlake } from '../../hooks/useWavlake.jsx';
import { useAudioPlayer } from '../../hooks/useAudioPlayer.jsx';
import { wavlakeApi } from '../../services/wavlakeApi';

export function TrackList({ tracks = [] }) {
  const { loadTrack, isLoading, error } = useWavlake();
  const { addToQueue } = useAudioPlayer();

  return (
    <div className="track-list bg-gray-800 p-4 rounded-lg">
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-6">{index + 1}</span>
              <img
                src={track.artwork || '/default-album-art.png'}
                alt={`${track.title} artwork`}
                className="w-4 h-4 rounded"
              />
              <div>
                <h3 className="font-medium text-white">{track.title}</h3>
                <p className="text-sm text-gray-400">{track.artist}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => loadTrack(track.id)}
                className="p-2 text-green-500 hover:text-green-400"
                title="Play Now"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => addToQueue([track])}
                className="p-2 text-gray-400 hover:text-white"
                title="Add to Queue"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {tracks.length === 0 && !isLoading && (
        <div className="text-center text-gray-400 py-8">
          No tracks available
        </div>
      )}

      {isLoading && (
        <div className="text-center text-gray-400 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        </div>
      )}
    </div>
  );
} 