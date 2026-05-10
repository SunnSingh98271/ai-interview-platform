const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const dataBuffer = req.file.buffer;
    // Sahi tarika: pdf-parse ko call karo
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text;
    const resume = new Resume({
      userId: req.user,
      fileName: req.file.originalname,
      text: extractedText
    });
    await resume.save();
    res.json({ msg: 'Resume uploaded', text: extractedText.substring(0, 500) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;