// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Daftar ekstensi yang diizinkan
const allowedExtensions = [
  // Images
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp',
  // Documents
  '.pdf', '.doc', '.docx', '.txt', '.rtf',
  // Spreadsheets
  '.xls', '.xlsx', '.csv',
  // Presentations
  '.ppt', '.pptx',
  // Audio/Video (jika diperlukan)
  '.mp3', '.mp4', '.avi', '.mov'
];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Gunakan path dari environment variable untuk fleksibilitas
    cb(null, process.env.UPLOAD_DIR || 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Terima file
  } else {
    cb(new Error('Invalid file type. Only images, documents, and common files are allowed.'), false); // Tolak file
  }
};

// Konfigurasi multer dengan filter dan batas ukuran
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;