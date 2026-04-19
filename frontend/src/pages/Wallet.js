import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Layout from '../components/Layout';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Clock, Send, Download, RefreshCw } from 'lucide-react';

function Wallet({ user, logout }) {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await axios.get(`${API}/wallet`);
      setWalletData(response.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'mining' || type === 'daily_checkin' || type === 'social_task' || type === 'referral'
      ? <TrendingUp className="w-5 h-5 text-green-400" />
      : <TrendingDown className="w-5 h-5 text-red-400" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleTGEFeature = (featureName) => {
    alert(`🔒 ${featureName}\n\nYe feature TGE (Token Generation Event) ke samay available hoga.\n\nPlease wait for the official token launch!`);
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
      <div className="space-y-8" data-testid="wallet-page">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="wallet-title">Wallet</h1>
          <p className="text-gray-400">View your PNRP balance and transactions</p>
        </div>

        {/* Balance Card */}
        <div className="card-gradient p-8 rounded-xl text-center" data-testid="balance-card">
          <WalletIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <div className="text-sm text-gray-400 mb-2">Total Balance</div>
          <div className="text-5xl font-bold text-purple-400 mb-4" data-testid="wallet-balance">
            {walletData.total_pnrp.toFixed(2)}
          </div>
          <div className="text-xl text-gray-400">PNRP</div>
        </div>

        {/* Wallet Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleTGEFeature('Send PNRP')}
            className="card-gradient p-6 rounded-xl hover:scale-105 transition-transform duration-200 border-2 border-purple-500/30 hover:border-purple-400"
            data-testid="send-button"
          >
            <Send className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="font-bold text-lg">Send</div>
            <div className="text-sm text-gray-400 mt-1">Transfer PNRP</div>
          </button>

          <button
            onClick={() => handleTGEFeature('Receive PNRP')}
            className="card-gradient p-6 rounded-xl hover:scale-105 transition-transform duration-200 border-2 border-green-500/30 hover:border-green-400"
            data-testid="receive-button"
          >
            <Download className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="font-bold text-lg">Receive</div>
            <div className="text-sm text-gray-400 mt-1">Get PNRP</div>
          </button>

          <button
            onClick={() => handleTGEFeature('Swap PNRP')}
            className="card-gradient p-6 rounded-xl hover:scale-105 transition-transform duration-200 border-2 border-blue-500/30 hover:border-blue-400"
            data-testid="swap-button"
          >
            <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="font-bold text-lg">Swap</div>
            <div className="text-sm text-gray-400 mt-1">Exchange</div>
          </button>
        </div>

        {/* Transactions */}
        <div className="card-gradient p-6 rounded-xl" data-testid="transactions-section">
          <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

          {walletData.transactions.length === 0 ? (
            <div className="text-center text-gray-400 py-8" data-testid="no-transactions">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {walletData.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  data-testid={`transaction-${transaction.id}`}
                  className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-semibold" data-testid={`transaction-desc-${transaction.id}`}>{transaction.description}</div>
                      <div className="text-sm text-gray-400 flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(transaction.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400" data-testid={`transaction-amount-${transaction.id}`}>
                      +{transaction.amount.toFixed(2)} PNRP
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{transaction.type.replace('_', ' ')}</div>
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

export default Wallet;
