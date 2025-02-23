import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

export function EventCard({ 
  event, 
  registration, 
  result, 
  medal, 
  onRegister, 
  onSubmitResult 
}) {
  const isRegistered = !!registration;
  const isCompleted = !!result;
  const hasMedal = !!medal;

  const formatDeadline = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={event.imageUrl || '/default-event-banner.jpg'} 
        alt={event.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{event.name}</h3>
          {hasMedal && (
            <span className="text-2xl" title="Medal Earned">🏅</span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <span className="mr-2">🏃‍♂️</span>
            {event.distances.map((distance, index) => (
              <span key={distance} className="mr-2">
                {distance}km
                {index < event.distances.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>

          <div className="flex items-center text-gray-600">
            <span className="mr-2">⏰</span>
            <span>Register by {formatDeadline(event.registrationDeadline)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <span className="mr-2">📅</span>
            <span>Complete between {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
          </div>

          {event.charity && (
            <div className="flex items-center text-gray-600">
              <span className="mr-2">💝</span>
              <span>Supporting {event.charity}</span>
            </div>
          )}

          <div className="flex items-center text-gray-600">
            <span className="mr-2">💰</span>
            <span>{formatPrice(event.price)}</span>
          </div>
        </div>

        {event.swagDetails && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Race Swag</h4>
            <p className="text-sm text-gray-600">{event.swagDetails}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          {!isRegistered && !isCompleted && (
            <button
              onClick={onRegister}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Register Now
            </button>
          )}

          {isRegistered && !isCompleted && (
            <button
              onClick={onSubmitResult}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit Result
            </button>
          )}

          {isCompleted && (
            <div className="w-full text-center bg-gray-100 px-4 py-2 rounded">
              Completed! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    distances: PropTypes.arrayOf(PropTypes.number).isRequired,
    registrationDeadline: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    charity: PropTypes.string,
    swagDetails: PropTypes.string
  }).isRequired,
  registration: PropTypes.object,
  result: PropTypes.object,
  medal: PropTypes.object,
  onRegister: PropTypes.func.isRequired,
  onSubmitResult: PropTypes.func.isRequired
}; 