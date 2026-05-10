const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse');

// Upload and parse PDF
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    // Save to DB
    const resume = new Resume({
      userId: req.user,
      fileName: req.file.originalname,
      text: extractedText,
      uploadedAt: new Date()
    });
    await resume.save();
    res.json({ msg: 'Resume uploaded', text: extractedText.substring(0, 500) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};