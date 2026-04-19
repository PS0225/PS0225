import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Layout from '../components/Layout';
import { User, Mail, Calendar, Coins, Users, Gift } from 'lucide-react';

function Profile({ user, logout, setUser }) {
  const [stats, setStats] = useState({
    totalMined: 0,
    totalReferrals: 0,
    tasksCompleted: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user stats from various endpoints
      const [walletRes, referralsRes, tasksRes] = await Promise.all([
        axios.get(`${API}/wallet`),
        axios.get(`${API}/referrals`),
        axios.get(`${API}/social-tasks`)
      ]);

      const miningTransactions = walletRes.data.transactions.filter(
        (t) => t.type === 'mining'
      );
      const totalMined = miningTransactions.reduce((sum, t) => sum + t.amount, 0);

      const tasksCompleted = tasksRes.data.filter((t) => t.completed).length;

      setStats({
        totalMined,
        totalReferrals: referralsRes.data.total_referrals,
        tasksCompleted
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Layout user={user} logout={logout}>
      <div className="space-y-8" data-testid="profile-page">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="profile-title">Profile</h1>
          <p className="text-gray-400">Your account information and statistics</p>
        </div>

        {/* Profile Card */}
        <div className="card-gradient p-8 rounded-xl" data-testid="profile-card">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2" data-testid="profile-name">{user.name}</h2>
              <div className="text-gray-400" data-testid="profile-username">@{user.username}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 text-gray-400 mb-2">
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </div>
              <div className="font-semibold" data-testid="profile-email">{user.email}</div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 text-gray-400 mb-2">
                <Calendar className="w-5 h-5" />
                <span>Member Since</span>
              </div>
              <div className="font-semibold" data-testid="profile-joined">{formatDate(user.created_at)}</div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 text-gray-400 mb-2">
                <Gift className="w-5 h-5" />
                <span>Referral Code</span>
              </div>
              <div className="font-semibold text-purple-400" data-testid="profile-referral-code">{user.referral_code}</div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 text-gray-400 mb-2">
                <Coins className="w-5 h-5" />
                <span>Level</span>
              </div>
              <div className="font-semibold" data-testid="profile-level">Level {user.level}</div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-gradient p-6 rounded-xl" data-testid="total-mined-card">
            <div className="flex items-center justify-between mb-4">
              <Coins className="w-8 h-8 text-purple-400" />
              {/* Stable PNRP Logo (No Spinning) */}
              <div style={{width: '48px', height: '48px', position: 'relative'}}>
                <div className="pnrp-coin-3d" style={{width: '48px', height: '48px'}}>
                  <div className="pnrp-coin-side pnrp-coin-front">
                    <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full">
                      <defs>
                        <path id="profileStatsTopCurve" d="M 20,42 A 56,56 0 0,1 120,42" />
                        <path id="profileStatsBottomCurve" d="M 18,104 A 62,58 0 0,0 122,104" />
                      </defs>
                      <path d="M 25,46 A 52,52 0 0,1 115,46" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      <path d="M 25,89 A 52,52 0 0,0 115,89" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                        <textPath href="#profileStatsTopCurve" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                      </text>
                      <text className="coin-curved-text" fill="white" fontSize="10" fontWeight="900" letterSpacing="1.8">
                        <textPath href="#profileStatsBottomCurve" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                      </text>
                    </svg>
                    <div className="pnrp-coin-text" style={{fontSize: '14px'}}>PNRP</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold mb-2" data-testid="total-mined">{stats.totalMined.toFixed(2)}</div>
            <div className="text-gray-400">Total Mined PNRP</div>
          </div>

          <div className="card-gradient p-6 rounded-xl" data-testid="total-referrals-card">
            <Users className="w-8 h-8 text-green-400 mb-4" />
            <div className="text-3xl font-bold mb-2" data-testid="total-referrals-stat">{stats.totalReferrals}</div>
            <div className="text-gray-400">Referrals</div>
          </div>

          <div className="card-gradient p-6 rounded-xl" data-testid="tasks-completed-card">
            <Gift className="w-8 h-8 text-yellow-400 mb-4" />
            <div className="text-3xl font-bold mb-2" data-testid="tasks-completed">{stats.tasksCompleted}</div>
            <div className="text-gray-400">Tasks Completed</div>
          </div>
        </div>

        {/* About Section */}
        <div className="card-gradient p-8 rounded-xl" data-testid="about-section">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <User className="w-6 h-6 mr-3 text-purple-400" />
            About
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Welcome to Platinum Network!</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You are part of an exclusive mining community earning PNRP tokens through our innovative platform. 
                Your journey started on <span className="text-white font-semibold">{formatDate(user.created_at)}</span> and 
                you've already achieved <span className="text-white font-semibold">Level {user.level}</span>!
              </p>
              <p className="text-gray-300 leading-relaxed">
                Continue mining, invite friends using your referral code, and complete social tasks to maximize your rewards. 
                The more active you are, the more PNRP you earn!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-5 rounded-lg border border-purple-500/20">
                <h4 className="font-semibold mb-2 text-purple-300">🎯 Your Achievements</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>✓ Account created and verified</li>
                  <li>✓ {stats.totalMined.toFixed(0)} PNRP mined successfully</li>
                  <li>✓ {stats.totalReferrals} friends referred</li>
                  <li>✓ {stats.tasksCompleted} social tasks completed</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-5 rounded-lg border border-green-500/20">
                <h4 className="font-semibold mb-2 text-green-300">📊 Account Status</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>🟢 Active Mining Account</li>
                  <li className="flex items-center">
                    💰 Current Balance: 
                    <span className="font-bold text-white ml-2 flex items-center">
                      {/* Stable PNRP Logo on LEFT */}
                      <div style={{width: '28px', height: '28px', position: 'relative', display: 'inline-block', marginRight: '8px'}}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <svg viewBox="0 0 140 140" style={{position: 'absolute', width: '100%', height: '100%'}}>
                            <defs>
                              <path id="profileBalanceTop" d="M 20,42 A 56,56 0 0,1 120,42" />
                              <path id="profileBalanceBottom" d="M 18,104 A 62,58 0 0,0 122,104" />
                            </defs>
                            <path d="M 25,46 A 52,52 0 0,1 115,46" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                            <path d="M 25,89 A 52,52 0 0,0 115,89" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                            <text fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                              <textPath href="#profileBalanceTop" startOffset="50%" textAnchor="middle">PLATINUM</textPath>
                            </text>
                            <text fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                              <textPath href="#profileBalanceBottom" startOffset="50%" textAnchor="middle">NETWORK</textPath>
                            </text>
                          </svg>
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '8px',
                            fontWeight: '900',
                            color: 'white',
                            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                            zIndex: 10
                          }}>PNRP</div>
                        </div>
                      </div>
                      {user.total_pnrp.toFixed(2)} PNRP
                    </span>
                  </li>
                  <li>🎖️ Rank: Level {user.level}</li>
                  <li>🔗 Referral Code: <span className="font-mono text-purple-400">{user.referral_code}</span></li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800/50 p-5 rounded-lg">
              <h4 className="font-semibold mb-3 text-yellow-400">💡 Tips for Success</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <div className="font-semibold text-white mb-1">⛏️ Daily Mining</div>
                  <p>Mine every 12 hours for consistent rewards</p>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">👥 Refer Friends</div>
                  <p>Earn 10% of your referrals' mining rewards</p>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">✅ Complete Tasks</div>
                  <p>Follow social media for bonus PNRP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
