import Layout from '../components/Layout';
import { AlertTriangle } from 'lucide-react';

function Disclaimer({ user, logout }) {
  return (
    <Layout user={user} logout={logout}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2 gradient-text">Disclaimer</h1>
          <p className="text-gray-400">Important Legal Information</p>
        </div>

        {/* Content */}
        <div className="card-gradient p-8 rounded-xl space-y-6">
          <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg p-6">
            <p className="text-yellow-200 font-semibold text-center">
              ⚠️ Please read this disclaimer carefully before using Platinum Network platform
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">1. Not Financial Advice</h2>
            <p className="text-gray-300 leading-relaxed">
              The information provided on Platinum Network is for general informational purposes only. Nothing on this platform constitutes financial, investment, legal, or tax advice. Users should consult with qualified professionals before making any financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">2. Investment Risk</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Cryptocurrency and token investments involve substantial risk, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Market volatility and potential complete loss of value</li>
              <li>Regulatory changes affecting token legality</li>
              <li>Technical risks and smart contract vulnerabilities</li>
              <li>Liquidity risks and inability to sell tokens</li>
              <li>Platform security breaches</li>
            </ul>
            <p className="text-yellow-200 font-semibold mt-4">
              Never invest more than you can afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">3. PNRP Token Status</h2>
            <p className="text-gray-300 leading-relaxed">
              PNRP (Platinum Network Reward Points) are currently reward points and NOT a tradable cryptocurrency. Conversion to actual tokens will only occur after Token Generation Event (TGE). There is no guarantee of TGE timing, token value, or exchange listings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">4. No Guaranteed Returns</h2>
            <p className="text-gray-300 leading-relaxed">
              Mining rewards, referral commissions, and any other earnings displayed are estimates only. Actual returns may vary. The platform does not guarantee any specific return on investment or earnings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">5. Platform Availability</h2>
            <p className="text-gray-300 leading-relaxed">
              Platinum Network is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access, error-free operation, or that the platform will meet your requirements. Maintenance, updates, or technical issues may cause temporary service disruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">6. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed">
              The platform may integrate with third-party services (payment processors, exchanges, KYC providers). We are not responsible for the availability, accuracy, or reliability of these external services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">7. Regulatory Compliance</h2>
            <p className="text-gray-300 leading-relaxed">
              Cryptocurrency regulations vary by jurisdiction. Users are responsible for ensuring their use of Platinum Network complies with local laws. The platform may restrict access in certain countries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">8. Account Security</h2>
            <p className="text-gray-300 leading-relaxed">
              While we implement security measures, users are ultimately responsible for their account security. We are not liable for losses due to compromised credentials, phishing attacks, or unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">9. Forward-Looking Statements</h2>
            <p className="text-gray-300 leading-relaxed">
              Any statements about future features, roadmap milestones, or token performance are forward-looking and subject to change. Actual results may differ materially from projections.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">10. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, Platinum Network, its founders, team members, and affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from platform use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">11. User Acknowledgment</h2>
            <p className="text-gray-300 leading-relaxed">
              By using Platinum Network, you acknowledge that you have read, understood, and accepted this disclaimer. You agree to use the platform at your own risk and take full responsibility for your actions and decisions.
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

export default Disclaimer;
