import { useState } from 'react';
import { useSubscription } from '../contexts/subscriptionContext';
import { useNostr } from '../contexts/NostrContext.jsx';

export function TeamManager() {
  const { isSubscribed, teamMembers, createTeam, error } = useSubscription();
  const { npub } = useNostr();
  const [teamName, setTeamName] = useState('');
  const [memberNpubs, setMemberNpubs] = useState(['', '', '']);
  const [isCreating, setIsCreating] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const validateNpub = (npub) => {
    // Basic npub validation - you might want to make this more robust
    return npub.startsWith('npub1') && npub.length === 63;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    // Validate team name
    if (!teamName.trim()) {
      setValidationError('Please enter a team name');
      return;
    }

    // Filter out empty npubs and validate format
    const validMembers = memberNpubs.filter(npub => npub.trim());
    const invalidNpubs = validMembers.filter(npub => !validateNpub(npub));

    if (invalidNpubs.length > 0) {
      setValidationError('One or more npub addresses are invalid');
      return;
    }

    if (validMembers.length === 0) {
      setValidationError('Please add at least one team member');
      return;
    }

    if (validMembers.length > 3) {
      setValidationError('Maximum team size is 4 members (including you)');
      return;
    }

    if (new Set(validMembers).size !== validMembers.length) {
      setValidationError('Duplicate team members are not allowed');
      return;
    }

    if (validMembers.includes(npub)) {
      setValidationError('You are automatically added to the team');
      return;
    }

    setIsCreating(true);
    try {
      await createTeam(teamName, validMembers);
      // Reset form on success
      setTeamName('');
      setMemberNpubs(['', '', '']);
    } catch (err) {
      console.error('Team creation error:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isSubscribed) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Premium subscription required to create and manage teams.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Team Management</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {validationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {validationError}
          </div>
        )}

        {teamMembers.length > 0 ? (
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Your Team</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">👑</span>
                  <span className="font-medium">You ({npub})</span>
                </li>
                {teamMembers.map((member, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-gray-500 mr-2">👤</span>
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter team name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Team Members (npub)</label>
              <p className="text-sm text-gray-600 mb-4">
                Add up to 3 team members (you&apos;ll be automatically added as the team captain)
              </p>
              
              {memberNpubs.map((npub, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={npub}
                    onChange={(e) => {
                      const newMembers = [...memberNpubs];
                      newMembers[index] = e.target.value;
                      setMemberNpubs(newMembers);
                    }}
                    className="w-full p-2 border rounded"
                    placeholder={`Team member ${index + 1} npub`}
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating Team...' : 'Create Team'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 
