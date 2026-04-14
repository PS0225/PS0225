import { Link, useLocation } from 'react-router-dom';
import { Coins, Home, Wallet as WalletIcon, Users, Gift, Trophy, User, LogOut, Shield, Info } from 'lucide-react';

function Layout({ user, logout, children }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/wallet', icon: WalletIcon, label: 'Wallet' },
    { path: '/referrals', icon: Users, label: 'Referrals' },
    { path: '/social-tasks', icon: Gift, label: 'Tasks' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/about', icon: Info, label: 'About' },
  ];

  if (user.is_admin) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden" data-testid="layout">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(79, 172, 254, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 172, 254, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-40 shadow-lg shadow-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3" data-testid="layout-logo">
              <div className="coin-spin" style={{width: '40px', height: '40px'}}>
                <div className="pnrp-coin-3d" style={{width: '40px', height: '40px'}}>
                  <div className="pnrp-coin-side pnrp-coin-front">
                    <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full">
                      <defs>
                        <path id="headerTopCurve" d="M 20,42 A 56,56 0 0,1 120,42" />
                        <path id="headerBottomCurve" d="M 18,104 A 62,58 0 0,0 122,104" />
                      </defs>
                      <path d="M 25,46 A 52,52 0 0,1 115,46" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      <path d="M 25,89 A 52,52 0 0,0 115,89" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                        <textPath href="#headerTopCurve" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                      </text>
                      <text className="coin-curved-text" fill="white" fontSize="10" fontWeight="900" letterSpacing="1.8">
                        <textPath href="#headerBottomCurve" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                      </text>
                    </svg>
                    <div className="pnrp-coin-text" style={{fontSize: '12px'}}>PNRP</div>
                  </div>
                  <div className="pnrp-coin-side pnrp-coin-back">
                    <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full" style={{transform: 'rotateY(180deg) scaleX(-1)'}}>
                      <defs>
                        <path id="headerTopCurveBack" d="M 20,42 A 56,56 0 0,1 120,42" />
                        <path id="headerBottomCurveBack" d="M 18,104 A 62,58 0 0,0 122,104" />
                      </defs>
                      <path d="M 25,46 A 52,52 0 0,1 115,46" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      <path d="M 25,89 A 52,52 0 0,0 115,89" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                      <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                        <textPath href="#headerTopCurveBack" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                      </text>
                      <text className="coin-curved-text" fill="white" fontSize="10" fontWeight="900" letterSpacing="1.8">
                        <textPath href="#headerBottomCurveBack" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                      </text>
                    </svg>
                    <div className="pnrp-coin-text" style={{fontSize: '12px'}}>PNRP</div>
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold gradient-text">Platinum Network</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30 glow" data-testid="header-balance">
                {/* Small stable PNRP coin */}
                <div style={{width: '24px', height: '24px', position: 'relative'}}>
                  <div className="pnrp-coin-side" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f7931a 0%, #fdb931 50%, #f7931a 100%)',
                    border: '2px solid #ffb938',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.3), 0 0 10px rgba(247, 147, 26, 0.5)'
                  }}>
                    <div style={{
                      fontSize: '7px',
                      fontWeight: '900',
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '0.5px'
                    }}>PNRP</div>
                  </div>
                </div>
                <span className="font-bold text-lg gradient-text">{user.total_pnrp.toFixed(2)} PNRP</span>
              </div>
              <Link
                to="/profile"
                data-testid="header-profile-btn"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Profile</span>
              </Link>
              <button
                onClick={logout}
                data-testid="logout-btn"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/30 backdrop-blur-xl border-r border-blue-500/20 min-h-[calc(100vh-4rem)] sticky top-16 hidden md:block" data-testid="sidebar">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'text-gray-400 hover:bg-blue-500/10 hover:text-white hover:scale-102'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="container mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-blue-500/20 z-40 shadow-2xl shadow-blue-500/10" data-testid="mobile-nav">
        <div className="grid grid-cols-5 items-center h-16">
          {[
            navItems[0], // Dashboard
            navItems[1], // Wallet
            navItems[2], // Referrals
            navItems[4], // Leaderboard
            navItems[5], // Profile
          ].filter(Boolean).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                  isActive ? 'text-blue-400 scale-110' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Layout;
