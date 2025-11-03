const Document = require('../models/documentModel.js');
const path = require('path');
const fs = require('fs');

// --- Import Baru untuk AI ---
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- Inisialisasi Google AI ---
// Pastikan GOOGLE_API_KEY ada di file .env Anda
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });


// ==========================================================
// KONSTANTA & HELPERS (DARI KODE ANDA)
// ==========================================================

const MIME_TYPES = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.flv': 'video/x-flv',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.flac': 'audio/flac',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
};

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
const VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];
const OFFICE_EXTENSIONS = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

const getMimeType = (ext) => MIME_TYPES[ext] || 'application/octet-stream';

const validateDocumentAndFile = async (documentId) => {
    const document = await Document.findById(documentId)
        .populate('uploader', 'username')
        .populate('category', 'name');
    
    if (!document) {
        throw new Error('Document not found');
    }

    const filePath = path.resolve(document.filePath);
    if (!fs.existsSync(filePath)) {
        throw new Error('File not found on server');
    }

    return { document, filePath };
};

const setPreviewHeaders = (res, contentType, contentLength, filename) => {
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', contentLength);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
};

const setDownloadHeaders = (res, filename) => {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
};

const streamFile = (filePath, res) => {
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
};

const sendDirectPreview = (res, filePath, document, mimeType) => {
    const stat = fs.statSync(filePath);
    setPreviewHeaders(res, mimeType, stat.size, document.originalFilename);
    streamFile(filePath, res);
};

const sendExternalViewerPage = (res, document, downloadUrl, viewerType = 'office') => {
    const isOfficeViewer = viewerType === 'office';
    const viewerUrl = isOfficeViewer 
        ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(downloadUrl)}`
        : `https://docs.google.com/gview?url=${encodeURIComponent(downloadUrl)}&embedded=true`;
    
    const viewerName = isOfficeViewer ? 'Microsoft Office Online' : 'Google Docs Viewer';

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${document.originalFilename} - Preview</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                    background: #f8fafc;
                    color: #334155;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .header {
                    background: white;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 1rem 2rem;
                    flex-shrink: 0;
                }
                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .document-info h1 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 0.25rem;
                }
                .document-info p {
                    color: #64748b;
                    font-size: 0.875rem;
                }
                .actions {
                    display: flex;
                    gap: 0.75rem;
                }
                .btn {
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .btn-primary {
                    background: #0891b2;
                    color: white;
                    border: 1px solid #0891b2;
                }
                .btn-primary:hover {
                    background: #0e7490;
                    border-color: #0e7490;
                }
                .btn-secondary {
                    background: white;
                    color: #475569;
                    border: 1px solid #d1d5db;
                }
                .btn-secondary:hover {
                    background: #f9fafb;
                    border-color: #9ca3af;
                }
                .viewer-container {
                    flex: 1;
                    padding: 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .iframe-container {
                    background: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    overflow: hidden;
                    flex: 1;
                    min-height: 0;
                }
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .notice {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    color: #92400e;
                }
                .notice strong {
                    display: block;
                    margin-bottom: 0.5rem;
                }
                @media (max-width: 768px) {
                    .header { padding: 1rem; }
                    .header-content { flex-direction: column; gap: 1rem; align-items: flex-start; }
                    .actions { width: 100%; justify-content: space-between; }
                    .btn { flex: 1; justify-content: center; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="header-content">
                    <div class="document-info">
                        <h1>${document.originalFilename}</h1>
                        <p>Preview powered by ${viewerName}</p>
                    </div>
                    <div class="actions">
                        <a href="${downloadUrl}" class="btn btn-secondary" download>
                            📥 Download Original
                        </a>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/documents/${document._id}" class="btn btn-primary">
                            ← Back to Details
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="viewer-container">
                <div class="notice">
                    <strong>📝 External Preview</strong>
                    This document is being previewed using ${viewerName}. For the best experience, download the original file.
                </div>
                
                <div class="iframe-container">
                    <iframe src="${viewerUrl}" title="Document Preview"></iframe>
                </div>
            </div>
        </body>
        </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
};

// ==========================================================
// FUNGSI HELPER BARU UNTUK AI
// ==========================================================

const extractTextFromFile = async (filePath, fileType) => {
    try {
        if (fileType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // .docx
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else if (fileType === 'text/plain') {
            return fs.readFileSync(filePath, 'utf8');
        }
        // Tambahkan .pptx, .xlsx jika perlu
        console.log(`Tipe file ${fileType} tidak didukung untuk ekstraksi teks oleh AI.`);
        return null; // Tipe file tidak didukung
    } catch (error) {
        console.error('Error extracting text:', error);
        throw new Error('Failed to extract text from file');
    }
};

const generateEmbedding = async (text) => {
    if (!text || text.trim().length === 0) {
        console.log("Tidak ada teks untuk di-embed.");
        return null;
    }
    try {
        // Model embedding punya batas token. Kita potong teks jika terlalu panjang.
        const truncatedText = text.substring(0, 8000); 
        
        const result = await embeddingModel.embedContent(truncatedText);
        return result.embedding.values; // Ini adalah vector [0.1, 0.2, ..., 0.9]
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding');
    }
};

// ==========================================================
// CONTROLLER FUNCTIONS
// ==========================================================

const getDocuments = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category;
        }

        const documents = await Document.find(filter)
            .populate('uploader', 'username')
            .populate('category', 'name');
        
        res.json(documents);
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ message: 'Server error while fetching documents' });
    }
};

