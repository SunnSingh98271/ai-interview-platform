const mongoose = require('mongoose');
const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: String,
  text: String,
  atsScore: Number,
  analysis: Object,
  uploadedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Resume', ResumeSchema);