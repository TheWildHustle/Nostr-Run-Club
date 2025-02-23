import { createContext, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Howl } from 'howler';

export const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState([]);
  const soundRef = useRef(null);

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(prevQueue => prevQueue.slice(1));
      play(nextTrack);
    } else {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  }, [queue]);

  const play = useCallback(async (track) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    if (track) {
      try {
        soundRef.current = new Howl({
          src: [track.streamUrl],
          html5: true,
          volume: volume,
          onend: () => {
            playNext();
          },
        });
        setCurrentTrack(track);
        soundRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing track:', error);
      }
    }
  }, [volume, playNext]);

  const pause = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!soundRef.current) return;
    if (isPlaying) {
      pause();
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, pause]);

  const setPlayerVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  const addToQueue = useCallback((tracks) => {
    setQueue(prevQueue => [...prevQueue, ...tracks]);
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    queue,
    play,
    pause,
    togglePlay,
    setVolume: setPlayerVolume,
    addToQueue,
    playNext,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired
}; 