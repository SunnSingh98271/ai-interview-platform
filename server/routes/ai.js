const express = require('express');
const auth = require('../middleware/auth');
const { analyzeResume, answerQuestion } = require('../utils/ai');
const router = express.Router();

// Analyze resume
router.post('/analyze-resume', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const analysis = await analyzeResume(text);
    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// NEW: Answer any question
router.post('/answer', auth, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    const answer = await answerQuestion(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;