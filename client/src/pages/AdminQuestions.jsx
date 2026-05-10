import { useState } from 'react';
import axios from 'axios';

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleUpload = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const questions = JSON.parse(e.target.result);
        const res = await axios.post('http://localhost:5000/api/admin/upload-questions', questions, {
          headers: { 'x-auth-token': token, 'Content-Type': 'application/json' }
        });
        setMessage(`✅ ${res.data.msg}`);
      } catch (err) {
        setMessage('❌ Invalid JSON or upload failed');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold">Bulk Upload Coding Questions</h1>
      <input type="file" accept=".json" onChange={e => setFile(e.target.files[0])} className="my-4" />
      <button onClick={handleUpload} className="bg-purple-600 px-4 py-2 rounded">Upload JSON</button>
      {message && <p className="mt-4">{message}</p>}
      <pre className="mt-8 bg-gray-800 p-4 rounded text-sm">
        {`Example JSON format (array of objects):
[
  {
    "title": "Question 1",
    "difficulty": "Easy",
    "description": "Problem statement",
    "example": "Input → Output",
    "starterCode": { "javascript": "// code", "python": "# code" },
    "isActive": true
  }
]`}
      </pre>
    </div>
  );
}