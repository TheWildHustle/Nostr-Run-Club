import { useState, useCallback } from 'react';
import { wavlakeApi } from '../services/wavlakeApi';
import { useAudioPlayer } from './useAudioPlayer';

export function useWavlake() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { play, addToQueue } = useAudioPlayer();

  const loadTrack = useCallback(async (trackId) => {
    setIsLoading(true);
    setError(null);
    try {
      const track = await wavlakeApi.getTrackById(trackId);
      const streamUrl = await wavlakeApi.getStreamUrl(trackId);
      const trackWithUrl = { ...track, streamUrl };
      await play(trackWithUrl);
    } catch (err) {
      setError(err.message);
      console.error('Error loading track:', err);
    } finally {
      setIsLoading(false);
    }
  }, [play]);

  const loadPlaylist = useCallback(async (playlistId) => {
    setIsLoading(true);
    setError(null);
    try {
      const tracks = await wavlakeApi.getPlaylistTracks(playlistId);
      const tracksWithUrls = await Promise.all(
        tracks.map(async (track) => {
          const streamUrl = await wavlakeApi.getStreamUrl(track.id);
          return { ...track, streamUrl };
        })
      );
      addToQueue(tracksWithUrls);
    } catch (err) {
      setError(err.message);
      console.error('Error loading playlist:', err);
    } finally {
      setIsLoading(false);
    }
  }, [addToQueue]);

  const searchTracks = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await wavlakeApi.searchTracks(query);
      return results;
    } catch (err) {
      setError(err.message);
      console.error('Error searching tracks:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    loadTrack,
    loadPlaylist,
    searchTracks,
  };
} 