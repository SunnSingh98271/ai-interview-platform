const axios = require('axios');

class Judge0Service {
  constructor() {
    this.baseURL = process.env.JUDGE0_BASE_URL || 'http://localhost:2358';
  }

  async executeCode({ source_code, language_id, stdin = '' }) {
    try {
      const response = await axios.post(`${this.baseURL}/submissions?wait=true`, {
        source_code,
        language_id,
        stdin,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Judge0 error:', error.response?.data || error.message);
      throw new Error('Code execution failed: ' + (error.response?.data?.message || error.message));
    }
  }

  async getLanguages() {
    try {
      const response = await axios.get(`${this.baseURL}/languages`);
      return response.data;
    } catch (error) {
      console.error('Languages fetch error:', error.message);
      throw new Error('Failed to fetch languages');
    }
  }
}

module.exports = new Judge0Service();