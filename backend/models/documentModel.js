const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    filename: { 
        type: String, 
        required: true 
    },
    originalFilename: { 
        type: String, 
        required: true 
    },
    filePath: { 
        type: String, 
        required: true 
    },
    fileType: { 
        type: String, 
        required: true 
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select a category'],
    },

    // --- TAMBAHAN UNTUK AI CHATBOT ---
    textContent: {
        type: String, // Menyimpan seluruh teks hasil ekstraksi dari file
        default: ''
    },
    embedding: {
        type: [Number] // Menyimpan vector embedding (misal: 768 angka)
    }
    // ---------------------------------
  },
  {
    timestamps: true,
  }
);

// PENTING: Anda harus membuat Vector Search Index di MongoDB Atlas UI
// Index Name: vector_index
// Fields: {"path": "embedding", "numDimensions": 768, "similarity": "cosine"}
// (Asumsi kita pakai model Google 'embedding-001' dengan 768 dimensi)

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;