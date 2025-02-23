import { useState, useEffect, useCallback } from 'react';
import { useLocation } from './useLocation';
import { useRewards } from '../contexts/rewardsContext';
import { calculateDistance, calculatePace } from '../utils/runCalculations';

export function useRunTracking() {
  const { currentLocation, locationHistory } = useLocation();
  const { goals, progress, updateProgress, unlockReward } = useRewards();
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [distance, setDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState(null);

  // Update distance and pace calculations
  useEffect(() => {
    if (isRunning && locationHistory.length >= 2) {
      const newDistance = calculateDistance(locationHistory);
      setDistance(newDistance);

      const newPace = calculatePace(
        locationHistory[locationHistory.length - 2],
        locationHistory[locationHistory.length - 1]
      );
      if (newPace) setCurrentPace(newPace);
    }
  }, [isRunning, locationHistory]);

  // Check goals and rewards
  useEffect(() => {
    if (!isRunning || !goals.length) return;

    goals.forEach(goal => {
      let currentValue = progress[goal.id] || 0;

      switch (goal.type) {
        case 'distance':
          currentValue = distance;
          break;
        case 'time':
          if (startTime) {
            currentValue = Math.floor((Date.now() - startTime) / 60000); // minutes
          }
          break;
        case 'streak':
          // Streak logic handled separately
          return;
      }

      // Update progress
      updateProgress(goal.id, currentValue);

      // Check if goal is newly completed
      if (currentValue >= goal.target && !goal.completed) {
        // Mark goal as completed
        unlockReward({
          id: `reward-${goal.id}`,
          title: `Completed: ${goal.title}`,
          description: `Achieved ${goal.title} goal!`,
          category: 'Goals',
          emoji: '🎯'
        });
      }
    });
  }, [isRunning, distance, startTime, goals, progress, updateProgress, unlockReward]);

  // Check for milestone rewards
  useEffect(() => {
    const milestones = [1, 5, 10, 21.1, 42.2]; // km
    const nextMilestone = milestones.find(m => distance >= m);
    
    if (nextMilestone && isRunning) {
      unlockReward({
        id: `milestone-${nextMilestone}`,
        title: `${nextMilestone}km Run`,
        description: `Completed a ${nextMilestone}km run!`,
        category: 'Milestones',
        emoji: '🏃‍♂️'
      });
    }
  }, [distance, isRunning, unlockReward]);

  const startRun = useCallback(() => {
    setIsRunning(true);
    setStartTime(Date.now());
    setDistance(0);
    setCurrentPace(null);
  }, []);

  const stopRun = useCallback(() => {
    setIsRunning(false);
    // Final distance and time are recorded in the goals/rewards system
  }, []);

  const pauseRun = useCallback(() => {
    setIsRunning(false);
    // Keep the current distance and time
  }, []);

  const resumeRun = useCallback(() => {
    setIsRunning(true);
  }, []);

  return {
    isRunning,
    currentLocation,
    locationHistory,
    distance,
    currentPace,
    startTime,
    startRun,
    stopRun,
    pauseRun,
    resumeRun
  };
} 