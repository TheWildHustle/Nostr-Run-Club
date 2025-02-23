import { createContext, useReducer, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNostr } from './NostrContext.jsx';
import { generatePaymentRequest, verifyPayment } from '../utils/lightning';

export const SubscriptionContext = createContext(null);

const SUBSCRIPTION_PRICE_SATS = 3000;

const initialState = {
  isSubscribed: false,
  subscriptionEndDate: null,
  teamMembers: [],
  paymentStatus: null,
  pendingInvoice: null,
  error: null,
  badges: [],
  discounts: {}
};

function subscriptionReducer(state, action) {
  switch (action.type) {
    case 'SET_SUBSCRIPTION':
      return {
        ...state,
        isSubscribed: true,
        subscriptionEndDate: action.payload.endDate,
        error: null
      };

    case 'SUBSCRIPTION_EXPIRED':
      return {
        ...state,
        isSubscribed: false,
        subscriptionEndDate: null,
        error: 'Subscription expired'
      };

    case 'PAYMENT_PENDING':
      return {
        ...state,
        paymentStatus: 'pending',
        pendingInvoice: action.payload.invoice,
        error: null
      };

    case 'PAYMENT_SUCCESS':
      return {
        ...state,
        paymentStatus: 'success',
        pendingInvoice: null,
        error: null
      };

    case 'PAYMENT_FAILED':
      return {
        ...state,
        paymentStatus: 'failed',
        pendingInvoice: null,
        error: action.payload.error
      };

    case 'UPDATE_TEAM':
      return {
        ...state,
        teamMembers: action.payload.members
      };

    case 'ADD_BADGE':
      return {
        ...state,
        badges: [...state.badges, action.payload.badge]
      };

    case 'SET_DISCOUNT':
      return {
        ...state,
        discounts: {
          ...state.discounts,
          [action.payload.eventId]: action.payload.amount
        }
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
}

export function SubscriptionProvider({ children }) {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const { npub, sendNostrDM } = useNostr();

  // Check subscription status on mount and periodically
  const checkSubscriptionStatus = useCallback(async () => {
    if (!npub) return;

    try {
      // Check subscription status from your backend
      const response = await fetch(`/api/subscription/status/${npub}`);
      const data = await response.json();

      if (data.isActive) {
        dispatch({
          type: 'SET_SUBSCRIPTION',
          payload: { endDate: new Date(data.endDate) }
        });
      } else if (state.isSubscribed) {
        dispatch({ type: 'SUBSCRIPTION_EXPIRED' });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to check subscription status' });
    }
  }, [npub, state.isSubscribed]);

  // Initialize subscription payment
  const initiateSubscription = async () => {
    if (!npub) {
      dispatch({ type: 'SET_ERROR', payload: 'Please connect your Nostr account' });
      return;
    }

    try {
      // Generate Lightning invoice
      const invoice = await generatePaymentRequest(SUBSCRIPTION_PRICE_SATS);
      
      // Send invoice via Nostr DM
      await sendNostrDM({
        recipient: npub,
        content: JSON.stringify({
          type: 'subscription_invoice',
          invoice: invoice.paymentRequest,
          amount: SUBSCRIPTION_PRICE_SATS,
          validUntil: invoice.expiresAt
        })
      });

      dispatch({
        type: 'PAYMENT_PENDING',
        payload: { invoice: invoice.paymentRequest }
      });

      // Start polling for payment verification
      const checkPayment = async () => {
        const isPaid = await verifyPayment(invoice.paymentHash);
        if (isPaid) {
          dispatch({ type: 'PAYMENT_SUCCESS' });
          // Update subscription status
          await activateSubscription();
        }
      };

      const pollInterval = setInterval(checkPayment, 5000);
      setTimeout(() => {
        clearInterval(pollInterval);
        if (state.paymentStatus === 'pending') {
          dispatch({
            type: 'PAYMENT_FAILED',
            payload: { error: 'Payment timeout' }
          });
        }
      }, 15 * 60 * 1000); // 15 minutes timeout
    } catch (error) {
      console.error('Subscription payment error:', error);
      dispatch({
        type: 'PAYMENT_FAILED',
        payload: { error: 'Failed to create payment request' }
      });
    }
  };

  // Activate subscription after successful payment
  const activateSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          npub,
          subscriptionType: 'monthly'
        })
      });

      const data = await response.json();
      if (data.success) {
        dispatch({
          type: 'SET_SUBSCRIPTION',
          payload: { endDate: new Date(data.endDate) }
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Subscription activation error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to activate subscription' });
    }
  };

  // Team management functions
  const createTeam = async (teamName, memberNpubs) => {
    if (!state.isSubscribed) {
      dispatch({ type: 'SET_ERROR', payload: 'Subscription required to create team' });
      return;
    }

    if (memberNpubs.length > 3) {
      dispatch({ type: 'SET_ERROR', payload: 'Maximum team size is 4 members' });
      return;
    }

    try {
      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: teamName,
          owner: npub,
          members: memberNpubs
        })
      });

      const data = await response.json();
      if (data.success) {
        dispatch({
          type: 'UPDATE_TEAM',
          payload: { members: [...memberNpubs, npub] }
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Team creation error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create team' });
    }
  };

  // Badge management
  const awardBadge = async (badgeType) => {
    if (!state.isSubscribed) return;

    try {
      const response = await fetch('/api/badges/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          npub,
          badgeType
        })
      });

      const data = await response.json();
      if (data.success) {
        dispatch({
          type: 'ADD_BADGE',
          payload: { badge: data.badge }
        });

        // Post achievement to social media
        await postAchievement(data.badge);
      }
    } catch (error) {
      console.error('Badge award error:', error);
    }
  };

  // Social media integration
  const postAchievement = async (achievement) => {
    try {
      await sendNostrDM({
        recipient: npub,
        content: JSON.stringify({
          type: 'achievement',
          achievement: achievement,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Achievement post error:', error);
    }
  };

  const value = {
    ...state,
    initiateSubscription,
    checkSubscriptionStatus,
    createTeam,
    awardBadge
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

SubscriptionProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 