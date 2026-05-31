// client/src/config.js
const isProduction = import.meta.env.PROD;
const API_URL = isProduction 
  ? 'https://ai-interview-platform.onrender.com' 
  : 'http://localhost:5000';

export default API_URL;