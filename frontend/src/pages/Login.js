import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      localStorage.setItem('token', response.data.access_token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8" data-testid="login-brand">
          <div className="flex items-center justify-center mb-4">
            {/* PNRP Coin Logo */}
            <div className="pnrp-coin-3d mr-3" style={{width: '56px', height: '56px'}}>
              <div className="pnrp-coin-side pnrp-coin-front">
                <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full">
                  <defs>
                    <path id="loginTopCurve" d="M 20,42 A 56,56 0 0,1 120,42" />
                    <path id="loginBottomCurve" d="M 18,104 A 62,58 0 0,0 122,104" />
                  </defs>
                  <path d="M 25,46 A 52,52 0 0,1 115,46" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                  <path d="M 25,89 A 52,52 0 0,0 115,89" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                  <text className="coin-curved-text" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.2">
                    <textPath href="#loginTopCurve" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                  </text>
                  <text className="coin-curved-text" fill="white" fontSize="10" fontWeight="900" letterSpacing="1.8">
                    <textPath href="#loginBottomCurve" startOffset="50%" textAnchor="middle">PLATINUM • NETWORK</textPath>
                  </text>
                </svg>
                <div className="pnrp-coin-text" style={{fontSize: '16px'}}>PNRP</div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold gradient-text leading-tight">Platinum Network</div>
              <div className="text-xs text-gray-400 tracking-wide">PNRP · Platinum Network Reward Point</div>
            </div>
          </div>
          <p className="text-gray-400" data-testid="login-subtitle">Welcome back! Login to continue mining</p>
        </div>

        {/* Form */}
        <div className="card-gradient rounded-2xl p-8 shadow-2xl" data-testid="login-form">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4" data-testid="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  data-testid="login-email-input"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  data-testid="login-password-input"
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-btn"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-400 hover:underline" data-testid="login-register-link">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
