import { Link, useLocation } from 'react-router-dom';
import { Coins, Home, Wallet as WalletIcon, Users, Gift, Trophy, User, LogOut, Shield } from 'lucide-react';

function Layout({ user, logout, children }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/wallet', icon: WalletIcon, label: 'Wallet' },
    { path: '/referrals', icon: Users, label: 'Referrals' },
    { path: '/social-tasks', icon: Gift, label: 'Tasks' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (user.is_admin) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" data-testid="layout">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2" data-testid="layout-logo">
              <Coins className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold gradient-text">Platinum Network</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 rounded-lg" data-testid="header-balance">
                <Coins className="w-5 h-5 text-purple-400" />
                <span className="font-bold">{user.total_pnrp.toFixed(2)} PNRP</span>
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/30 backdrop-blur-md border-r border-gray-800 min-h-[calc(100vh-4rem)] sticky top-16 hidden md:block" data-testid="sidebar">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-40" data-testid="mobile-nav">
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
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive ? 'text-purple-400' : 'text-gray-400'
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
