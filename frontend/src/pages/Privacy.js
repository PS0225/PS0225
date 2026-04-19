import Layout from '../components/Layout';
import { Shield } from 'lucide-react';

function Privacy({ user, logout }) {
  return (
    <Layout user={user} logout={logout}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2 gradient-text">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: December 2025</p>
        </div>

        {/* Content */}
        <div className="card-gradient p-8 rounded-xl space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We collect the following information to provide and improve our services:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Account Information:</strong> Email, username, password (encrypted)</li>
              <li><strong>KYC Documents:</strong> Aadhar, PAN, and photo verification (for withdrawals)</li>
              <li><strong>Activity Data:</strong> Mining sessions, transactions, referrals</li>
              <li><strong>Device Information:</strong> Browser type, IP address, device ID</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-3">Your information is used to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide and maintain platform services</li>
              <li>Process transactions and withdrawals</li>
              <li>Verify user identity (KYC compliance)</li>
              <li>Detect and prevent fraud</li>
              <li>Send important updates and notifications</li>
              <li>Improve platform features and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">3. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure. Users are responsible for maintaining the confidentiality of their account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">4. Data Sharing</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We do not sell your personal information. We may share data only:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>With service providers (payment processors, KYC verification services)</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">5. Cookies & Tracking</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar technologies to enhance user experience, remember preferences, and analyze platform usage. Users can control cookie settings through their browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">6. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data</li>
              <li>File complaints with regulatory authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">7. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain user data for as long as necessary to provide services and comply with legal obligations. KYC documents are retained for regulatory compliance even after account closure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">8. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Platinum Network is not intended for users under 18 years of age. We do not knowingly collect information from minors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">9. Changes to Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy periodically. Users will be notified of significant changes via email or platform notifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">10. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              For privacy-related questions or requests, contact us at: <span className="text-purple-400 font-semibold">privacy@platinumnetwork.com</span>
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

export default Privacy;
