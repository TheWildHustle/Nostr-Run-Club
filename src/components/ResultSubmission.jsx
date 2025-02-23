import { useState } from 'react';
import PropTypes from 'prop-types';
import { useEvents } from '../contexts/eventsContext';
import { useNostr } from '../contexts/nostrContext';

export function ResultSubmission({ event, onClose }) {
  const { submitResult, unlockMedal } = useEvents();
  const { npub } = useNostr();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    hours: '',
    minutes: '',
    seconds: '',
    distance: event.distances[0],
    stravaActivityId: '',
    proofImage: null
  });

  const handleStravaImport = async () => {
    // Implement Strava activity import
    // This would fetch the activity details from Strava
    console.log('Importing from Strava...');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        proofImage: file
      }));
    }
  };

  const validateForm = () => {
    if (!formData.hours && !formData.minutes && !formData.seconds) {
      return 'Please enter your finish time';
    }
    if (!formData.distance) {
      return 'Please select a distance';
    }
    if (!formData.stravaActivityId && !formData.proofImage) {
      return 'Please provide proof of your run (Strava activity or image)';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Convert time to total seconds
      const totalSeconds = 
        (parseInt(formData.hours || '0') * 3600) +
        (parseInt(formData.minutes || '0') * 60) +
        parseInt(formData.seconds || '0');

      // Submit result
      await submitResult(event.id, npub, {
        time: totalSeconds,
        distance: formData.distance,
        stravaActivityId: formData.stravaActivityId,
        proofImageUrl: formData.proofImage ? URL.createObjectURL(formData.proofImage) : null
      });

      // Unlock medal
      await unlockMedal(event.id, npub, 'finisher');

      onClose();
    } catch (err) {
      setError('Failed to submit result. Please try again.');
      console.error('Result submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Submit Result for {event.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Distance</label>
            <select
              value={formData.distance}
              onChange={(e) => setFormData(prev => ({ ...prev, distance: Number(e.target.value) }))}
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

          <div>
            <label className="block text-gray-700 mb-2">Finish Time</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="HH"
                min="0"
                max="99"
                value={formData.hours}
                onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                className="w-20 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="MM"
                min="0"
                max="59"
                value={formData.minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, minutes: e.target.value }))}
                className="w-20 p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="SS"
                min="0"
                max="59"
                value={formData.seconds}
                onChange={(e) => setFormData(prev => ({ ...prev, seconds: e.target.value }))}
                className="w-20 p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700">Proof of Run</label>
            
            <button
              type="button"
              onClick={handleStravaImport}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Import from Strava
            </button>

            <div className="text-center text-gray-500">or</div>

            <div className="border-2 border-dashed rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="proof-image"
              />
              <label
                htmlFor="proof-image"
                className="block text-center cursor-pointer text-blue-500 hover:text-blue-600"
              >
                Upload Screenshot/Photo
              </label>
              {formData.proofImage && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {formData.proofImage.name}
                </div>
              )}
            </div>
          </div>

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
              disabled={isSubmitting}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ResultSubmission.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    distances: PropTypes.arrayOf(PropTypes.number).isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}; 