// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import Interview from './pages/Interview';
import Coding from './pages/Coding';
import AdminQuestions from './pages/AdminQuestions';
import AdminUpload from './pages/AdminUpload';
import Analytics from './pages/Analytics';
import AIQA from './pages/AIQA';




function App() {
  const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/upload-resume" element={token ? <UploadResume /> : <Navigate to="/login" />} />
        <Route path="/interview" element={token ? <Interview /> : <Navigate to="/login" />} />
        <Route path="/coding" element={token ? <Coding /> : <Navigate to="/login" />} />
        <Route path="/admin/questions" element={token ? <AdminQuestions /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="/admin/upload" element={token ? <AdminUpload /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={token ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="/ai-qa" element={token ? <AIQA /> : <Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;