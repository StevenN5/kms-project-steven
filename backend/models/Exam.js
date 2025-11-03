const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Judul ujian harus diisi'] 
  },
  description: String,
  duration: { 
    type: Number, 
    required: [true, 'Durasi ujian harus diisi'],
    min: [1, 'Durasi minimal 1 menit']
  },
  passingGrade: { 
    type: Number, 
    required: [true, 'Nilai kelulusan harus diisi'],
    min: [1, 'Nilai kelulusan minimal 1%'],
    max: [100, 'Nilai kelulusan maksimal 100%']
  },
  startTime: { 
    type: Date, 
    required: [true, 'Waktu mulai harus diisi'] 
  },
  endTime: { 
    type: Date, 
    required: [true, 'Waktu selesai harus diisi'] 
  },
  maxAttempts: { 
    type: Number, 
    default: 1,
    min: [1, 'Maksimal attempt minimal 1']
  },
  questions: [{
    questionText: { 
      type: String, 
      required: [true, 'Teks pertanyaan harus diisi'] 
    },
    questionType: { 
      type: String, 
      enum: ['multiple_choice', 'true_false'],
      default: 'multiple_choice'
    },
    options: [String],
    correctAnswer: { 
      type: Number, 
      required: [true, 'Jawaban benar harus dipilih'] 
    },
    points: { 
      type: Number, 
      default: 1,
      min: [1, 'Poin minimal 1']
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);