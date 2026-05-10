const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper to clean JSON from markdown
function cleanJSONResponse(text) {
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }
  return cleaned;
}

// Resume analysis (existing)
exports.analyzeResume = async (resumeText) => {
  const prompt = `
    You are an expert ATS resume analyzer. Analyze the following resume text.
    Return ONLY valid JSON in this format:
    {
      "atsScore": 85,
      "missingSkills": ["React", "Node.js", "MongoDB"],
      "suggestions": "Add more quantifiable achievements and relevant keywords.",
      "strengths": "Good communication skills"
    }
    Resume: """${resumeText.substring(0, 3000)}"""
  `;
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });
  const raw = response.choices[0].message.content;
  const cleaned = cleanJSONResponse(raw);
  return JSON.parse(cleaned);
};

// Generate interview questions (updated with count)
exports.generateQuestions = async (role, type, count = 20) => {
  const prompt = `
    Generate ${count} interview questions for a ${role} position.
    Type: ${type} (HR, Technical, or Mixed).
    The questions should be diverse, covering different aspects of the role.
    Return ONLY a valid JSON array of strings: ["Q1", "Q2", "Q3", ..., "Q${count}"]
  `;
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });
  const raw = response.choices[0].message.content;
  const cleaned = cleanJSONResponse(raw);
  return JSON.parse(cleaned);
};

// Evaluate answer
exports.evaluateAnswer = async (question, answer) => {
  const prompt = `
    Question: "${question}"
    Candidate's answer: "${answer}"
    Evaluate on relevance, correctness, confidence, communication.
    Return ONLY valid JSON: { "score": 0-10, "comments": "feedback text" }
  `;
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });
  const raw = response.choices[0].message.content;
  const cleaned = cleanJSONResponse(raw);
  const parsed = JSON.parse(cleaned);
  return {
    score: Number(parsed.score),
    comments: parsed.comments || 'Keep practicing!'
  };
};
// NEW: Answer any question for Q&A feature
exports.answerQuestion = async (question) => {
  const prompt = `
    You are a helpful technical interview assistant. Answer the following question clearly and concisely, as if you are explaining to a job candidate.
    Question: "${question}"
    Provide a detailed but to-the-point answer.
  `;
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5
  });
  return response.choices[0].message.content;
};