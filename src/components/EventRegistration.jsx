import { useState } from 'react';
import PropTypes from 'prop-types';
import { useEvents } from '../contexts/eventsContext';
import { useNostr } from '../contexts/nostrContext';

export function EventRegistration({ event, onClose }) {
  const { registerForEvent } = useEvents();
  const { npub } = useNostr();
  const [selectedDistance, setSelectedDistance] = useState(event.distances[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Here you would integrate with your payment processing system
      // For now, we'll simulate a successful payment
      const paymentResult = {
        status: 'success',
        transactionId: `tx-${Date.now()}`
      };

      await registerForEvent(event.id, npub, paymentResult);
      onClose();
    } catch (err) {
      setError('Failed to process registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Register for {event.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Select Distance</label>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            >
              {event.distances.map(distance => (
                <option key={distance} value={distance}>
                  {distance}km
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Registration Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Entry Fee</span>
                <span>{event.price.toFixed(2)} USD</span>
              </li>
              {event.charity && (
                <li className="flex justify-between text-green-600">
                  <span>Charity Donation</span>
                  <span>{(event.price * 0.1).toFixed(2)} USD</span>
                </li>
              )}
              <li className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{event.price.toFixed(2)} USD</span>
              </li>
            </ul>
          </div>

          {event.swagDetails && (
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Race Swag</h3>
              <p className="text-sm text-gray-600">{event.swagDetails}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isProcessing ? 'Processing...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EventRegistration.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    distances: PropTypes.arrayOf(PropTypes.number).isRequired,
    price: PropTypes.number.isRequired,
    charity: PropTypes.string,
    swagDetails: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired
}; 