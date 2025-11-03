const { Exam, ExamAttempt } = require('../models/examModel');
const asyncHandler = require('express-async-handler');

// Create new exam
const createExam = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    duration,
    passingGrade,
    questions,
    startTime,
    endTime,
    maxAttempts,
    allowedUsers
  } = req.body;

  console.log('Received exam data:', req.body);

  // Validation
  if (!title || !duration || !startTime || !endTime) {
    res.status(400);
    throw new Error('Harap isi semua field yang wajib: judul, durasi, waktu mulai, waktu selesai');
  }

  if (!questions || questions.length === 0) {
    res.status(400);
    throw new Error('Ujian harus memiliki minimal 1 soal');
  }

  try {
    const exam = await Exam.create({
      title,
      description: description || '',
      duration: parseInt(duration),
      passingGrade: passingGrade || 70,
      questions: questions.map(q => ({
        questionText: q.questionText,
        questionType: q.questionType || 'multiple_choice',
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        points: q.points || 1,
        maxLength: q.maxLength || 500,
        explanation: q.explanation || ''
      })),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      maxAttempts: maxAttempts || 1,
      allowedUsers: allowedUsers || [],
      totalQuestions: questions.length,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: exam
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(400);
    throw new Error(`Gagal membuat ujian: ${error.message}`);
  }
});

// Get all exams
const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ isActive: true })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: exams.length,
    data: exams
  });
});

// Get single exam
const getExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('allowedUsers', 'name email');

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  res.json({
    success: true,
    data: exam
  });
});

// Start exam attempt
const startExamAttempt = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  
  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // Check if exam is active and within time
  const now = new Date();
  if (now < exam.startTime) {
    res.status(400);
    throw new Error('Exam has not started yet');
  }

  if (now > exam.endTime) {
    res.status(400);
    throw new Error('Exam has ended');
  }

  // Check attempts
  const existingAttempts = await ExamAttempt.countDocuments({
    exam: exam._id,
    user: req.user._id
  });

  if (existingAttempts >= exam.maxAttempts) {
    res.status(400);
    throw new Error('Maximum attempts reached for this exam');
  }

  const attempt = await ExamAttempt.create({
    exam: exam._id,
    user: req.user._id,
    status: 'in_progress'
  });

  await attempt.populate('exam');

  res.status(201).json({
    success: true,
    data: attempt
  });
});

// Submit exam answers
const submitExamAttempt = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const attempt = await ExamAttempt.findById(req.params.attemptId)
    .populate('exam');

  if (!attempt) {
    res.status(404);
    throw new Error('Attempt not found');
  }

  if (attempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to submit this attempt');
  }

  // Calculate score
  let score = 0;
  const evaluatedAnswers = [];

  for (const answer of answers) {
    const question = attempt.exam.questions.id(answer.questionId);
    let isCorrect = false;
    
    if (question) {
      if (question.questionType === 'essay') {
        // Essay questions are automatically marked as correct for now
        // Can be modified later for manual grading
        isCorrect = true;
      } else {
        // For multiple choice and true/false
        isCorrect = answer.answer == question.correctAnswer;
      }
      
      if (isCorrect) {
        score += question.points || 1;
      }
    }

    evaluatedAnswers.push({
      questionId: answer.questionId,
      answer: answer.answer,
      isCorrect,
      questionType: question?.questionType
    });
  }

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
});

// Get exam attempt by ID
const getExamAttempt = asyncHandler(async (req, res) => {
  const attempt = await ExamAttempt.findById(req.params.id)
    .populate('exam')
    .populate('user', 'name email');

  if (!attempt) {
    res.status(404);
    throw new Error('Exam attempt not found');
  }

  if (attempt.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this attempt');
  }

  res.json({
    success: true,
    data: attempt
  });
});

// Get user's exam results
const getUserResults = asyncHandler(async (req, res) => {
  const results = await ExamAttempt.find({ user: req.user._id })
    .populate('exam', 'title passingGrade duration totalQuestions startTime endTime')
    .sort({ submittedAt: -1 });

  res.json({
    success: true,
    data: results
  });
});

module.exports = {
  createExam,
  getExams,
  getExam,
  startExamAttempt,
  submitExamAttempt,
  getExamAttempt,
  getUserResults
};