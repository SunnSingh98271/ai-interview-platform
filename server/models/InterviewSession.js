const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: String,
  answer: String,
  feedback: {
    score: Number,
    comments: String
  },
  timestamp: { type: Date, default: Date.now }
});

const InterviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: String,
  type: String,        // HR, Technical, Mixed
  questions: [String],
  answers: [AnswerSchema],
  overallFeedback: {
    avgScore: Number,
    totalQuestions: Number,
    totalScore: Number
  },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);