const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('uploader', 'username')
            .populate('category', 'name');
        
        if (document) {
            res.json(document);
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        console.error('Get document by ID error:', error);
        res.status(500).json({ message: 'Server error while fetching document' });
    }
};

// --- FUNGSI INI DIMODIFIKASI DENGAN LOGIKA AI ---
const uploadDocument = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { filename, path: filePath, mimetype: fileType, originalname } = req.file;

        // --- MULAI LOGIKA AI ---
        
        // 1. Ekstrak Teks
        let textContent = await extractTextFromFile(filePath, fileType);

        // 2. Buat Embedding (Vector)
        let embedding = null;
        let textForEmbedding = textContent;

        if (!textForEmbedding || textForEmbedding.trim().length === 0) {
            // Fallback: Jika tidak ada teks (misal file gambar),
            // kita buat embedding dari judul + deskripsi
            textForEmbedding = `${title} - ${description}`;
        }
        
        embedding = await generateEmbedding(textForEmbedding);

        // --- SELESAI LOGIKA AI ---


        // 3. Simpan ke DB (dengan data AI)
        const document = new Document({
            title,
            description,
            filename: filename, // Nama file dari multer
            originalFilename: originalname, // Nama file asli
            filePath: filePath, // Path file di server
            fileType: fileType, // Tipe MIME
            uploader: req.user._id,
            category: categoryId,
            
            // --- Field Baru untuk AI ---
            textContent: textContent || '', // Simpan teks hasil ekstraksi
            embedding: embedding       // Simpan vector
        });

        const createdDocument = await document.save();
        res.status(201).json(createdDocument);

    } catch (error) {
        console.error('Upload document error:', error);
        
        // Hapus file jika terjadi error saat simpan DB
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
                console.error('Error deleting file after upload fail:', unlinkErr);
            }
        }
        
        res.status(500).json({ 
            message: 'Server error while uploading document',
            error: error.message 
        });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        fs.unlink(document.filePath, (err) => {
            if (err) console.error('Error deleting physical file:', err);
        });

        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document removed successfully' });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ message: 'Server error while deleting document' });
    }
};

