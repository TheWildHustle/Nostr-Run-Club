import { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react-refresh/only-export-components
export const EventsContext = createContext(null);

const initialState = {
  events: [],
  registrations: [],
  results: [],
  medals: []
};

function eventsReducer(state, action) {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload
      };

    case 'REGISTER_EVENT':
      return {
        ...state,
        registrations: [...state.registrations, {
          id: `reg-${Date.now()}`,
          eventId: action.payload.eventId,
          userId: action.payload.userId,
          registeredAt: Date.now(),
          status: 'registered',
          paymentStatus: action.payload.paymentStatus
        }]
      };

    case 'SUBMIT_RESULT':
      return {
        ...state,
        results: [...state.results, {
          id: `result-${Date.now()}`,
          eventId: action.payload.eventId,
          userId: action.payload.userId,
          submittedAt: Date.now(),
          ...action.payload.result
        }],
        registrations: state.registrations.map(reg =>
          reg.eventId === action.payload.eventId && reg.userId === action.payload.userId
            ? { ...reg, status: 'completed' }
            : reg
        )
      };

    case 'UNLOCK_MEDAL':
      return {
        ...state,
        medals: [...state.medals, {
          id: `medal-${Date.now()}`,
          eventId: action.payload.eventId,
          userId: action.payload.userId,
          unlockedAt: Date.now(),
          type: action.payload.type
        }]
      };

    case 'CONNECT_STRAVA':
      return {
        ...state,
        stravaConnected: true,
        stravaToken: action.payload.token
      };

    default:
      return state;
  }
}

export function EventsProvider({ children }) {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const value = {
    ...state,
    dispatch,
    registerForEvent: (eventId, userId, paymentStatus) => 
      dispatch({ 
        type: 'REGISTER_EVENT', 
        payload: { eventId, userId, paymentStatus } 
      }),
    submitResult: (eventId, userId, result) =>
      dispatch({
        type: 'SUBMIT_RESULT',
        payload: { eventId, userId, result }
      }),
    unlockMedal: (eventId, userId, type) =>
      dispatch({
        type: 'UNLOCK_MEDAL',
        payload: { eventId, userId, type }
      }),
    connectStrava: (token) =>
      dispatch({
        type: 'CONNECT_STRAVA',
        payload: { token }
      })
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}

EventsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// eslint-disable-next-line react-refresh/only-export-components
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
} 