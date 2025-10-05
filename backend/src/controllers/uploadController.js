const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text || '';
}

async function extractFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || '';
}

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { mimetype, path: filePath } = req.file;

    let text = '';
    if (mimetype === 'application/pdf') {
      const buffer = fs.readFileSync(filePath);
      text = await extractFromPDF(buffer);
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractFromDOCX(filePath);
    } else if (mimetype === 'application/msword') {
      text = '';
    } else if (mimetype.startsWith('image/')) {
      return res.json({ text: '', preview_url: `/uploads/${path.basename(filePath)}` });
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    res.json({ text, preview_url: `/uploads/${path.basename(filePath)}` });
  } catch (e) { next(e); }
};
