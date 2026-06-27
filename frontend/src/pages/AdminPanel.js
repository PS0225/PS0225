import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Layout from '../components/Layout';
import { Shield, Users, Coins, TrendingUp, Activity } from 'lucide-react';

function AdminPanel({ user, logout }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="space-y-8" data-testid="admin-panel">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold" data-testid="admin-title">Admin Panel</h1>
          </div>
          <p className="text-gray-400">Platform statistics and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-gradient p-6 rounded-xl border-2 border-blue-500/30" data-testid="total-users-card">
            <Users className="w-8 h-8 text-blue-400 mb-4" />
            <div className="text-3xl font-bold mb-2" data-testid="total-users">{stats.total_users}</div>
            <div className="text-gray-400">Total Users</div>
          </div>

          <div className="card-gradient p-6 rounded-xl border-2 border-green-500/30" data-testid="total-mining-pnrp-card">
            <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
            <div className="text-3xl font-bold mb-2 text-green-400" data-testid="total-mining-pnrp">
              {stats.total_mining_pnrp.toFixed(2)}
            </div>
            <div className="text-gray-400">Total Session PNRP</div>
          </div>

          <div className="card-gradient p-6 rounded-xl border-2 border-purple-500/30" data-testid="total-pnrp-card">
            <Coins className="w-8 h-8 text-purple-400 mb-4" />
            <div className="text-3xl font-bold mb-2" data-testid="total-pnrp-distributed">
              {stats.total_pnrp_distributed.toFixed(2)}
            </div>
            <div className="text-gray-400">Total PNRP Distributed</div>
          </div>

          <div className="card-gradient p-6 rounded-xl border-2 border-yellow-500/30" data-testid="active-mining-card">
            <Activity className="w-8 h-8 text-yellow-400 mb-4" />
            <div className="text-3xl font-bold mb-2" data-testid="active-mining">
              {stats.active_mining_sessions}
            </div>
            <div className="text-gray-400">Active Mining</div>
          </div>
        </div>

        {/* Info */}
        <div className="card-gradient p-6 rounded-xl" data-testid="admin-info">
          <h2 className="text-2xl font-bold mb-4">Platform Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">Mining System</span>
              <span className="text-green-400 font-semibold" data-testid="mining-status">✓ Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">Referral System</span>
              <span className="text-green-400 font-semibold" data-testid="referral-status">✓ Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">Daily Check-in</span>
              <span className="text-green-400 font-semibold" data-testid="checkin-status">✓ Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">Social Tasks</span>
              <span className="text-green-400 font-semibold" data-testid="tasks-status">✓ Active</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminPanel;

