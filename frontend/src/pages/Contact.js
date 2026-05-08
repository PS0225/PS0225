import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, MapPin, Clock, Send, ArrowLeft, Twitter, Send as Telegram, Youtube } from 'lucide-react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Mock submission - In production, wire this to an email/API endpoint
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white" data-testid="contact-page">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" data-testid="contact-back-link">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xl font-bold gradient-text">Platinum Network</span>
          </Link>
          <div className="flex space-x-4 text-sm">
            <Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link>
            <Link to="/about" className="text-gray-400 hover:text-white transition">About</Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" data-testid="contact-title">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have a question about PNRP mining, your account, or partnerships?
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="md:col-span-1 space-y-4">
            <div className="card-gradient p-6 rounded-xl" data-testid="contact-email-card">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold mb-1">Email</h3>
              <a href="mailto:support@platinumnetwork.com" className="text-sm text-gray-400 hover:text-purple-400 transition">
                support@platinumnetwork.com
              </a>
            </div>

            <div className="card-gradient p-6 rounded-xl" data-testid="contact-hours-card">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold mb-1">Support Hours</h3>
              <p className="text-sm text-gray-400">Mon-Sat: 10:00 AM - 7:00 PM IST</p>
              <p className="text-sm text-gray-400">Sun: Closed</p>
            </div>

            <div className="card-gradient p-6 rounded-xl" data-testid="contact-location-card">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold mb-1">Location</h3>
              <p className="text-sm text-gray-400">Online - serving miners worldwide.</p>
            </div>

            <div className="card-gradient p-6 rounded-xl" data-testid="contact-social-card">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="font-bold mb-3">Community</h3>
              <div className="flex space-x-3">
                <a href="https://t.me/platinumnetwork" target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-blue-400 transition" aria-label="Telegram"
                   data-testid="contact-telegram">
                  <Telegram className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/platinumnetwork" target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-cyan-400 transition" aria-label="Twitter"
                   data-testid="contact-twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/@platinumnetwork" target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-red-400 transition" aria-label="YouTube"
                   data-testid="contact-youtube">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="card-gradient p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
              <p className="text-gray-400 mb-6 text-sm">
                We typically reply within 24 hours on business days.
              </p>

              {submitted ? (
                <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-6 text-center" data-testid="contact-success">
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="font-bold text-green-300 mb-1">Message Received!</h3>
                  <p className="text-sm text-gray-300">
                    Thanks for reaching out. Our team will get back to you at the email you provided.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm text-purple-400 hover:underline"
                    data-testid="contact-send-another"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        data-testid="contact-name-input"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                        placeholder="Rahul Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        data-testid="contact-email-input"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      data-testid="contact-subject-input"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="">Select a topic</option>
                      <option>Account Issue</option>
                      <option>Mining Problem</option>
                      <option>Withdrawal / KYC</option>
                      <option>Bug Report</option>
                      <option>Partnership / Business</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      data-testid="contact-message-input"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="contact-submit-btn"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Quick Links */}
            <div className="mt-6 card-gradient p-6 rounded-xl">
              <h3 className="font-bold mb-3">Frequently Asked</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-300">
                  <span className="text-purple-400 mr-2">•</span>
                  <strong>How do I withdraw PNRP?</strong> Withdrawals will open after the Token Generation Event (TGE). Complete your KYC to be ready.
                </li>
                <li className="text-gray-300">
                  <span className="text-purple-400 mr-2">•</span>
                  <strong>Why am I auto-logged out?</strong> Inactive accounts are signed out after 7 days for security.
                </li>
                <li className="text-gray-300">
                  <span className="text-purple-400 mr-2">•</span>
                  <strong>Can I change my referral code?</strong> Referral codes are permanent for tracking integrity.
                </li>
                <li className="text-gray-300">
                  <span className="text-purple-400 mr-2">•</span>
                  <strong>Is PNRP a real cryptocurrency?</strong> PNRP is a reward point that will become tradeable at TGE. Read our <Link to="/disclaimer" className="text-purple-400 hover:underline">Disclaimer</Link>.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm pb-8">
          <p>© 2025 Platinum Network. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link to="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
            <Link to="/blog" className="hover:text-white transition">Blog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
