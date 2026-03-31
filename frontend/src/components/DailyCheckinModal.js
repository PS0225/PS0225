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
      const response = await axios.get(`${API}/checkin/status`);
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
        await axios.post(`${API}/checkin/watch-ad`);
        setWatching(false);
        claimReward();
      } catch (error) {
        alert(error.response?.data?.detail || 'Failed to watch ad');
        setWatching(false);
      }
    }, 5000);
  };

  const claimReward = async () => {
    setClaiming(true);
    try {
      const response = await axios.post(`${API}/checkin/claim`);
      alert(`Claimed ${response.data.reward} PNRP!`);
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to claim reward');
      setClaiming(false);
    }
  };

  const rewards = [5, 10, 15, 20, 25, 30, 50];

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
          ) : status.checked_in_today ? (
            <div data-testid="already-checked-in">
              <p className="text-green-400 mb-4">✓ Already checked in today!</p>
              <p className="text-gray-400">Come back tomorrow for more rewards</p>
            </div>
          ) : watching ? (
            <div data-testid="watching-ad">
              <Video className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Watching Ad...</h3>
              <p className="text-gray-400">Please wait 5 seconds</p>
            </div>
          ) : (
            <div data-testid="checkin-available">
              {/* Days Progress */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {rewards.map((reward, index) => {
                  const day = index + 1;
                  const isCurrent = day === status.current_day;
                  const isPast = day < status.current_day;
                  return (
                    <div
                      key={day}
                      data-testid={`day-${day}`}
                      className={`p-3 rounded-lg text-center ${
                        isCurrent
                          ? 'bg-purple-600 ring-2 ring-purple-400'
                          : isPast
                          ? 'bg-green-600/30'
                          : 'bg-gray-700'
                      }`}
                    >
                      <div className="text-xs text-gray-400">Day {day}</div>
                      <div className="font-bold text-sm">{reward}</div>
                      {isPast && <div className="text-xs text-green-400">✓</div>}
                    </div>
                  );
                })}
              </div>

              <div className="bg-purple-600/20 p-4 rounded-lg mb-4">
                <div className="text-3xl font-bold text-purple-400 mb-2">Day {status.current_day}</div>
                <div className="text-2xl font-bold mb-2">+{status.reward} PNRP</div>
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
