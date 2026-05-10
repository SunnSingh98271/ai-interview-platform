const express = require('express');
const auth = require('../middleware/auth');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const router = express.Router();

// Fallback questions (if MongoDB empty)
const fallbackQuestions = [
  { _id: 1, title: "Two Sum - Basic", difficulty: "Easy", description: "Return indices of two numbers that sum to target.", example: "[2,7,11,15],9→[0,1]" },
  { _id: 2, title: "Reverse String", difficulty: "Easy", description: "Reverse a string.", example: "'hello'→'olleh'" },
  { _id: 3, title: "Palindrome Check", difficulty: "Medium", description: "Check palindrome.", example: "'racecar'→true" }
];

router.get('/questions', auth, async (req, res) => {
  try {
    const CodingQuestion = require('../models/CodingQuestion');
    const dbQuestions = await CodingQuestion.find({ isActive: true }).select('title difficulty description example');
    if (dbQuestions.length) return res.json(dbQuestions);
    else return res.json(fallbackQuestions);
  } catch (err) {
    return res.json(fallbackQuestions);
  }
});

router.post('/run', auth, async (req, res) => {
  const { code, language, stdin = '' } = req.body;

  // ----- JAVASCRIPT (Safe local VM) -----
  if (language === 'javascript') {
    try {
      const vm = require('vm');
      let captured = '';
      const context = { console: { log: (...args) => { captured += args.join(' ') + '\n'; } } };
      new vm.Script(code).runInNewContext(context);
      return res.json({ output: captured || '(No output)', error: false });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ----- PYTHON (Uses 'py' launcher – works on Windows) -----
  if (language === 'python') {
    const tempFile = path.join(os.tmpdir(), `temp_${Date.now()}_${Math.random()}.py`);
    try {
      fs.writeFileSync(tempFile, code);
      exec(`py "${tempFile}"`, { timeout: 5000 }, (err, stdout, stderr) => {
        // Clean up temp file
        try { if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile); } catch(e) {}
        if (err) return res.json({ output: stderr || err.message, error: true });
        res.json({ output: stdout || '(No output)', error: false });
      });
    } catch (e) {
      try { if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile); } catch(e) {}
      res.status(500).json({ error: 'Python execution failed. Ensure Python is installed.' });
    }
    return;
  }

  // ----- ANY OTHER LANGUAGE -> Not supported -----
  res.status(400).json({ error: `Language '${language}' not supported. Use JavaScript or Python.` });
});

module.exports = router;