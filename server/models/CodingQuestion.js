const mongoose = require('mongoose');
const codingQuestionSchema = new mongoose.Schema({
  title: String,
  difficulty: { type: String, enum: ['Easy','Medium','Hard'] },
  description: String,
  example: String,
  starterCode: { type: Map, of: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);