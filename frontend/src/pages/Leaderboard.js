import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Layout from '../components/Layout';
import { Trophy, Medal, Award } from 'lucide-react';

function Leaderboard({ user, logout }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/leaderboard`);
      setLeaders(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-amber-600" />;
    return null;
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
      <div className="space-y-8" data-testid="leaderboard-page">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="leaderboard-title">Leaderboard</h1>
          <p className="text-gray-400">Top miners on Platinum Network</p>
        </div>

        {/* Top 3 Podium */}
        {leaders.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8" data-testid="top-3-podium">
            {/* 2nd Place */}
            <div className="card-gradient p-6 rounded-xl text-center order-2 md:order-1" data-testid="rank-2">
              <Medal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">#{2}</div>
              <div className="text-xl font-semibold mb-2">{leaders[1].username}</div>
              <div className="text-2xl font-bold text-purple-400">{leaders[1].total_pnrp.toFixed(2)} PNRP</div>
            </div>

            {/* 1st Place */}
            <div className="card-gradient p-8 rounded-xl text-center order-1 md:order-2 glow" data-testid="rank-1">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">#{1}</div>
              <div className="text-2xl font-semibold mb-2">{leaders[0].username}</div>
              <div className="text-3xl font-bold text-purple-400">{leaders[0].total_pnrp.toFixed(2)} PNRP</div>
            </div>

            {/* 3rd Place */}
            <div className="card-gradient p-6 rounded-xl text-center order-3" data-testid="rank-3">
              <Award className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">#{3}</div>
              <div className="text-xl font-semibold mb-2">{leaders[2].username}</div>
              <div className="text-2xl font-bold text-purple-400">{leaders[2].total_pnrp.toFixed(2)} PNRP</div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="card-gradient p-6 rounded-xl" data-testid="leaderboard-list">
          <h2 className="text-2xl font-bold mb-6">All Miners</h2>

          {leaders.length === 0 ? (
            <div className="text-center text-gray-400 py-8" data-testid="no-leaders">
              No miners yet. Be the first!
            </div>
          ) : (
            <div className="space-y-2">
              {leaders.map((leader, index) => {
                const rank = index + 1;
                const isCurrentUser = leader.id === user.id;
                return (
                  <div
                    key={leader.id}
                    data-testid={`leader-${rank}`}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      isCurrentUser
                        ? 'bg-purple-600/30 border border-purple-500'
                        : 'bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        {getMedalIcon(rank) || (
                          <div className="text-2xl font-bold text-gray-400" data-testid={`leader-rank-${rank}`}>#{rank}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold" data-testid={`leader-username-${rank}`}>
                          {leader.username}
                          {isCurrentUser && <span className="ml-2 text-purple-400">(You)</span>}
                        </div>
                        <div className="text-sm text-gray-400">Level {leader.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-400" data-testid={`leader-balance-${rank}`}>
                        {leader.total_pnrp.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">PNRP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Leaderboard;
