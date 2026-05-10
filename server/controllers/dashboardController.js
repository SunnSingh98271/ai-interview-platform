exports.getStats = async (req, res) => {
  const sessions = await InterviewSession.find({ userId: req.user, completedAt: { $exists: true } });
  const avgScore = sessions.reduce((acc, s) => acc + s.overallFeedback?.score || 0, 0) / sessions.length;
  res.json({ totalInterviews: sessions.length, avgScore, history: sessions });
};