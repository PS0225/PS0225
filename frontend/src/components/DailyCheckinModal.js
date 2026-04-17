import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { X, Gift, Video } from 'lucide-react';

function DailyCheckinModal({ onClose }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watching, setWatching] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API}/daily-reward/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStatus(response.data);
    } catch (error) {
      console.error('Error fetching check-in status:', error);
    } finally {
      setLoading(false);
    }
  };

  const watchAd = async () => {
    setWatching(true);
    // Simulate ad watching (5 seconds)
    setTimeout(async () => {
      try {
        await axios.post(`${API}/daily-reward/watch-ad`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setWatching(false);
        // Refresh status after watching ad
        await fetchStatus();
        alert('✅ Daily reward claimed successfully!');
        window.location.reload();
      } catch (error) {
        alert(error.response?.data?.detail || 'Failed to claim reward');
        setWatching(false);
      }
    }, 5000);
  };

  const claimReward = async () => {
    setClaiming(true);
    try {
      const response = await axios.post(`${API}/checkin/claim`);
      
      // Show success message with clear balance info
      alert(`✅ Daily Check-in Success!\n\n🎁 Reward: +${response.data.reward} PNRP\n💰 New Balance: ${response.data.new_balance} PNRP\n📅 Day ${response.data.day}/7\n\nPage will refresh to update your balance...`);
      
      // Force reload after a short delay
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to claim reward';
      alert(`❌ Error: ${errorMsg}`);
      setClaiming(false);
      
      // If already claimed, close modal and refresh
      if (errorMsg.includes('Already checked in')) {
        setTimeout(() => {
          onClose();
          window.location.href = window.location.href;
        }, 1000);
      }
    }
  };

  const rewards = [10, 15, 25];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" data-testid="daily-checkin-modal">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          data-testid="close-modal-btn"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <Gift className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Daily Check-in</h2>

          {loading ? (
            <div>Loading...</div>
          ) : !status ? (
            <div>Error loading status. Please try again.</div>
          ) : !status.can_claim ? (
            <div data-testid="already-checked-in">
              <p className="text-green-400 mb-4 text-lg font-semibold">✅ All Ads Claimed Today!</p>
              <p className="text-gray-400 mb-4">You've watched all {status.total_ads} ads for today</p>
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                <div className="text-sm text-gray-400 mb-2">Total Earned Today</div>
                <div className="text-3xl font-bold text-green-400 mb-1">
                  +{status.total_earned_today} PNRP
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Close
              </button>
            </div>
          ) : watching ? (
            <div data-testid="watching-ad">
              <Video className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Watching Ad...</h3>
              <p className="text-gray-400">Please wait 5 seconds</p>
            </div>
          ) : (
            <div data-testid="checkin-available">
              {/* Ads Progress */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {rewards.map((reward, index) => {
                  const adNumber = index + 1;
                  const isCurrent = adNumber === status.next_ad_number;
                  const isPast = adNumber <= status.ads_watched;
                  return (
                    <div
                      key={adNumber}
                      data-testid={`ad-${adNumber}`}
                      className={`p-3 rounded-lg text-center ${
                        isCurrent
                          ? 'bg-purple-600 ring-2 ring-purple-400'
                          : isPast
                          ? 'bg-green-600/30'
                          : 'bg-gray-700'
                      }`}
                    >
                      <div className="text-xs text-gray-400">Ad {adNumber}</div>
                      <div className="font-bold text-sm">{reward}</div>
                      {isPast && <div className="text-xs text-green-400">✓</div>}
                    </div>
                  );
                })}
              </div>

              <div className="bg-purple-600/20 p-4 rounded-lg mb-4">
                <div className="text-3xl font-bold text-purple-400 mb-2">Ad {status.next_ad_number}/3</div>
                <div className="text-2xl font-bold mb-2">+{status.next_reward} PNRP</div>
                <p className="text-sm text-gray-400">Watch an ad to claim your reward</p>
              </div>

              <button
                onClick={watchAd}
                disabled={claiming}
                data-testid="watch-ad-checkin-btn"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Watch Ad & Claim
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyCheckinModal;
