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

  const play = useCallback(async (track) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    if (track) {
      try {
        soundRef.current = new Howl({
          src: [track.streamUrl || track.mediaUrl],
          html5: true,
          volume: volume,
          onend: () => {
            if (queue.length > 0) {
              const nextTrack = queue[0];
              setQueue(prevQueue => prevQueue.slice(1));
              play(nextTrack);
            } else {
              setCurrentTrack(null);
              setIsPlaying(false);
            }
          },
          onplay: () => {
            setIsPlaying(true);
          },
          onpause: () => {
            setIsPlaying(false);
          },
          onstop: () => {
            setIsPlaying(false);
          },
          onloaderror: (id, error) => {
            console.error('Error loading audio:', error);
            setIsPlaying(false);
          },
          onplayerror: (id, error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          }
        });
        setCurrentTrack(track);
        soundRef.current.play();
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    }
  }, [volume, queue]);

  const pause = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!soundRef.current) return;
    if (isPlaying) {
      pause();
    } else {
      soundRef.current.play();
    }
  }, [isPlaying, pause]);

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(prevQueue => prevQueue.slice(1));
      play(nextTrack);
    }
  }, [queue, play]);

  const playPrevious = useCallback(() => {
    // For now, just restart the current track
    if (soundRef.current) {
      soundRef.current.seek(0);
    }
  }, []);

  const setPlayerVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  const addToQueue = useCallback((tracks) => {
    setQueue(prevQueue => [...prevQueue, ...(Array.isArray(tracks) ? tracks : [tracks])]);
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    queue,
    play,
    pause,
    togglePlay,
    playNext,
    playPrevious,
    setVolume: setPlayerVolume,
    addToQueue
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