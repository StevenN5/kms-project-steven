const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: [true, 'Teks pertanyaan harus diisi'] 
  },
  questionType: { 
    type: String, 
    enum: ['multiple_choice', 'true_false', 'essay'],
    default: 'multiple_choice'
  },
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  points: { 
    type: Number, 
    default: 1,
    min: [1, 'Poin minimal 1']
  },
  explanation: String,
  maxLength: {
    type: Number,
    default: 500
  }
});

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
  questions: [questionSchema],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const examAttemptSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    questionType: String
  }],
  score: {
    type: Number,
    default: 0
  },
  timeSpent: Number,
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'expired'],
    default: 'in_progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date
}, {
  timestamps: true
});

const Exam = mongoose.model('Exam', examSchema);
const ExamAttempt = mongoose.model('ExamAttempt', examAttemptSchema);

module.exports = { Exam, ExamAttempt };