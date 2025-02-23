import { useState } from 'react';
import { useRewards } from '../contexts/rewardsContext';

export function Goals() {
  const { goals, addGoal, deleteGoal, progress } = useRewards();
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    type: 'distance', // distance, time, or streak
    deadline: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addGoal({
      ...newGoal,
      target: parseFloat(newGoal.target),
      deadline: newGoal.deadline ? new Date(newGoal.deadline).getTime() : null
    });
    setNewGoal({
      title: '',
      target: '',
      type: 'distance',
      deadline: '',
      description: ''
    });
  };

  const calculateProgress = (goal) => {
    const currentProgress = progress[goal.id] || 0;
    return Math.min((currentProgress / goal.target) * 100, 100);
  };

  const formatProgress = (goal) => {
    const currentProgress = progress[goal.id] || 0;
    switch (goal.type) {
      case 'distance':
        return `${currentProgress.toFixed(2)}km / ${goal.target}km`;
      case 'time':
        return `${Math.floor(currentProgress / 60)}h ${currentProgress % 60}m / ${Math.floor(goal.target / 60)}h ${goal.target % 60}m`;
      case 'streak':
        return `${currentProgress} / ${goal.target} days`;
      default:
        return `${currentProgress} / ${goal.target}`;
    }
  };

  const isGoalCompleted = (goal) => {
    const currentProgress = progress[goal.id] || 0;
    return currentProgress >= goal.target;
  };

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    const now = Date.now();
    const remaining = deadline - now;
    if (remaining <= 0) return 'Expired';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    return `${days} days remaining`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal Title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <select
              value={newGoal.type}
              onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="distance">Distance (km)</option>
              <option value="time">Time (minutes)</option>
              <option value="streak">Streak (days)</option>
            </select>
            <input
              type="number"
              placeholder="Target"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              className="p-2 border rounded"
              required
              min="0"
              step={newGoal.type === 'distance' ? '0.01' : '1'}
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="p-2 border rounded"
              min={new Date().toISOString().split('T')[0]}
            />
            <textarea
              placeholder="Description (optional)"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              className="p-2 border rounded md:col-span-2"
              rows="2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Goal
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
        {goals.length === 0 ? (
          <p className="text-gray-500">No goals set yet. Create one above!</p>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className={`border rounded-lg p-4 ${
                isGoalCompleted(goal) ? 'bg-green-50 border-green-200' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{goal.title}</h3>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
              {goal.description && (
                <p className="text-gray-600 mb-2">{goal.description}</p>
              )}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatProgress(goal)}</span>
                  {goal.deadline && (
                    <span>{getTimeRemaining(goal.deadline)}</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isGoalCompleted(goal) ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${calculateProgress(goal)}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
