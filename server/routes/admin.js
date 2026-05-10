const express = require('express');
const auth = require('../middleware/auth');
const CodingQuestion = require('../models/CodingQuestion');
const router = express.Router();

// Simple admin check – replace with actual role verification later
const isAdmin = (req, res, next) => {
  // For now, allow any authenticated user to manage questions
  // In production, check `req.user.role === 'admin'`
  next();
};

// GET all questions (admin view)
router.get('/questions', auth, isAdmin, async (req, res) => {
  const questions = await CodingQuestion.find();
  res.json(questions);
});

// POST new question
router.post('/questions', auth, isAdmin, async (req, res) => {
  const q = new CodingQuestion(req.body);
  await q.save();
  res.json(q);
});

// PUT update question
router.put('/questions/:id', auth, isAdmin, async (req, res) => {
  const q = await CodingQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(q);
});

// DELETE question
router.delete('/questions/:id', auth, isAdmin, async (req, res) => {
  await CodingQuestion.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

// BULK UPLOAD (JSON array)
router.post('/upload-questions', auth, isAdmin, async (req, res) => {
  try {
    const questions = req.body;
    if (!Array.isArray(questions)) return res.status(400).json({ msg: 'Expected array of questions' });
    const inserted = await CodingQuestion.insertMany(questions);
    res.json({ msg: `${inserted.length} questions added` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;    