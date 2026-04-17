import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Layout from '../components/Layout';
import { Coins, Zap, Clock, TrendingUp, Gift, Video, Send, MessageCircle, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import DailyCheckinModal from '../components/DailyCheckinModal';

function Dashboard({ user, logout }) {
  const [miningStatus, setMiningStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCheckin, setShowCheckin] = useState(false);
  const [adType, setAdType] = useState(null);
  const [watchingAd, setWatchingAd] = useState(false);
  const [dailyRewardStatus, setDailyRewardStatus] = useState(null);
  const [watchingDailyAd, setWatchingDailyAd] = useState(false);

  useEffect(() => {
    fetchMiningStatus();
    fetchDailyRewardStatus();
    const interval = setInterval(() => {
      fetchMiningStatus();
      fetchDailyRewardStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (miningStatus && miningStatus.has_active_session && !miningStatus.session.is_completed) {
      // Update timer from server data
      setTimeRemaining(miningStatus.session.time_remaining_seconds);
    }
  }, [miningStatus]);

  // Separate effect for countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeRemaining]);

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

  const fetchDailyRewardStatus = async () => {
    try {
      const response = await axios.get(`${API}/daily-reward/status`);
      setDailyRewardStatus(response.data);
    } catch (error) {
      console.error('Error fetching daily reward status:', error);
    }
  };

  const watchDailyRewardAd = async () => {
    setWatchingDailyAd(true);
    
    // Simulate ad watching (5 seconds)
    setTimeout(async () => {
      try {
        const response = await axios.post(`${API}/daily-reward/watch-ad`);
        
        // Detailed success message
        alert(`✅ Daily Reward Claimed!\n\n🎁 Reward ${response.data.ad_number}/3 Completed\n💰 Earned: +${response.data.reward} PNRP\n📊 New Balance: ${response.data.new_balance} PNRP\n⏳ Remaining: ${response.data.remaining_ads}\n\nPage will refresh to update your balance...`);
        
        // Force reload
        setTimeout(() => {
          window.location.href = window.location.href;
        }, 1000);
      } catch (error) {
        alert(error.response?.data?.detail || 'Failed to claim reward');
        setWatchingDailyAd(false);
      }
    }, 5000);
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
      
      // Show detailed success message
      alert(`✅ Mining Reward Claimed!\n\n⛏️ Mining Reward: +${response.data.reward} PNRP\n💰 New Balance: ${response.data.new_balance} PNRP\n\nPage will refresh to update your balance...`);
      
      // Force reload after delay
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to claim rewards';
      alert(`❌ Error: ${errorMsg}`);
      
      // If no completed session, refresh to update status
      if (errorMsg.includes('No completed mining session')) {
        setTimeout(() => {
          fetchMiningStatus();
        }, 1000);
      }
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
      <div className="relative">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="space-y-8 relative z-10" data-testid="dashboard-page">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="dashboard-title">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.username}!</p>
        </div>

        {/* Mining Section - Responsive Box */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="card-gradient p-6 md:p-8 rounded-2xl relative overflow-hidden" data-testid="mining-section">
            {/* Animated Background Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="text-center relative z-10">
              {/* PNRP Coin - Always visible */}
              <div className="coin-spin inline-block mb-6">
                <div className="pnrp-coin-3d">
                  <div className="pnrp-coin-side pnrp-coin-front">
                    <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full">
                      <defs>
                        <path id="topCurve" d="M 20,42 A 56,56 0 0,1 120,42" />
                        <path id="bottomCurve" d="M 20,106 A 56,56 0 0,0 120,106" />
                      </defs>
                      
                      {/* Decorative curved lines wrapping around text */}
                      {/* Top text - curved line below wrapping left to right */}
                      <path d="M 25,46 A 52,52 0 0,1 115,46" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      
                      {/* Bottom text - curved line above wrapping left to right */}
                      <path d="M 25,98 A 52,52 0 0,0 115,98" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      
                      <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                        <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
                          PLATINUM • NETWORK
                        </textPath>
                      </text>
                      <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                        <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
                          PLATINUM • NETWORK
                        </textPath>
                      </text>
                    </svg>
                    <div className="pnrp-coin-text">PNRP</div>
                  </div>
                  <div className="pnrp-coin-side pnrp-coin-back">
                    <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full" style={{transform: 'rotateY(180deg) scaleX(-1)'}}>
                      <defs>
                        <path id="topCurveBack" d="M 20,42 A 56,56 0 0,1 120,42" />
                        <path id="bottomCurveBack" d="M 20,106 A 56,56 0 0,0 120,106" />
                      </defs>
                      
                      {/* Decorative curved lines wrapping around text */}
                      {/* Top text - curved line below wrapping left to right */}
                      <path d="M 25,46 A 52,52 0 0,1 115,46" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      
                      {/* Bottom text - curved line above wrapping left to right */}
                      <path d="M 25,98 A 52,52 0 0,0 115,98" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      
                      <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                        <textPath href="#topCurveBack" startOffset="50%" textAnchor="middle">
                          PLATINUM • NETWORK
                        </textPath>
                      </text>
                      <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                        <textPath href="#bottomCurveBack" startOffset="50%" textAnchor="middle">
                          PLATINUM • NETWORK
                        </textPath>
                      </text>
                    </svg>
                    <div className="pnrp-coin-text">PNRP</div>
                  </div>
                </div>
              </div>

              {!miningStatus?.has_active_session ? (
              <div data-testid="start-mining-section" className="slide-in">
                <h2 className="text-4xl font-bold mb-2 neon-text">Start Mining PNRP</h2>
                <p className="text-xl text-gray-400 mb-2">Earn rewards every 12 hours</p>
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <div className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <span className="text-2xl font-bold text-blue-400">50 PNRP</span>
                  </div>
                  <span className="text-gray-500">→</span>
                  <div className="px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
                    <span className="text-2xl font-bold text-green-400">100 PNRP</span>
                    <span className="text-sm text-gray-400 ml-2">(with boosts)</span>
                  </div>
                </div>
                <button
                  onClick={startMining}
                  data-testid="start-mining-btn"
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-full font-bold text-lg hover:opacity-90 transition glow transform hover:scale-105"
                >
                  🚀 Start Mining Now
                </button>
              </div>
            ) : miningStatus?.session?.is_completed ? (
              <div data-testid="claim-mining-section" className="success-effect">
                <div className="mb-6">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-4xl font-bold mb-4 text-green-400">Mining Complete!</h2>
                </div>
                <div className="inline-block px-8 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border-2 border-green-500/50 mb-6">
                  <div className="text-sm text-gray-400 mb-1">Your Reward</div>
                  <div className="text-5xl font-bold text-green-400 number-counter">
                    +{miningStatus.session.total_reward} PNRP
                  </div>
                </div>
                <button
                  onClick={claimRewards}
                  data-testid="claim-mining-btn"
                  className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full font-bold text-lg hover:opacity-90 transition glow transform hover:scale-105"
                >
                  💰 Claim Rewards
                </button>
              </div>
            ) : (
              <div data-testid="active-mining-section">
                <h2 className="text-3xl font-bold mb-2 mining-animation">⛏️ Mining in Progress...</h2>
                <p className="text-gray-400 mb-6">Please wait while we mine your PNRP</p>
                
                {/* Timer Display */}
                <div className="inline-block mb-6 px-8 py-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30">
                  <div className="text-6xl font-bold text-blue-400 mb-2" data-testid="mining-timer">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-gray-400">Time Remaining</div>
                </div>

                {/* Reward Info */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="px-6 py-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <div className="text-sm text-gray-400">Earning</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {miningStatus.session.total_reward} PNRP
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                    <div className="text-sm text-gray-400">Speed</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {miningStatus.session.speed_multiplier}x
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Ad Watching Modal - Mining */}
        {watchingAd && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" data-testid="ad-modal">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-3xl text-center max-w-md border border-blue-500/30 glow">
              <div className="relative">
                <Video className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-pulse" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
              </div>
              <h3 className="text-3xl font-bold mb-4 gradient-text">Watching Ad...</h3>
              <p className="text-gray-400 mb-6">Mining boost advertisement</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <div className="mt-6 text-blue-400 font-semibold">⏱️ 5 seconds remaining</div>
            </div>
          </div>
        )}

        {/* Ad Watching Modal - Daily Reward */}
        {watchingDailyAd && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" data-testid="daily-ad-modal">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-10 rounded-3xl text-center max-w-md border border-purple-500/30 glow">
              <div className="relative">
                <Gift className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-pulse" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
              </div>
              <h3 className="text-3xl font-bold mb-4 gradient-text">Watching Ad...</h3>
              <p className="text-gray-400 mb-2">Daily reward advertisement</p>
              {dailyRewardStatus && (
                <p className="text-purple-400 font-semibold mb-6">
                  Ad {dailyRewardStatus.ads_watched + 1}/3 - Earn {dailyRewardStatus.next_reward} PNRP
                </p>
              )}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <div className="mt-6 text-purple-400 font-semibold">⏱️ 5 seconds remaining</div>
            </div>
          </div>
        )}

        {/* 4-Part Stats Grid - Below Mining Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Balance Box */}
          <div className="card-gradient p-6 rounded-2xl hover:scale-105 transition-transform duration-300" data-testid="balance-box">
            <div className="flex items-center justify-center mb-3">
              {/* Stable PNRP Coin Logo (No Spinning) */}
              <div style={{width: '56px', height: '56px', position: 'relative'}}>
                <div className="pnrp-coin-3d" style={{width: '56px', height: '56px'}}>
                  <div className="pnrp-coin-side pnrp-coin-front">
                    <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full">
                      <defs>
                        <path id="balanceBoxTopCurve" d="M 20,42 A 56,56 0 0,1 120,42" />
                        <path id="balanceBoxBottomCurve" d="M 18,104 A 62,58 0 0,0 122,104" />
                      </defs>
                      <path d="M 25,46 A 52,52 0 0,1 115,46" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      <path d="M 25,89 A 52,52 0 0,0 115,89" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                        <textPath href="#balanceBoxTopCurve" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                      </text>
                      <text className="coin-curved-text" fill="white" fontSize="10" fontWeight="900" letterSpacing="1.8">
                        <textPath href="#balanceBoxBottomCurve" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                      </text>
                    </svg>
                    <div className="pnrp-coin-text" style={{fontSize: '16px'}}>PNRP</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold number-counter gradient-text mb-2">{user.total_pnrp.toFixed(2)}</div>
            <div className="text-sm text-gray-400">Balance</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>

          {/* Level Box */}
          <div className="card-gradient p-6 rounded-2xl hover:scale-105 transition-transform duration-300" data-testid="level-box">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold number-counter text-green-400 mb-2">{user.level}</div>
            <div className="text-sm text-gray-400">Level</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>

          {/* Daily Reward Box */}
          {dailyRewardStatus && (
            <div className="card-gradient p-6 rounded-2xl hover:scale-105 transition-transform duration-300" data-testid="daily-reward-box">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Gift className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-2">{dailyRewardStatus.ads_watched}/3</div>
              <div className="text-sm text-gray-400 mb-2">Daily Reward</div>
              {dailyRewardStatus.can_claim ? (
                <button
                  onClick={watchDailyRewardAd}
                  disabled={watchingDailyAd}
                  className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                >
                  {watchingDailyAd ? '⏳...' : `🎁 +${dailyRewardStatus.next_reward}`}
                </button>
              ) : (
                <div className="text-green-400 text-xs text-center mt-2">✅ Done!</div>
              )}
              <div className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          )}

          {/* Daily Check-in Box */}
          <div className="card-gradient p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 group" onClick={() => setShowCheckin(true)} data-testid="daily-checkin-box">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:scale-110 transition">
                <Gift className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-2">Claim</div>
            <div className="text-sm text-gray-400">Daily Check-in</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full group-hover:animate-pulse"></div>
          </div>
        </div>

        {/* Boost Cards - Below 4-Part Grid (Only visible when mining is active) */}
        {miningStatus?.has_active_session && !miningStatus?.session?.is_completed && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Time Boost Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition" data-testid="time-boost-card">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-blue-400" />
                <span className="text-sm px-3 py-1 bg-blue-500/30 rounded-full text-blue-300">
                  {miningStatus.session.time_boost_ads_watched}/2
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">⏰ Time Boost</h3>
              <p className="text-sm text-gray-400 mb-4">Extend mining from 12h to 24h</p>
              {miningStatus.session.time_boost_ads_watched < 2 ? (
                <button
                  onClick={() => watchAd('time_boost')}
                  disabled={watchingAd}
                  data-testid="watch-time-boost-btn"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {watchingAd && adType === 'time_boost' ? '⏳ Activating...' : '⚡ Activate'}
                </button>
              ) : (
                <div className="text-green-400 text-center font-semibold">
                  ✅ 24H Active
                </div>
              )}
            </div>

            {/* Speed Boost Card */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition" data-testid="speed-boost-card">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
                <span className="text-sm px-3 py-1 bg-purple-500/30 rounded-full text-purple-300">
                  {miningStatus.session.speed_boost_ads_watched}/5
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">⚡ Boost Mining</h3>
              <p className="text-sm text-gray-400 mb-4">Activate 2x mining speed</p>
              {miningStatus.session.speed_boost_ads_watched < 5 ? (
                <button
                  onClick={() => watchAd('speed_boost')}
                  disabled={watchingAd}
                  data-testid="watch-speed-boost-btn"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {watchingAd && adType === 'speed_boost' ? '⏳ Activating...' : '⚡ Activate'}
                </button>
              ) : (
                <div className="text-green-400 text-center font-semibold">
                  ✅ 2x Speed Active
                </div>
              )}
            </div>
          </div>
        )}

        {/* Join Community Section - Icon Only */}
        <div className="card-gradient p-6 rounded-2xl">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2">🌐 Join Our Community</h2>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            {/* Telegram */}
            <a 
              href="https://t.me/platinumnetwork" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-[#0088CC] hover:bg-[#0077B3] p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
              title="Telegram"
            >
              <Send className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
            </a>

            {/* Discord */}
            <a 
              href="https://discord.gg/platinumnetwork" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-[#5865F2] hover:bg-[#4752C4] p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
              title="Discord"
            >
              <MessageCircle className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
            </a>

            {/* Twitter/X */}
            <a 
              href="https://twitter.com/platinumnetwork" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-[#000000] hover:bg-[#1a1a1a] p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl border border-gray-700"
              title="Twitter"
            >
              <Twitter className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/platinumnetwork" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
              title="Instagram"
            >
              <Instagram className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com/@platinumnetwork" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-[#FF0000] hover:bg-[#CC0000] p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
              title="YouTube"
            >
              <Youtube className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
            </a>
          </div>
        </div>

        {/* Daily Checkin Modal */}
        {showCheckin && (
          <DailyCheckinModal onClose={() => setShowCheckin(false)} />
        )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
