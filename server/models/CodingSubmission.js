const mongoose = require('mongoose');

const CodingSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: Number, required: true },
  questionTitle: String,
  code: String,
  language: { type: String, default: 'javascript' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CodingSubmission', CodingSubmissionSchema);