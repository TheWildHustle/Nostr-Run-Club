import { useState } from 'react';
import { useEvents } from '../contexts/eventsContext';
import { EventCard } from '../components/EventCard';
import { EventRegistration } from '../components/EventRegistration';
import { ResultSubmission } from '../components/ResultSubmission';
import { StravaConnect } from '../components/StravaConnect';

export function Events() {
  const { events, registrations, results, medals } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [activeTab, setActiveTab] = useState('available');

  const filterEvents = () => {
    switch (activeTab) {
      case 'registered':
        return events.filter(event => 
          registrations.some(reg => 
            reg.eventId === event.id && reg.status === 'registered'
          )
        );
      case 'completed':
        return events.filter(event =>
          results.some(result => result.eventId === event.id)
        );
      default:
        return events.filter(event => 
          !registrations.some(reg => reg.eventId === event.id)
        );
    }
  };

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowRegistration(true);
  };

  const handleSubmitResult = (event) => {
    setSelectedEvent(event);
    setShowSubmission(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Virtual Races</h1>
        <StravaConnect />
      </div>

      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === 'available'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('available')}
        >
          Available
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === 'registered'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('registered')}
        >
          Registered
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filterEvents().map(event => (
          <EventCard
            key={event.id}
            event={event}
            registration={registrations.find(reg => reg.eventId === event.id)}
            result={results.find(res => res.eventId === event.id)}
            medal={medals.find(medal => medal.eventId === event.id)}
            onRegister={() => handleRegister(event)}
            onSubmitResult={() => handleSubmitResult(event)}
          />
        ))}
      </div>

      {showRegistration && selectedEvent && (
        <EventRegistration
          event={selectedEvent}
          onClose={() => {
            setShowRegistration(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {showSubmission && selectedEvent && (
        <ResultSubmission
          event={selectedEvent}
          onClose={() => {
            setShowSubmission(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
} 