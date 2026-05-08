import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Referrals from './pages/Referrals';
import SocialTasks from './pages/SocialTasks';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Roadmap from './pages/Roadmap';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import Contact from './pages/Contact';
import { BlogList, BlogPost } from './pages/Blog';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Send GA4 page_view on SPA route changes
function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtagSendPageView === 'function') {
      window.gtagSendPageView(location.pathname + location.search);
    }
  }, [location]);
  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Check for inactivity (7 days without mining)
        const lastMiningTime = localStorage.getItem('lastMiningTime');
        if (lastMiningTime) {
          const daysSinceLastMining = (Date.now() - parseInt(lastMiningTime)) / (1000 * 60 * 60 * 24);
          if (daysSinceLastMining > 7) {
            // Auto logout after 7 days of inactivity
            console.log('Auto logout: 7 days of inactivity');
            localStorage.removeItem('token');
            localStorage.removeItem('lastMiningTime');
            setUser(null);
            setLoading(false);
            return;
          }
        }
        
        const response = await axios.get(`${API}/auth/me`);
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('lastMiningTime');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastMiningTime');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/wallet" element={user ? <Wallet user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/referrals" element={user ? <Referrals user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/social-tasks" element={user ? <SocialTasks user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={user ? <Leaderboard user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile user={user} logout={logout} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/about" element={user ? <About user={user} logout={logout} /> : <About />} />
        <Route path="/roadmap" element={user ? <Roadmap user={user} logout={logout} /> : <Roadmap />} />
        <Route path="/terms" element={user ? <Terms user={user} logout={logout} /> : <Terms />} />
        <Route path="/privacy" element={user ? <Privacy user={user} logout={logout} /> : <Privacy />} />
        <Route path="/disclaimer" element={user ? <Disclaimer user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={user && user.is_admin ? <AdminPanel user={user} logout={logout} /> : <Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