const previewDocument = async (req, res) => {
    try {
        const { document, filePath } = await validateDocumentAndFile(req.params.id);
        const ext = path.extname(document.originalFilename).toLowerCase(); // Gunakan originalFilename untuk ekstensi
        const mimeType = getMimeType(ext);

        console.log(`Preview request: ${document.originalFilename} (${ext})`);

        if (ext === '.pdf' || IMAGE_EXTENSIONS.includes(ext) || 
            VIDEO_EXTENSIONS.includes(ext) || AUDIO_EXTENSIONS.includes(ext) || ext === '.txt') { // Tambahkan .txt
            return sendDirectPreview(res, filePath, document, mimeType);
        }

        if (OFFICE_EXTENSIONS.includes(ext)) {
            const downloadUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/documents/download/${document._id}`;
            return sendExternalViewerPage(res, document, downloadUrl, 'office');
        }

        const htmlResponse = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview Not Supported - ${document.originalFilename}</title>
                <style>
                    body { 
                        margin: 0; 
                        padding: 2rem; 
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                        background: #f8fafc;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .container {
                        background: white;
                        padding: 3rem;
                        border-radius: 1rem;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        text-align: center;
                        max-width: 500px;
                    }
                    .icon { font-size: 4rem; margin-bottom: 1.5rem; }
                    h1 { color: #1e293b; margin-bottom: 1rem; }
                    p { color: #64748b; margin-bottom: 1.5rem; line-height: 1.6; }
                    .btn {
                        display: inline-block;
                        padding: 0.75rem 1.5rem;
                        background: #0891b2;
                        color: white;
                        text-decoration: none;
                        border-radius: 0.5rem;
                        font-weight: 500;
                        transition: background 0.2s;
                    }
                    .btn:hover { background: #0e7490; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">📄</div>
                    <h1>Preview Not Supported</h1>
                    <p>File type <strong>${ext}</strong> cannot be previewed in the browser.</p>
                    <p>Please download the file to view its contents.</p>
                    <a href="/api/documents/download/${document._id}" class="btn">
                        Download ${document.originalFilename}
                    </a>
                </div>
            </body>
            </html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        return res.send(htmlResponse);

    } catch (error) {
        console.error('Preview error:', error);
        
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview Error</title>
                <style>
                    body { 
                        margin: 0; 
                        padding: 2rem; 
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                        background: #fef2f2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .container {
                        background: white;
                        padding: 2rem;
                        border-radius: 0.5rem;
                        border: 1px solid #fecaca;
                        text-align: center;
                        max-width: 500px;
                    }
                    h1 { color: #dc2626; margin-bottom: 1rem; }
                    p { color: #7f1d1d; margin-bottom: 1.5rem; }
                    .btn {
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        background: #666;
                        color: white;
                        text-decoration: none;
                        border-radius: 0.375rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Preview Error</h1>
                    <p>${error.message}</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/repository" class="btn">
                        Back to Documents
                    </a>
                </div>
            </body>
            </html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        
        if (error.message === 'Document not found' || error.message === 'File not found on server') {
            res.status(404).send(errorHtml);
        } else {
            res.status(500).send(errorHtml);
        }
    }
};

const downloadDocument = async (req, res) => {
    try {
        const { document, filePath } = await validateDocumentAndFile(req.params.id);
        
        console.log(`Download request: ${document.originalFilename}`);
        
        // --- PERBAIKAN: Set header MIME type dan download ---
        const ext = path.extname(document.originalFilename).toLowerCase();
        const mimeType = getMimeType(ext);
        res.setHeader('Content-Type', mimeType);
        setDownloadHeaders(res, document.originalFilename); // Ini hanya set 'Content-Disposition: attachment'
        
        res.download(filePath, document.originalFilename);
    } catch (error) {
        console.error('Download error:', error);
        if (error.message === 'Document not found') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'File not found on server') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error during download' });
        }
    }
};

module.exports = { 
    getDocuments, 
    getDocumentById, 
    uploadDocument, 
    deleteDocument, 
    downloadDocument,
    previewDocument 
};