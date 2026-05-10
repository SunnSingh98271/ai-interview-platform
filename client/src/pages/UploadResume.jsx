import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

export default function UploadResume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Select PDF');
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    const token = localStorage.getItem('token');
    try {
      const uploadRes = await axios.post(`${API_URL}/api/resume/upload`, formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      const aiRes = await axios.post(`${API_URL}/api/ai/analyze-resume`, { text: uploadRes.data.text }, {
        headers: { 'x-auth-token': token }
      });
      setAnalysis(aiRes.data);
    } catch (err) { alert('Upload failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button onClick={() => navigate('/dashboard')} className="mb-4 bg-gray-700 px-4 py-2 rounded">← Back</button>
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Upload Resume (PDF)</h2>
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} className="mb-4" />
        <button onClick={handleUpload} disabled={loading} className="bg-purple-600 px-6 py-2 rounded">{loading ? 'Analyzing...' : 'Analyze'}</button>
        {analysis && (<div className="mt-8 bg-gray-800 p-4 rounded"><h3 className="text-xl font-bold">ATS Score: {analysis.atsScore}/100</h3><p><strong>Missing Skills:</strong> {analysis.missingSkills?.join(', ')}</p><p><strong>Suggestions:</strong> {analysis.suggestions}</p></div>)}
      </div>
    </div>
  );
}