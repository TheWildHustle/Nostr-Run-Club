import { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react-refresh/only-export-components
export const RewardsContext = createContext(null);

const initialState = {
  rewards: [],
  goals: [],
  progress: {}
};

function rewardsReducer(state, action) {
  switch (action.type) {
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, {
          id: `goal-${Date.now()}`,
          ...action.payload,
          createdAt: Date.now(),
          completed: false
        }]
      };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id ? { ...goal, ...action.payload } : goal
        )
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.id]: action.payload.progress
        }
      };

    case 'UNLOCK_REWARD':
      return {
        ...state,
        rewards: [...state.rewards, {
          id: action.payload.id,
          unlockedAt: Date.now(),
          ...action.payload
        }]
      };

    default:
      return state;
  }
}

export function RewardsProvider({ children }) {
  const [state, dispatch] = useReducer(rewardsReducer, initialState);

  const value = {
    ...state,
    dispatch,
    addGoal: (goal) => dispatch({ type: 'ADD_GOAL', payload: goal }),
    updateGoal: (goal) => dispatch({ type: 'UPDATE_GOAL', payload: goal }),
    deleteGoal: (id) => dispatch({ type: 'DELETE_GOAL', payload: id }),
    updateProgress: (id, progress) => dispatch({ 
      type: 'UPDATE_PROGRESS', 
      payload: { id, progress } 
    }),
    unlockReward: (reward) => dispatch({ type: 'UNLOCK_REWARD', payload: reward })
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
}

RewardsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// eslint-disable-next-line react-refresh/only-export-components
export function useRewards() {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
} 