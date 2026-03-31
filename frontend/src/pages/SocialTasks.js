import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Layout from '../components/Layout';
import { Facebook, Twitter, Instagram, Send, Youtube, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react';

function SocialTasks({ user, logout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API}/social-tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const response = await axios.post(`${API}/social-tasks/${taskId}/complete`);
      alert(`Task completed! Earned ${response.data.reward} PNRP`);
      fetchTasks();
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to complete task');
    }
  };

  const getIcon = (platform) => {
    const icons = {
      facebook: <Facebook className="w-8 h-8" />,
      twitter: <Twitter className="w-8 h-8" />,
      instagram: <Instagram className="w-8 h-8" />,
      telegram: <Send className="w-8 h-8" />,
      youtube: <Youtube className="w-8 h-8" />,
      whatsapp: <MessageCircle className="w-8 h-8" />,
    };
    return icons[platform] || <ExternalLink className="w-8 h-8" />;
  };

  const getColor = (platform) => {
    const colors = {
      facebook: 'text-blue-500',
      twitter: 'text-sky-400',
      instagram: 'text-pink-500',
      telegram: 'text-blue-400',
      youtube: 'text-red-500',
      whatsapp: 'text-green-500',
    };
    return colors[platform] || 'text-purple-400';
  };

  if (loading) {
    return (
      <Layout user={user} logout={logout}>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} logout={logout}>
      <div className="space-y-8" data-testid="social-tasks-page">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="social-tasks-title">Social Tasks</h1>
          <p className="text-gray-400">Complete social media tasks and earn 30 PNRP each</p>
        </div>

        {/* Tasks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              data-testid={`task-${task.platform}`}
              className={`card-gradient p-6 rounded-xl ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={getColor(task.platform)}>
                  {getIcon(task.platform)}
                </div>
                {task.completed && (
                  <CheckCircle className="w-6 h-6 text-green-400" data-testid={`task-completed-${task.platform}`} />
                )}
              </div>

              <h3 className="text-xl font-bold mb-2" data-testid={`task-name-${task.platform}`}>{task.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{task.description}</p>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-purple-400" data-testid={`task-reward-${task.platform}`}>
                  +{task.reward} PNRP
                </div>
                {task.completed ? (
                  <div className="text-green-400 text-sm" data-testid={`task-completed-label-${task.platform}`}>✓ Completed</div>
                ) : (
                  <button
                    onClick={() => {
                      window.open(task.url, '_blank');
                      setTimeout(() => {
                        if (window.confirm('Have you completed this task?')) {
                          completeTask(task.id);
                        }
                      }, 2000);
                    }}
                    data-testid={`task-complete-btn-${task.platform}`}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-sm font-semibold"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="card-gradient p-6 rounded-xl" data-testid="social-tasks-info">
          <h2 className="text-xl font-bold mb-4">How it works</h2>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Click on "Complete" button to visit the social media platform</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Follow/Join/Subscribe to Platinum Network's official account</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Confirm completion to earn 30 PNRP instantly</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Each task can only be completed once</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default SocialTasks;
