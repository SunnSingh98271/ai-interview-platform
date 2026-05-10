import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

export default function AIQA() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/api/ai/answer`, { question }, {
        headers: { 'x-auth-token': token }
      });
      setAnswer(res.data.answer);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🤖 AI Q&A Assistant</h1>
          <button onClick={() => navigate('/dashboard')} className="bg-gray-700 px-4 py-2 rounded">← Dashboard</button>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <form onSubmit={handleSubmit}>
            <textarea
              rows="3"
              className="w-full p-3 bg-gray-900 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="Ask any coding or interview question... (e.g., What is closure in JavaScript?)"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-semibold disabled:opacity-50"
            >
              {loading ? 'Thinking...' : 'Get Answer'}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-900 rounded text-red-200">
              {error}
            </div>
          )}
          {answer && (
            <div className="mt-6 p-4 bg-gray-900 rounded border border-purple-500">
              <h3 className="font-bold text-purple-400 mb-2">Answer:</h3>
              <div className="whitespace-pre-wrap">{answer}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}