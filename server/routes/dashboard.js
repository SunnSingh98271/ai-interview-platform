const express = require('express');
const auth = require('../middleware/auth');
const InterviewSession = require('../models/InterviewSession');
const router = express.Router();

// Existing stats endpoint
router.get('/stats', auth, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user,
      completedAt: { $exists: true }
    }).sort({ completedAt: 1 });

    const scores = sessions.map(s => ({
      date: s.completedAt.toISOString().split('T')[0],
      score: s.overallFeedback?.avgScore || 0
    }));

    const totalInterviews = sessions.length;
    const avgScore = scores.length > 0
      ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1)
      : 0;

    res.json({ totalInterviews, avgScore, scores });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// NEW: Detailed interview analytics (question-wise breakdown)
router.get('/details', auth, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user,
      completedAt: { $exists: true }
    }).sort({ completedAt: -1 });

    const analytics = sessions.map(session => ({
      _id: session._id,
      role: session.role,
      type: session.type,
      completedAt: session.completedAt,
      overallScore: session.overallFeedback?.avgScore || 0,
      questions: session.answers.map((ans, idx) => ({
        questionNumber: idx + 1,
        question: ans.question,
        answer: ans.answer,
        score: ans.feedback?.score || 0,
        feedback: ans.feedback?.comments || ''
      }))
    }));

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;