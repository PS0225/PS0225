import Layout from '../components/Layout';
import { CheckCircle, Circle, Clock, Rocket, Shield, Smartphone, TrendingUp, Users, Zap } from 'lucide-react';

function Roadmap({ user, logout }) {
  const roadmapPhases = [
    {
      phase: "Phase 1: Platform Launch & Core Features",
      status: "completed",
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/50",
      items: [
        { title: "Mining System Launch", done: true, description: "12-hour base mining with 24-hour boost" },
        { title: "Daily Check-in Rewards", done: true, description: "7-day streak system with increasing rewards" },
        { title: "Daily Reward Box", done: true, description: "3-day reward system with ad boost" },
        { title: "Referral Program", done: true, description: "10% commission on referral mining" },
        { title: "Social Tasks", done: true, description: "Earn PNRP by completing social media tasks" },
        { title: "Leaderboard System", done: true, description: "Global ranking system for top miners" },
        { title: "Wallet Dashboard", done: true, description: "View balance and transaction history" },
        { title: "Send/Receive/Swap UI", done: true, description: "Wallet actions ready (activated at TGE)" },
        { title: "Notification System", done: true, description: "Real-time updates with navigation" },
        { title: "Profile & Statistics", done: true, description: "Detailed user stats and achievements" },
        { title: "About & Roadmap Pages", done: true, description: "Platform information and future plans" },
        { title: "Android APK Release", done: true, description: "Mobile app available for download" }
      ]
    },
    {
      phase: "Phase 2: TGE & Token Launch",
      status: "upcoming",
      icon: Shield,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/50",
      items: [
        { title: "KYC Integration", done: false, description: "Aadhar/PAN verification system" },
        { title: "Token Generation Event (TGE)", done: false, description: "Official PNRP token launch" },
        { title: "Send/Receive/Swap Activation", done: false, description: "Enable wallet transfer features" },
        { title: "Withdrawal System", done: false, description: "Convert PNRP to real tokens" },
        { title: "Admin Panel", done: false, description: "KYC approval and user management" }
      ]
    },
    {
      phase: "Phase 3: Mobile Expansion",
      status: "upcoming",
      icon: Smartphone,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/50",
      items: [
        { title: "PWA Support", done: false, description: "Progressive Web App features" },
        { title: "iOS App Release", done: false, description: "iPhone app launch on App Store" },
        { title: "Push Notifications", done: false, description: "Mobile push notification system" },
        { title: "Enhanced Mining on Mobile", done: false, description: "Optimized mobile mining experience" }
      ]
    },
    {
      phase: "Phase 4: Ecosystem Growth",
      status: "future",
      icon: Rocket,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
      borderColor: "border-pink-500/50",
      items: [
        { title: "Exchange Listings", done: false, description: "Major crypto exchange partnerships" },
        { title: "Staking System", done: false, description: "Earn passive income by staking PNRP" },
        { title: "NFT Integration", done: false, description: "Platinum Network NFT marketplace" },
        { title: "DeFi Features", done: false, description: "Lending, borrowing, yield farming" }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      'completed': { text: '✅ Completed', class: 'bg-green-500/20 text-green-400 border-green-500/50' },
      'in-progress': { text: '🔄 In Progress', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
      'upcoming': { text: '⏳ Upcoming', class: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
      'future': { text: '🚀 Future', class: 'bg-purple-500/20 text-purple-400 border-purple-500/50' }
    };
    return badges[status];
  };

  return (
    <Layout user={user} logout={logout}>
      <div className="space-y-8" data-testid="roadmap-page">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 gradient-text" data-testid="roadmap-title">
            🗺️ Roadmap
          </h1>
          <p className="text-gray-400 text-lg">Our journey to revolutionize crypto mining</p>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-6">
          {roadmapPhases.map((phase, index) => {
            const Icon = phase.icon;
            const badge = getStatusBadge(phase.status);
            
            return (
              <div 
                key={index}
                className={`card-gradient p-8 rounded-xl border-2 ${phase.borderColor} hover:scale-[1.02] transition-transform duration-300`}
                data-testid={`roadmap-phase-${index + 1}`}
              >
                {/* Phase Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${phase.bgColor}`}>
                      <Icon className={`w-8 h-8 ${phase.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{phase.phase}</h2>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full border-2 ${badge.class} font-semibold`}>
                    {badge.text}
                  </span>
                </div>

                {/* Phase Items */}
                <div className="space-y-3">
                  {phase.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="bg-gray-800/50 p-4 rounded-lg flex items-start space-x-4 hover:bg-gray-800/70 transition"
                    >
                      {item.done ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${item.done ? 'text-white' : 'text-gray-300'}`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Message */}
        <div className="card-gradient p-6 rounded-xl text-center border-2 border-blue-500/30">
          <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Stay Tuned!</h3>
          <p className="text-gray-400">
            We're constantly working on new features and improvements. Follow our social channels for the latest updates!
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Roadmap;
