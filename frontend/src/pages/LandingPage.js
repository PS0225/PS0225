import { Link } from 'react-router-dom';
import { Coins, Users, Gift, Trophy, Zap, TrendingUp } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Coins className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold gradient-text">Platinum Network</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="px-6 py-2 text-white hover:text-purple-300 transition" data-testid="landing-login-btn">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition" data-testid="landing-register-btn">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center py-20">
          {/* PNRP Coin Logo */}
          <div className="inline-block mb-8">
            <svg viewBox="0 0 140 140" className="w-32 h-32">
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 1}} />
                  <stop offset="50%" style={{stopColor: '#FFA500', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#FF8C00', stopOpacity: 1}} />
                </linearGradient>
                <filter id="heroShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4"/>
                </filter>
              </defs>
              
              {/* Outer circle */}
              <circle cx="70" cy="70" r="65" fill="url(#heroGradient)" filter="url(#heroShadow)" />
              
              {/* Inner border */}
              <circle cx="70" cy="70" r="58" fill="none" stroke="#FFD700" strokeWidth="3" opacity="0.8" />
              
              {/* PNRP Text */}
              <text x="70" y="82" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" style={{textShadow: '0 2px 4px rgba(0,0,0,0.6)', letterSpacing: '1.2px'}}>
                PNRP
              </text>
              
              {/* Decorative dots */}
              <circle cx="70" cy="20" r="3" fill="white" opacity="0.8" />
              <circle cx="70" cy="120" r="3" fill="white" opacity="0.8" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold mb-6" data-testid="landing-title">
            Start Mining <span className="gradient-text">PNRP</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto" data-testid="landing-subtitle">
            Join Platinum Network and start earning PNRP tokens through mining, referrals, and daily tasks
          </p>
          <Link to="/register" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-lg font-semibold hover:opacity-90 transition glow" data-testid="landing-cta-btn">
            Start Mining Now
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="card-gradient p-8 rounded-xl text-center slide-in" data-testid="feature-mining">
            <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Mine PNRP</h3>
            <p className="text-gray-400">Earn 50 PNRP every 12 hours. Boost to 100 PNRP with ads!</p>
          </div>
          <div className="card-gradient p-8 rounded-xl text-center slide-in" data-testid="feature-referrals">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Refer & Earn</h3>
            <p className="text-gray-400">Get 10% of your referrals' daily earnings forever!</p>
          </div>
          <div className="card-gradient p-8 rounded-xl text-center slide-in" data-testid="feature-rewards">
            <Gift className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Daily Rewards</h3>
            <p className="text-gray-400">Check-in daily to earn up to 50 PNRP per day!</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 text-center">
          <div data-testid="stat-users">
            <div className="text-4xl font-bold text-purple-400">10,000+</div>
            <div className="text-gray-400 mt-2">Active Miners</div>
          </div>
          <div data-testid="stat-distributed">
            <div className="text-4xl font-bold text-purple-400">1M+</div>
            <div className="text-gray-400 mt-2">PNRP Distributed</div>
          </div>
          <div data-testid="stat-rewards">
            <div className="text-4xl font-bold text-purple-400">24/7</div>
            <div className="text-gray-400 mt-2">Mining Active</div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div data-testid="step-1">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold mb-2">Register</h3>
              <p className="text-gray-400">Create your free account</p>
            </div>
            <div data-testid="step-2">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold mb-2">Start Mining</h3>
              <p className="text-gray-400">Begin your first mining session</p>
            </div>
            <div data-testid="step-3">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold mb-2">Complete Tasks</h3>
              <p className="text-gray-400">Earn more from daily tasks</p>
            </div>
            <div data-testid="step-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-bold mb-2">Withdraw</h3>
              <p className="text-gray-400">Get your PNRP rewards</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-32 text-center text-gray-500 pb-8">
          <p>© 2025 Platinum Network. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
