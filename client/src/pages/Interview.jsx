import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Interview() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('Full Stack Developer');
  const [type, setType] = useState('Mixed');
  const [questionCount, setQuestionCount] = useState(20);
  const [started, setStarted] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/interview/start', { 
        role, type, count: questionCount 
      }, {
        headers: { 'x-auth-token': token }
      });
      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
      setStarted(true);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/interview/submit', {
        sessionId, questionIndex: currentIndex, answer
      }, { headers: { 'x-auth-token': token } });
      setFeedback(res.data.feedback);

      const isLast = currentIndex + 1 === questions.length;
      if (isLast) {
        await axios.post('http://localhost:5000/api/interview/complete', { sessionId }, {
          headers: { 'x-auth-token': token }
        });
        alert('🎉 Interview completed! Check your dashboard for scores.');
        navigate('/dashboard');
        return;
      }

      setTimeout(() => {
        setFeedback(null);
        setAnswer('');
        setCurrentIndex(currentIndex + 1);
        setLoading(false);
      }, 3000);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || err.message));
      setLoading(false);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <button onClick={() => navigate('/dashboard')} className="mb-4 bg-gray-700 px-4 py-2 rounded">← Back</button>
        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">AI Mock Interview</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Job Role</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 rounded bg-gray-700" />
            </div>
            <div>
              <label className="block mb-2">Interview Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 rounded bg-gray-700">
                <option value="HR">HR Questions</option>
                <option value="Technical">Technical Questions</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Number of Questions</label>
              <select value={questionCount} onChange={e => setQuestionCount(parseInt(e.target.value))} className="w-full p-2 rounded bg-gray-700">
                <option value={5}>5 questions</option>
                <option value={10}>10 questions</option>
                <option value={15}>15 questions</option>
                <option value={20}>20 questions</option>
                <option value={25}>25 questions</option>
                <option value={30}>30 questions</option>
              </select>
            </div>
            <button onClick={startInterview} disabled={loading} className="w-full bg-purple-600 py-2 rounded disabled:opacity-50">
              {loading ? 'Starting...' : `Start ${questionCount} Questions`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Question {currentIndex+1} of {questions.length}</h2>
        <div className="bg-gray-800 p-6 rounded-lg mb-4">
          <p className="text-lg">{questions[currentIndex]}</p>
        </div>
        <textarea className="w-full p-3 rounded bg-gray-700" rows="5" placeholder="Type your answer..." value={answer} onChange={e => setAnswer(e.target.value)} />
        <button onClick={submitAnswer} disabled={loading} className="mt-4 bg-blue-600 px-6 py-2 rounded disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Answer'}
        </button>
        {feedback && (
          <div className="mt-4 bg-gray-800 p-4 rounded">
            <p className="text-green-400">Score: {feedback.score}/10</p>
            <p>{feedback.comments}</p>
          </div>
        )}
      </div>
    </div>
  );
}