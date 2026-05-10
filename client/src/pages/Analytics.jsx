import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Analytics() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSession, setExpandedSession] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/details', {
        headers: { 'x-auth-token': token }
      });
      setSessions(res.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const toggleSession = (id) => {
    setExpandedSession(expandedSession === id ? null : id);
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📊 Detailed Analytics</h1>
          <button onClick={() => navigate('/dashboard')} className="bg-gray-700 px-4 py-2 rounded">← Dashboard</button>
        </div>

        {sessions.length === 0 ? (
          <p className="text-center text-gray-400">No interviews completed yet.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <div key={session._id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSession(session._id)}
                  className="p-4 cursor-pointer hover:bg-gray-700 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{session.role} – {session.type}</p>
                    <p className="text-sm text-gray-400">{new Date(session.completedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                      Overall Score: {session.overallScore}/10
                    </span>
                    <span>{expandedSession === session._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandedSession === session._id && (
                  <div className="p-4 border-t border-gray-700">
                    <h3 className="text-xl font-semibold mb-3">Question-wise Breakdown</h3>
                    <div className="space-y-3">
                      {session.questions.map((q, idx) => (
                        <div key={idx} className="bg-gray-900 p-3 rounded">
                          <div className="flex justify-between items-start">
                            <p className="font-mono text-sm text-purple-300">Q{idx+1}: {q.question}</p>
                            <span className={`px-2 py-1 rounded text-sm font-bold ${q.score >= 7 ? 'bg-green-600' : q.score >= 5 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                              Score: {q.score}/10
                            </span>
                          </div>
                          <p className="mt-2 text-gray-300"><span className="text-gray-400">Your answer:</span> {q.answer}</p>
                          <p className="mt-1 text-gray-400 text-sm"><span className="text-gray-500">Feedback:</span> {q.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}