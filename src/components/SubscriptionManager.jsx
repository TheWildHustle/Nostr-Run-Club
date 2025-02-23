import { useState, useEffect } from 'react';
import { useSubscription } from '../contexts/subscriptionContext';
import { checkLightningConnection } from '../utils/lightning';

export function SubscriptionManager() {
  const {
    isSubscribed,
    subscriptionEndDate,
    paymentStatus,
    pendingInvoice,
    error,
    badges,
    initiateSubscription,
    checkSubscriptionStatus
  } = useSubscription();

  const [lightningStatus, setLightningStatus] = useState({
    connected: false,
    error: null
  });

  useEffect(() => {
    // Check Lightning connection on mount
    const checkConnection = async () => {
      const status = await checkLightningConnection();
      setLightningStatus(status);
    };
    checkConnection();

    // Check subscription status
    checkSubscriptionStatus();

    // Set up periodic subscription check
    const interval = setInterval(checkSubscriptionStatus, 60 * 60 * 1000); // Every hour
    return () => clearInterval(interval);
  }, [checkSubscriptionStatus]);

  const handleSubscribe = async () => {
    if (!lightningStatus.connected) {
      alert('Please connect your Lightning wallet to subscribe');
      return;
    }
    await initiateSubscription();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Premium Membership</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isSubscribed ? (
          <div>
            <p className="mb-4">
              Upgrade to Premium for exclusive features:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Create and manage running teams (up to 4 members)</li>
              <li>Exclusive premium member badge</li>
              <li>Event registration discounts</li>
              <li>Social media achievement sharing</li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Monthly Subscription</span>
                <span className="text-lg">3,000 sats</span>
              </div>
              <p className="text-sm text-gray-600">
                Billed monthly via Lightning Network
              </p>
            </div>

            {!lightningStatus.connected && (
              <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                Lightning wallet not detected. Please connect your wallet to subscribe.
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={!lightningStatus.connected || paymentStatus === 'pending'}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {paymentStatus === 'pending' ? 'Processing Payment...' : 'Subscribe Now'}
            </button>

            {pendingInvoice && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Please complete the payment using your Lightning wallet:
                </p>
                <code className="block bg-gray-100 p-2 rounded text-xs break-all">
                  {pendingInvoice}
                </code>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-2">⚡</span>
              <div>
                <h3 className="font-semibold">Active Premium Membership</h3>
                <p className="text-sm text-gray-600">
                  Valid until {formatDate(subscriptionEndDate)}
                </p>
              </div>
            </div>

            {badges.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Your Badges</h3>
                <div className="flex gap-2">
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                      title={badge.name}
                    >
                      {badge.emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
              Thank you for being a premium member! Enjoy your exclusive features.
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 