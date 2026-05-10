import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalInterviews: 0, avgScore: 0, scores: [] });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { 'x-auth-token': token }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Interview Platform</h1>
        <div className="flex items-center gap-4">
          <span>{user.name || user.email}</span>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">Logout</button>
        </div>
      </nav>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-4xl font-bold text-purple-400">{stats.totalInterviews}</p>
            <p>Total Interviews</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-4xl font-bold text-purple-400">{stats.avgScore}</p>
            <p>Average Score (out of 10)</p>
          </div>
        </div>

        {/* Score Trend Chart */}
        {stats.scores.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">📈 Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.scores}>
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Line type="monotone" dataKey="score" stroke="#c084fc" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition" onClick={() => navigate('/upload-resume')}>
            <h3 className="text-xl font-bold mb-2">📄 Resume Analyzer</h3>
            <p>Upload resume & get ATS score & AI suggestions</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition" onClick={() => navigate('/interview')}>
            <h3 className="text-xl font-bold mb-2">🎤 AI Mock Interview</h3>
            <p>Practice HR/Technical questions with AI feedback</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition" onClick={() => navigate('/coding')}>
            <h3 className="text-xl font-bold mb-2">💻 Coding Practice</h3>
            <p>DSA problems with editor & multiple languages</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition" onClick={() => navigate('/analytics')}>
            <h3 className="text-xl font-bold mb-2">📊 Detailed Analytics</h3>
            <p>View question-wise breakdown of your interviews</p>
          </div>
          {/* AI Q&A Assistant Card - NEW */}
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition" onClick={() => navigate('/ai-qa')}>
            <h3 className="text-xl font-bold mb-2">🤖 AI Q&A Assistant</h3>
            <p>Ask any coding or interview question – get AI-powered answers</p>
          </div>
        </div>
      </div>
    </div>
  );
}