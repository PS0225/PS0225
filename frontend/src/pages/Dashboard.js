import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Layout from '../components/Layout';
import { Coins, Zap, Clock, TrendingUp, Gift, Video } from 'lucide-react';
import DailyCheckinModal from '../components/DailyCheckinModal';

function Dashboard({ user, logout }) {
  const [miningStatus, setMiningStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCheckin, setShowCheckin] = useState(false);
  const [adType, setAdType] = useState(null);
  const [watchingAd, setWatchingAd] = useState(false);

  useEffect(() => {
    fetchMiningStatus();
    const interval = setInterval(fetchMiningStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (miningStatus && miningStatus.has_active_session) {
      const interval = setInterval(() => {
        const remaining = miningStatus.session.time_remaining_seconds - 1;
        setTimeRemaining(Math.max(0, remaining));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [miningStatus]);

  const fetchMiningStatus = async () => {
    try {
      const response = await axios.get(`${API}/mining/status`);
      setMiningStatus(response.data);
      if (response.data.has_active_session) {
        setTimeRemaining(response.data.session.time_remaining_seconds);
      }
    } catch (error) {
      console.error('Error fetching mining status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startMining = async () => {
    try {
      await axios.post(`${API}/mining/start`);
      fetchMiningStatus();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to start mining');
    }
  };

  const claimRewards = async () => {
    try {
      const response = await axios.post(`${API}/mining/claim`);
      alert(`Claimed ${response.data.reward} PNRP!`);
      fetchMiningStatus();
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to claim rewards');
    }
  };

  const watchAd = async (type) => {
    setAdType(type);
    setWatchingAd(true);

    // Simulate ad watching (5 seconds)
    setTimeout(async () => {
      try {
        await axios.post(`${API}/mining/watch-ad?ad_type=${type}`);
        fetchMiningStatus();
        setWatchingAd(false);
        setAdType(null);
      } catch (error) {
        alert(error.response?.data?.detail || 'Failed to watch ad');
        setWatchingAd(false);
        setAdType(null);
      }
    }, 5000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <Layout user={user} logout={logout}>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} logout={logout}>
      <div className="space-y-8" data-testid="dashboard-page">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="dashboard-title">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.username}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-gradient p-6 rounded-xl" data-testid="total-pnrp-card">
            <div className="flex items-center justify-between mb-4">
              <Coins className="w-8 h-8 text-purple-400" />
              <div className="text-3xl font-bold">{user.total_pnrp.toFixed(2)}</div>
            </div>
            <div className="text-sm text-gray-400">Total PNRP</div>
          </div>

          <div className="card-gradient p-6 rounded-xl" data-testid="level-card">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="text-3xl font-bold">{user.level}</div>
            </div>
            <div className="text-sm text-gray-400">Level</div>
          </div>

          <div className="card-gradient p-6 rounded-xl cursor-pointer hover:opacity-80 transition" onClick={() => setShowCheckin(true)} data-testid="daily-checkin-card">
            <div className="flex items-center justify-between mb-4">
              <Gift className="w-8 h-8 text-yellow-400" />
              <div className="text-lg font-bold">Claim</div>
            </div>
            <div className="text-sm text-gray-400">Daily Check-in</div>
          </div>
        </div>

        {/* Mining Section */}
        <div className="card-gradient p-8 rounded-xl" data-testid="mining-section">
          <div className="text-center">
            <div className="coin-spin inline-block mb-6">
              <Coins className="w-24 h-24 text-purple-400" />
            </div>

            {!miningStatus.has_active_session ? (
              <div data-testid="start-mining-section">
                <h2 className="text-3xl font-bold mb-4">Start Mining PNRP</h2>
                <p className="text-gray-400 mb-6">Mine 50 PNRP in 12 hours</p>
                <button
                  onClick={startMining}
                  data-testid="start-mining-btn"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition glow"
                >
                  Start Mining
                </button>
              </div>
            ) : miningStatus.session.is_completed ? (
              <div data-testid="claim-mining-section">
                <h2 className="text-3xl font-bold mb-4">Mining Complete!</h2>
                <p className="text-gray-400 mb-6">Claim your {miningStatus.session.total_reward} PNRP rewards</p>
                <button
                  onClick={claimRewards}
                  data-testid="claim-mining-btn"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg font-semibold hover:opacity-90 transition glow"
                >
                  Claim Rewards
                </button>
              </div>
            ) : (
              <div data-testid="active-mining-section">
                <h2 className="text-3xl font-bold mb-4 mining-animation">Mining in Progress...</h2>
                <div className="text-5xl font-bold text-purple-400 mb-4" data-testid="mining-timer">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-gray-400 mb-6">
                  Earning {miningStatus.session.total_reward} PNRP ({miningStatus.session.speed_multiplier}x speed)
                </p>

                {/* Ad Boosts */}
                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  <div className="bg-gray-800/50 p-4 rounded-lg" data-testid="time-boost-card">
                    <div className="flex items-center justify-between mb-3">
                      <Clock className="w-6 h-6 text-blue-400" />
                      <span className="text-sm text-gray-400">
                        {miningStatus.session.time_boost_ads_watched}/2 ads
                      </span>
                    </div>
                    <h3 className="font-bold mb-2">Time Boost</h3>
                    <p className="text-sm text-gray-400 mb-3">Extend to 24 hours</p>
                    {miningStatus.session.time_boost_ads_watched < 2 && (
                      <button
                        onClick={() => watchAd('time_boost')}
                        disabled={watchingAd}
                        data-testid="watch-time-boost-btn"
                        className="w-full py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {watchingAd && adType === 'time_boost' ? 'Watching Ad...' : 'Watch Ad'}
                      </button>
                    )}
                    {miningStatus.session.duration_hours === 24 && (
                      <div className="text-green-400 text-sm">✓ Activated</div>
                    )}
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg" data-testid="speed-boost-card">
                    <div className="flex items-center justify-between mb-3">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      <span className="text-sm text-gray-400">
                        {miningStatus.session.speed_boost_ads_watched}/2 ads
                      </span>
                    </div>
                    <h3 className="font-bold mb-2">Speed Boost</h3>
                    <p className="text-sm text-gray-400 mb-3">2x mining speed</p>
                    {miningStatus.session.speed_boost_ads_watched < 2 && (
                      <button
                        onClick={() => watchAd('speed_boost')}
                        disabled={watchingAd}
                        data-testid="watch-speed-boost-btn"
                        className="w-full py-2 bg-yellow-600 rounded-lg text-sm hover:bg-yellow-700 transition disabled:opacity-50"
                      >
                        {watchingAd && adType === 'speed_boost' ? 'Watching Ad...' : 'Watch Ad'}
                      </button>
                    )}
                    {miningStatus.session.speed_multiplier === 2 && (
                      <div className="text-green-400 text-sm">✓ Activated</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ad Watching Modal */}
        {watchingAd && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" data-testid="ad-modal">
            <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md">
              <Video className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold mb-4">Watching Ad...</h3>
              <p className="text-gray-400">Please wait while the ad is playing</p>
              <div className="mt-4 text-purple-400">This will take 5 seconds</div>
            </div>
          </div>
        )}

        {/* Daily Checkin Modal */}
        {showCheckin && (
          <DailyCheckinModal onClose={() => setShowCheckin(false)} />
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
