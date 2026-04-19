import Layout from '../components/Layout';
import { FileText } from 'lucide-react';

function Terms({ user, logout }) {
  return (
    <Layout user={user} logout={logout}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2 gradient-text">Terms & Conditions</h1>
          <p className="text-gray-400">Last updated: December 2025</p>
        </div>

        {/* Content */}
        <div className="card-gradient p-8 rounded-xl space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using Platinum Network platform, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms & Conditions, please do not use this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">2. PNRP Token</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              PNRP (Platinum Network Reward Points) are utility tokens earned through mining, referrals, and platform activities. Key points:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>PNRP is a reward point system, not a cryptocurrency until TGE</li>
              <li>Conversion to real tokens will be available after Token Generation Event (TGE)</li>
              <li>KYC verification is mandatory for withdrawals and conversions</li>
              <li>The platform reserves the right to adjust reward rates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">3. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed mb-3">Users agree to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of their account credentials</li>
              <li>Not engage in fraudulent activities or multi-accounting</li>
              <li>Not use automated bots or scripts for mining</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">4. Mining & Rewards</h2>
            <p className="text-gray-300 leading-relaxed">
              Mining sessions are limited to once every 12 hours with optional 24-hour extension. Reward rates may change based on platform growth and tokenomics. Unclaimed rewards may expire after a specified period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">5. Referral Program</h2>
            <p className="text-gray-300 leading-relaxed">
              Users can earn 10% commission on their referrals' mining rewards. Referral rewards are subject to verification and anti-fraud checks. The platform reserves the right to suspend accounts involved in referral abuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">6. Account Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              Accounts inactive for more than 7 consecutive days will be automatically logged out. The platform reserves the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">7. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              Platinum Network is not liable for any losses, damages, or claims arising from platform use, market fluctuations, or technical issues. Users participate at their own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">8. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
            </p>
          </section>
        </div>

        {/* Copyright Footer */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400">
            ©2025 Platinum Network. All rights reserved.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Terms;
