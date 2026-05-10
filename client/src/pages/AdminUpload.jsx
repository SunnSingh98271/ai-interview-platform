import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleUpload = async () => {
    if (!file) return setMessage('Select a JSON file');
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const questions = JSON.parse(e.target.result);
        if (!Array.isArray(questions)) throw new Error('Not an array');
        const res = await axios.post('http://localhost:5000/api/admin/upload-questions', questions, {
          headers: { 'x-auth-token': token, 'Content-Type': 'application/json' }
        });
        setMessage(`✅ ${res.data.msg}`);
      } catch (err) {
        setMessage('❌ Invalid JSON or upload failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📤 Bulk Upload Questions</h1>
          <button onClick={() => navigate('/dashboard')} className="bg-gray-700 px-4 py-2 rounded">← Dashboard</button>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="mb-4">Upload a JSON file containing an array of question objects.</p>
          <input type="file" accept=".json" onChange={e => setFile(e.target.files[0])} className="mb-4" />
          <button onClick={handleUpload} disabled={loading} className="bg-purple-600 px-6 py-2 rounded disabled:opacity-50">
            {loading ? 'Uploading...' : 'Upload & Insert'}
          </button>
          {message && <div className="mt-4 p-3 bg-gray-700 rounded">{message}</div>}
        </div>
        <div className="mt-8 bg-gray-800 p-4 rounded text-sm">
          <p className="font-bold mb-2">Sample JSON format:</p>
          <pre className="bg-gray-900 p-3 rounded overflow-x-auto">{`[
  {
    "title": "Two Sum",
    "difficulty": "Easy",
    "description": "Return indices that sum to target",
    "example": "[2,7,11,15], 9 → [0,1]",
    "starterCode": {
      "javascript": "function solve(nums, target) {\\n    // code\\n}",
      "python": "def solve(nums, target):\\n    pass"
    },
    "isActive": true
  }
]`}</pre>
        </div>
      </div>
    </div>
  );
}