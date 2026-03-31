import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Layout from '../components/Layout';
import { Users, Copy, Share2, TrendingUp } from 'lucide-react';

function Referrals({ user, logout }) {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await axios.get(`${API}/referrals`);
      setReferralData(response.data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    const text = `Join Platinum Network and start mining PNRP! Use my referral code: ${referralData.referral_code}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      alert(text);
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
      <div className="space-y-8" data-testid="referrals-page">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="referrals-title">Referrals</h1>
          <p className="text-gray-400">Invite friends and earn 10% of their mining rewards</p>
        </div>

        {/* Referral Code Card */}
        <div className="card-gradient p-8 rounded-xl" data-testid="referral-code-card">
          <div className="text-center mb-6">
            <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Referral Code</h2>
            <p className="text-gray-400">Share this code with your friends</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-purple-400" data-testid="referral-code">
              {referralData.referral_code}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyReferralCode}
                data-testid="copy-referral-btn"
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={shareReferral}
                data-testid="share-referral-btn"
                className="p-3 bg-pink-600 hover:bg-pink-700 rounded-lg transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {copied && (
            <div className="text-center text-green-400 text-sm" data-testid="copy-success">Copied to clipboard!</div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-gradient p-6 rounded-xl" data-testid="total-referrals-card">
            <Users className="w-8 h-8 text-purple-400 mb-4" />
            <div className="text-3xl font-bold mb-2" data-testid="total-referrals">{referralData.total_referrals}</div>
            <div className="text-gray-400">Total Referrals</div>
          </div>

          <div className="card-gradient p-6 rounded-xl" data-testid="total-earnings-card">
            <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
            <div className="text-3xl font-bold mb-2" data-testid="total-earnings">{referralData.total_earnings.toFixed(2)} PNRP</div>
            <div className="text-gray-400">Total Earnings</div>
          </div>
        </div>

        {/* Referrals List */}
        <div className="card-gradient p-6 rounded-xl" data-testid="referrals-list">
          <h2 className="text-2xl font-bold mb-6">Your Referrals</h2>

          {referralData.referrals.length === 0 ? (
            <div className="text-center text-gray-400 py-8" data-testid="no-referrals">
              No referrals yet. Start inviting friends!
            </div>
          ) : (
            <div className="space-y-3">
              {referralData.referrals.map((referral) => (
                <div
                  key={referral.id}
                  data-testid={`referral-${referral.id}`}
                  className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold" data-testid={`referral-username-${referral.id}`}>{referral.username}</div>
                    <div className="text-sm text-gray-400">{referral.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" data-testid={`referral-balance-${referral.id}`}>{referral.total_pnrp.toFixed(2)} PNRP</div>
                    <div className="text-xs text-gray-400">Total Balance</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Referrals;
