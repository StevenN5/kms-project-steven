const express = require('express');
const router = express.Router();
const { Exam, ExamAttempt } = require('../models/examModel');
const { protect, admin } = require('../middleware/authMiddleware.js'); // <-- 1. IMPORT 'admin'

// ==========================================================
// RUTE BARU YANG HILANG (FIX)
// ==========================================================
// GET /api/exams - Get list of exams for the user
router.get('/', protect, async (req, res) => {
  try {
    let filter = {
      isActive: true, // Hanya tampilkan ujian yang aktif
    };

    // Jika user BUKAN admin, filter berdasarkan siapa yang boleh akses
    if (req.user.role !== 'admin') {
      filter.$or = [
        // 1. User ada di dalam daftar allowedUsers
        { allowedUsers: req.user._id },
        // 2. Ujian ini publik (allowedUsers kosong atau tidak ada)
        { allowedUsers: { $exists: true, $size: 0 } },
        { allowedUsers: { $exists: false } }
      ];
    }

    // Admin akan mendapat semua ujian (karena filter tidak diubah)
    const exams = await Exam.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: exams
    });

  } catch (error) {
    console.error('Error fetching exams list:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar ujian',
      error: error.message
    });
  }
});

// ==========================================================
// RUTE LAINNYA (DIPERBAIKI DENGAN PROTECT & ADMIN)
// ==========================================================

// GET /api/exams/results - Get user's exam results (SUDAH DIPERBAIKI)
router.get('/results', protect, async (req, res) => {
  try {
    const results = await ExamAttempt.find({ user: req.user._id }) // <-- Filter per user
      .populate('exam', 'title passingGrade duration totalQuestions startTime endTime')
      .populate('user', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil hasil ujian',
      error: error.message
    });
  }
});

// POST /api/exams - Create new exam (Hanya Admin)
router.post('/', protect, admin, async (req, res) => { // <-- 2. Lindungi
  try {
    const exam = new Exam({
      ...req.body,
      createdBy: req.user._id, // Set pembuatnya
      totalQuestions: req.body.questions.length
    });

    const createdExam = await exam.save();
    res.status(201).json({
      success: true,
      data: createdExam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal membuat ujian',
      error: error.message
    });
  }
});

// GET /api/exams/:id - Get single exam
router.get('/:id', protect, async (req, res) => { // <-- 3. Lindungi
  try {
    const exam = await Exam.findById(req.params.id);
    if (exam) {
      // (Di sini bisa ditambahkan cek 'allowedUsers' juga jika perlu)
      res.json({
        success: true,
        data: exam
      });
    } else {
      res.status(404).json({ success: false, message: 'Exam not found' });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data ujian',
      error: error.message
    });
  }
});

// POST /api/exams/:id/start - Start exam attempt
router.post('/:id/start', protect, async (req, res) => { // <-- 4. Lindungi
  try {
    // ... (sisa logika start)
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    // (Cek allowedUsers sebelum start)
    if (req.user.role !== 'admin' && exam.allowedUsers && exam.allowedUsers.length > 0) {
      if (!exam.allowedUsers.includes(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Anda tidak diizinkan mengambil ujian ini' });
      }
    }
    // ...
    const existingAttempt = await ExamAttempt.findOne({
      exam: req.params.id,
      user: req.user._id,
      status: 'in_progress'
    });

    if (existingAttempt) {
      return res.json({ success: true, data: existingAttempt });
    }

    const attempt = new ExamAttempt({
      exam: req.params.id,
      user: req.user._id,
      status: 'in_progress',
      startedAt: new Date(),
      answers: [],
      timeLeft: exam.duration * 60
    });

    const savedAttempt = await attempt.save();
    res.status(201).json({ success: true, data: savedAttempt });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memulai ujian',
      error: error.message
    });
  }
});

// POST /api/exams/:id/submit - Submit exam
router.post('/:id/submit', protect, async (req, res) => { // <-- 5. Lindungi
  try {
    // ... (sisa logika submit)
    const { attemptId, answers } = req.body;
    const attempt = await ExamAttempt.findById(attemptId).populate('exam');
    
    if (!attempt || attempt.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Attempt not found or not yours' });
    }

    let score = 0;
    const evaluatedAnswers = attempt.exam.questions.map(q => {
        const userAnswer = answers[q._id];
        const isCorrect = (userAnswer !== undefined) && (userAnswer == q.correctAnswer);
        if(isCorrect) {
            score += q.points || 1;
        }
        return {
            questionId: q._id,
            answer: userAnswer,
            isCorrect: isCorrect,
            questionType: q.questionType
        };
    });

    const totalPoints = attempt.exam.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const finalScore = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

    attempt.answers = evaluatedAnswers;
    attempt.score = finalScore;
    attempt.status = 'completed';
    attempt.submittedAt = new Date();
    attempt.timeSpent = Math.floor((new Date() - attempt.startedAt) / 1000);

    await attempt.save();
    
    res.json({
      success: true,
      data: attempt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal submit ujian',
      error: error.message
    });
  }
});

// GET /api/exams/attempts/:id - Get exam attempt by ID
router.get('/attempts/:id', protect, async (req, res) => { // <-- 6. Lindungi
  try {
    const attempt = await ExamAttempt.findById(req.params.id)
      .populate('exam')
      .populate('user', 'name email');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Exam attempt not found'
      });
    }
    
    // Pastikan hanya user ybs atau admin yg bisa lihat
    if (attempt.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: attempt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data attempt',
      error: error.message
    });
  }
});

// DELETE /api/exams/:id - Delete exam (Hanya Admin)
router.delete('/:id', protect, admin, async (req, res) => { // <-- 7. Lindungi
  try {
    // ... (sisa logika delete)
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    await ExamAttempt.deleteMany({ exam: req.params.id });
    await Exam.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Exam and related attempts deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus ujian',
      error: error.message
    });
  }
});

module.exports = router;