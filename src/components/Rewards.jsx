import { useRewards } from '../contexts/rewardsContext';

export function Rewards() {
  const { rewards } = useRewards();

  const groupRewardsByCategory = () => {
    return rewards.reduce((acc, reward) => {
      const category = reward.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(reward);
      return acc;
    }, {});
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const groupedRewards = groupRewardsByCategory();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Rewards</h2>
      
      {Object.keys(groupedRewards).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No rewards earned yet.</p>
          <p className="text-gray-400">Complete goals to earn rewards!</p>
        </div>
      ) : (
        Object.entries(groupedRewards).map(([category, categoryRewards]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{reward.emoji || '🏆'}</span>
                    <h4 className="font-semibold">{reward.title}</h4>
                  </div>
                  {reward.description && (
                    <p className="text-gray-600 text-sm mb-2">
                      {reward.description}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs">
                    Earned on {formatDate(reward.unlockedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
} 