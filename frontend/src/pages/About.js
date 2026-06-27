import Layout from '../components/Layout';
import AdSense from '../components/AdSense';
import { Info, FileText, Shield, AlertTriangle, Mail, MapPin, Phone } from 'lucide-react';

function About({ user, logout }) {
  return (
    <Layout user={user} logout={logout}>
      <div className="max-w-4xl mx-auto space-y-8" data-testid="about-page">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Platinum Network</h1>
          <p className="text-xl text-gray-400">Learn more about our platform, policies, and how to reach us</p>
        </div>

        {/* About Section */}
        <section className="card-gradient p-8 rounded-xl" id="about">
          <div className="flex items-center mb-6">
            <Info className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold">About Platinum Network</h2>
          </div>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Welcome to <span className="text-white font-semibold">Platinum Network</span>, a revolutionary cryptocurrency mining platform designed to democratize digital asset earning. Our mission is to provide an accessible, transparent, and rewarding experience for users worldwide who want to participate in the cryptocurrency ecosystem.
            </p>
            <p>
              Founded on the principles of innovation and community empowerment, Platinum Network offers a unique reward system that allows users to earn PNRP (Platinum Network Reward Points) tokens through simple, user-friendly mechanisms. Unlike traditional systems that require expensive hardware and technical expertise, our platform enables anyone with a smartphone or computer to start earning.
            </p>
            <p>
              Our platform features a comprehensive reward system including base earning sessions, time boosts, speed multipliers, daily check-in rewards, social media engagement tasks, and a powerful referral program. Users earn 50 PNRP per 12-hour session, with the ability to extend to 24 hours and double their earning speed through our innovative boost system.
            </p>
            <p>
              The referral program is designed to reward community growth, offering 10% of your referrals' session rewards as passive income. This creates a sustainable ecosystem where active participation benefits everyone. Additionally, users can complete social media tasks to earn bonus PNRP and help spread awareness about our platform.
            </p>
            <p>
              Security and transparency are at the core of everything we do. All transactions are recorded and verified, ensuring fair distribution of rewards. Your account information is protected with industry-standard encryption, and we implement strict privacy measures to safeguard your data.
            </p>
            <p>
              As we continue to grow, our roadmap includes implementing withdrawal mechanisms, KYC verification for compliance, leaderboard systems to gamify the experience, and potential token listing on cryptocurrency exchanges. We're committed to building a long-term, sustainable platform that provides real value to our community members.
            </p>
            <p>
              Join thousands of users who are already earning PNRP tokens daily. Whether you're new to digital tokens or an experienced investor, Platinum Network offers an opportunity to participate in the digital economy with minimal barriers to entry. Start your earning journey today and be part of the future of community-driven rewards.
            </p>
          </div>
        </section>

        {/* AdSense Ad - After About Section */}
        <div className="my-8">
          <AdSense adSlot="1234567890" adFormat="horizontal" />
        </div>

        {/* Terms and Conditions */}
        <section className="card-gradient p-8 rounded-xl" id="terms">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-blue-400 mr-3" />
            <h2 className="text-3xl font-bold">Terms and Conditions</h2>
          </div>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-sm text-gray-400">Last Updated: December 2025</p>
            
            <h3 className="text-xl font-semibold text-white mt-6">1. Acceptance of Terms</h3>
            <p>
              By accessing and using Platinum Network ("the Platform"), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform. Your continued use of the Platform constitutes acceptance of these terms and any future modifications.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">2. User Account and Registration</h3>
            <p>
              To access reward features, you must create an account by providing accurate and complete information including username, full name, email address, and password. You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
            </p>
            <p>
              Users must be at least 18 years old or the age of majority in their jurisdiction to create an account. By registering, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these terms.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">3. Mining and Rewards</h3>
            <p>
              PNRP tokens are earned through reward sessions, referrals, daily check-ins, and social media tasks. The base session lasts 12 hours and awards 50 PNRP. Users can extend sessions to 24 hours and activate speed multipliers by watching promotional content. Actual rewards may vary based on platform activities and boost status.
            </p>
            <p>
              The Platform reserves the right to modify reward structures, session durations, and bonus mechanics at any time with or without notice. Such changes will be communicated through platform notifications or email.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">4. Referral Program</h3>
            <p>
              Users receive a unique referral code upon registration. You earn 10% of the session rewards from users who register using your code. Referral abuse, including but not limited to creating multiple accounts or fraudulent referrals, will result in account suspension and forfeiture of rewards.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">5. Prohibited Activities</h3>
            <p>
              Users must not: (a) use automated scripts, bots, or any unauthorized tools to interact with the Platform; (b) create multiple accounts for the same individual; (c) attempt to manipulate, exploit, or circumvent the reward system; (d) engage in any fraudulent activities; (e) violate any applicable laws or regulations; (f) interfere with other users' experience; (g) reverse engineer or decompile any part of the Platform.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">6. Intellectual Property</h3>
            <p>
              All content, features, and functionality of the Platform, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are the exclusive property of Platinum Network and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">7. Limitation of Liability</h3>
            <p>
              Platinum Network is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access, error-free operation, or that the Platform will meet your specific requirements. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">8. Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of these terms, suspicious activities, or at our sole discretion. Upon termination, your right to access the Platform and any accumulated rewards may be forfeited.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">9. Modifications to Terms</h3>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective upon posting to the Platform. Your continued use after such changes constitutes acceptance of the modified terms. We encourage you to review these terms periodically.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">10. Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of the Platform shall be subject to the exclusive jurisdiction of the appropriate courts.
            </p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="card-gradient p-8 rounded-xl" id="privacy">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-green-400 mr-3" />
            <h2 className="text-3xl font-bold">Privacy Policy</h2>
          </div>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-sm text-gray-400">Last Updated: December 2025</p>

            <h3 className="text-xl font-semibold text-white mt-6">1. Information We Collect</h3>
            <p>
              We collect several types of information to provide and improve our services: (a) Personal Information: username, full name, email address, and password (encrypted); (b) Usage Data: session activities, referral interactions, task completions, login timestamps, and IP addresses; (c) Device Information: browser type, operating system, and device identifiers for security purposes.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">2. How We Use Your Information</h3>
            <p>
              Your information is used to: operate and maintain the Platform; process session rewards and referral bonuses; communicate important updates, security alerts, and promotional offers; prevent fraud and ensure platform security; analyze usage patterns to improve user experience; comply with legal obligations and respond to lawful requests; develop new features and services.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">3. Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your personal information, including encryption of sensitive data, secure socket layer (SSL) technology for data transmission, regular security audits and monitoring, restricted access to personal data by authorized personnel only, and password hashing using modern cryptographic algorithms.
            </p>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">4. Data Sharing and Disclosure</h3>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances: (a) with your explicit consent; (b) to comply with legal obligations or respond to lawful requests from authorities; (c) to protect our rights, property, or safety, or that of our users; (d) with service providers who assist in platform operations under strict confidentiality agreements.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">5. Cookies and Tracking</h3>
            <p>
              We use cookies and similar tracking technologies to enhance your experience, maintain your session, remember your preferences, and analyze platform usage. You can control cookie settings through your browser, but disabling cookies may affect platform functionality.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">6. Your Rights</h3>
            <p>
              You have the right to: access your personal data; request correction of inaccurate information; request deletion of your account and associated data; opt-out of promotional communications; object to processing of your data for certain purposes; export your data in a portable format.
            </p>
            <p>
              To exercise these rights, please contact us at support@platinumnetwork.online. We will respond to your request within a reasonable timeframe in accordance with applicable laws.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">7. Data Retention</h3>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide services. Even after account deletion, we may retain certain information for legitimate business purposes such as fraud prevention, legal compliance, and resolving disputes.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">8. Children's Privacy</h3>
            <p>
              Our Platform is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware that a user is under 18, we will take steps to delete such information and terminate the account.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">9. International Data Transfers</h3>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using the Platform, you consent to such transfers.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">10. Changes to Privacy Policy</h3>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or for legal reasons. We will notify you of significant changes via email or platform notification. Your continued use after changes indicates acceptance.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="card-gradient p-8 rounded-xl" id="disclaimer">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-bold">Disclaimer</h2>
          </div>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <h3 className="text-xl font-semibold text-white mt-6">General Disclaimer</h3>
            <p>
              The information provided on Platinum Network is for general informational purposes only. All information on the Platform is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Platform.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">No Financial Advice</h3>
            <p>
              PNRP tokens and any information presented on the Platform should not be considered as financial, investment, tax, or legal advice. We do not recommend or endorse any specific investment strategy. Cryptocurrency markets are highly volatile and speculative. You should conduct your own research and consult with qualified professionals before making any investment decisions.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">No Guarantee of Value</h3>
            <p>
              PNRP tokens earned through the Platform may or may not have monetary value in the future. We make no guarantees, representations, or warranties about the future value, exchangeability, or liquidity of PNRP tokens. The value of PNRP is subject to market forces and platform development. There is no assurance that PNRP will be listed on exchanges or be convertible to other cryptocurrencies or fiat currency.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">Platform Availability</h3>
            <p>
              While we strive to maintain continuous operation, we do not guarantee that the Platform will be available at all times. The Platform may experience downtime due to maintenance, updates, technical issues, or circumstances beyond our control. We are not liable for any losses or damages resulting from Platform unavailability.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">Third-Party Links</h3>
            <p>
              Our Platform may contain links to third-party websites or services for social media tasks. These links are provided for convenience only. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. You access third-party sites at your own risk.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">User Responsibility</h3>
            <p>
              You are solely responsible for your use of the Platform, including compliance with all applicable laws and regulations in your jurisdiction. You acknowledge that cryptocurrency activities may be subject to specific legal requirements in your country. It is your responsibility to ensure compliance with such requirements.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">Risk Acknowledgment</h3>
            <p>
              By using this Platform, you acknowledge and accept the inherent risks associated with cryptocurrency and digital tokens, including but not limited to: market volatility and price fluctuations, regulatory uncertainty and potential changes in laws, technological risks and potential security vulnerabilities, loss of access to tokens due to forgotten credentials, and potential for total loss of value.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">No Professional Relationship</h3>
            <p>
              Your use of the Platform does not create any professional relationship such as attorney-client, accountant-client, or financial advisor-client. Any reliance you place on information from the Platform is strictly at your own risk.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">Changes and Updates</h3>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of the Platform at any time without prior notice. This includes but is not limited to reward mechanisms, reward structures, features, and services. We are not liable for any modifications, suspensions, or discontinuations.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">Limitation of Liability</h3>
            <p>
              Under no circumstances shall Platinum Network, its operators, developers, or affiliates be held liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from your use or inability to use the Platform, even if we have been advised of the possibility of such damages.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="card-gradient p-8 rounded-xl" id="contact">
          <div className="flex items-center mb-6">
            <Mail className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold">Contact Us</h2>
          </div>
          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              We're here to help! If you have any questions, concerns, or feedback about Platinum Network, please don't hesitate to reach out to us.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Email Support</h3>
                </div>
                <p className="text-gray-400 mb-2">For general inquiries and support:</p>
                <a href="mailto:support@platinumnetwork.online" className="text-purple-400 hover:text-purple-300 font-semibold text-lg">
                  support@platinumnetwork.online
                </a>
                <p className="text-sm text-gray-500 mt-3">Response time: Within 24-48 hours</p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Report Issues</h3>
                </div>
                <p className="text-gray-400 mb-2">Security concerns or bugs:</p>
                <a href="mailto:support@platinumnetwork.online" className="text-purple-400 hover:text-purple-300 font-semibold text-lg">
                  support@platinumnetwork.online
                </a>
                <p className="text-sm text-gray-500 mt-3">We take security seriously</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-lg border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">What to Include in Your Message</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Your registered email address or username</li>
                <li>✓ Detailed description of your question or issue</li>
                <li>✓ Screenshots if reporting a bug (please blur sensitive information)</li>
                <li>✓ Steps to reproduce the issue (if applicable)</li>
                <li>✓ Your device and browser information</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h3>
              <p className="text-gray-400 mb-3">
                Before contacting us, you may find answers to common questions in our platform. Check the Dashboard and Profile sections for information about sessions, rewards, and account management.
              </p>
              <p className="text-gray-400">
                For urgent matters or account security issues, please contact us immediately at the support email above.
              </p>
            </div>

            <div className="text-center pt-6">
              <p className="text-gray-400">
                We appreciate your patience and look forward to assisting you with your Platinum Network experience!
              </p>
            </div>
          </div>
        </section>

        {/* Copyright Footer */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400">
            ©2025 Platinum Network. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: December 2025
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default About;
