const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware.js');
const { 
    getDocuments, 
    getDocumentById,
    uploadDocument, 
    deleteDocument,
    downloadDocument,
    previewDocument
} = require('../controllers/documentController.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `doc-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

const router = express.Router();

router.get('/', getDocuments);
router.get('/preview/:id', previewDocument);
router.get('/download/:id', downloadDocument);
router.get('/:id', getDocumentById);
router.post('/upload', protect, admin, upload.single('document'), uploadDocument);
router.delete('/:id', protect, admin, deleteDocument);

module.exports = router;