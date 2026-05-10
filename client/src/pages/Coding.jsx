import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' }
];

export default function Coding() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedQ, setSelectedQ] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/coding/questions', {
        headers: { 'x-auth-token': token }
      });
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
        setSelectedQ(res.data[0]);
        setStarterCode(res.data[0], language);
      } else {
        setError('No questions found. Ask admin to add via bulk upload.');
      }
    } catch (err) {
      setError('Failed to load questions from server.');
    }
  };

  const setStarterCode = (q, lang) => {
    let starter = '';
    if (lang === 'javascript') {
      starter = q.starterCode?.javascript || 'function solve() {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(solve());';
    } else if (lang === 'python') {
      starter = q.starterCode?.python || 'def solve():\n    # Write your code here\n    pass\n\n# Test\nprint(solve())';
    }
    setCode(starter);
    setOutput('');
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (selectedQ) setStarterCode(selectedQ, newLang);
  };

  const runCode = async () => {
    if (!selectedQ) return;
    setLoading(true);
    setOutput('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/coding/run', {
        code,
        language,
        stdin: ''
      }, { headers: { 'x-auth-token': token } });
      if (res.data.error) {
        setOutput(`❌ ${res.data.output || res.data.error}`);
      } else {
        setOutput(res.data.output || '(No output)');
      }
    } catch (err) {
      console.error('Full error:', err);
      setOutput('Error: ' + (err.response?.data?.error || err.message || 'Network Error'));
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (!questions.length) return;
    const currentIndex = questions.findIndex(q => q._id === selectedQ._id);
    const nextIndex = (currentIndex + 1) % questions.length;
    const nextQ = questions[nextIndex];
    setSelectedQ(nextQ);
    setStarterCode(nextQ, language);
  };

  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!selectedQ) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4 bg-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold">💻 Coding Practice</h1>
        <button onClick={() => navigate('/dashboard')} className="bg-gray-700 px-4 py-2 rounded">← Dashboard</button>
      </div>
      <div className="flex flex-col md:flex-row p-4 gap-4">
        <div className="w-full md:w-1/4 bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Problems</h2>
          {questions.map(q => (
            <div
              key={q._id}
              onClick={() => {
                setSelectedQ(q);
                setStarterCode(q, language);
              }}
              className={`p-2 mb-2 rounded cursor-pointer ${selectedQ._id === q._id ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {q.title} <span className="text-sm text-gray-300">({q.difficulty})</span>
            </div>
          ))}
        </div>
        <div className="w-full md:w-3/4 bg-gray-800 p-4 rounded">
          <h2 className="text-2xl font-bold">{selectedQ.title}</h2>
          <p className="mt-2 text-gray-300">{selectedQ.description}</p>
          <pre className="mt-2 bg-gray-900 p-2 rounded text-sm text-green-300">{selectedQ.example}</pre>
          <div className="mt-4">
            <label className="block mb-2">Language:</label>
            <select value={language} onChange={e => handleLanguageChange(e.target.value)} className="bg-gray-700 p-2 rounded">
              {languageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <textarea rows="12" className="w-full mt-4 p-2 bg-gray-900 font-mono text-sm" value={code} onChange={e => setCode(e.target.value)} />
          <div className="flex gap-3 mt-4">
            <button onClick={runCode} disabled={loading} className="bg-purple-600 px-6 py-2 rounded disabled:opacity-50">
              {loading ? 'Running...' : 'Run Code'}
            </button>
            <button onClick={nextQuestion} className="bg-blue-600 px-6 py-2 rounded">Next Question →</button>
          </div>
          {output && (
            <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
              <p className="font-bold">Output:</p>
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}