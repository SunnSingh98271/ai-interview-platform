import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UploadResume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', file);
    const token = localStorage.getItem('token');
    try {
      const uploadRes = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      const extractedText = uploadRes.data.text;
      const aiRes = await axios.post('http://localhost:5000/api/ai/analyze-resume', { text: extractedText }, {
        headers: { 'x-auth-token': token }
      });
      setAnalysis(aiRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button onClick={() => navigate('/dashboard')} className="mb-4 bg-gray-700 px-4 py-2 rounded">← Back</button>
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Upload Resume (PDF)</h2>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
        <button onClick={handleUpload} disabled={loading} className="bg-purple-600 px-6 py-2 rounded disabled:opacity-50">
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {analysis && (
          <div className="mt-8 bg-gray-800 p-4 rounded">
            <h3 className="text-xl font-bold">ATS Score: {analysis.atsScore}/100</h3>
            <p className="mt-2"><strong>Missing Skills:</strong> {analysis.missingSkills?.join(', ')}</p>
            <p className="mt-2"><strong>Suggestions:</strong> {analysis.suggestions}</p>
            <p><strong>Strengths:</strong> {analysis.strengths}</p>
          </div>
        )}
      </div>
    </div>
  );
}