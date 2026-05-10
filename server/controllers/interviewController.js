const InterviewSession = require('../models/InterviewSession');
const { generateQuestions, evaluateAnswer } = require('../utils/ai');

exports.startInterview = async (req, res) => {
  try {
    const { role, type } = req.body; // type = "HR", "Technical", "Mixed"
    // AI se questions generate karo
    const questions = await generateQuestions(role, type);
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
    res.status(500).json({ msg: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;
    const session = await InterviewSession.findById(sessionId);
    const question = session.questions[questionIndex];
    const feedback = await evaluateAnswer(question, answer);
    session.answers.push({ question, answer, feedback });
    await session.save();
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.completeInterview = async (req, res) => {
  // Calculate overall score & final feedback
  // AI se overall summary generate karo
  // session.completedAt = new Date()
};