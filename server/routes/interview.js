const express = require('express');
const auth = require('../middleware/auth');
const InterviewSession = require('../models/InterviewSession');
const { generateQuestions, evaluateAnswer } = require('../utils/ai');
const router = express.Router();

// Start interview - POST /api/interview/start
router.post('/start', auth, async (req, res) => {
  try {
    const { role, type, count = 20 } = req.body; // default 20 questions
    const questions = await generateQuestions(role, type, count);
    const session = new InterviewSession({
      userId: req.user,
      role,
      type,
      questions,
      answers: []
    });
    await session.save();
    res.json({ sessionId: session._id, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Submit answer - POST /api/interview/submit
router.post('/submit', auth, async (req, res) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;
    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ msg: 'Session not found' });
    const question = session.questions[questionIndex];
    const feedback = await evaluateAnswer(question, answer);
    session.answers.push({ question, answer, feedback });
    await session.save();
    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Complete interview - POST /api/interview/complete
router.post('/complete', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ msg: 'Session not found' });
    
    let totalScore = 0;
    for (const ans of session.answers) {
      totalScore += ans.feedback?.score || 0;
    }
    const avgScore = session.answers.length > 0 ? (totalScore / session.answers.length).toFixed(1) : 0;
    session.overallFeedback = { avgScore, totalQuestions: session.answers.length };
    session.completedAt = new Date();
    await session.save();
    res.json({ avgScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;