// frontend/src/pages/exams/ReviewExamPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionForm from './QuestionForm';
import QuestionNavigator from './QuestionNavigator';
import { getResultStatus } from '../../utils/examUtils';

const ReviewExamPage = () => {
  const { id: attemptId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamResult = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/exams/attempts/${attemptId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch exam result');

        const result = await response.json();
        setExamResult(result.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching exam result:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResult();
  }, [attemptId]);

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const formatUserAnswers = (answers) => {
    const formatted = {};
    answers.forEach(answer => {
      formatted[answer.questionId] = answer.answer;
    });
    return formatted;
  };

  const formatCorrectAnswers = (questions) => {
    const formatted = {};
    questions.forEach(question => {
      formatted[question._id] = question.correctAnswer;
    });
    return formatted;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat hasil ujian...</p>
        </div>
      </div>
    );
  }

  if (error || !examResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-4">{error || 'Data tidak ditemukan'}</p>
          <button
            onClick={() => navigate('/exams')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Daftar Ujian
          </button>
        </div>
      </div>
    );
  }

  const { exam, answers, score, timeSpent, submittedAt } = examResult;
  const userAnswers = formatUserAnswers(answers);
  const correctAnswers = formatCorrectAnswers(exam.questions);
  const currentQuestion = exam.questions[currentQuestionIndex];
  const resultStatus = getResultStatus(score, exam.passingGrade);

  const formatTimeSpent = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} menit ${remainingSeconds} detik`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header dengan hasil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Review: {exam.title}
              </h1>
              <p className="text-gray-600">{exam.description}</p>
            </div>
            
            {/* Score Box */}
            <div className="text-center">
              <div className={`text-3xl font-bold ${resultStatus.textColor} mb-1`}>
                {score.toFixed(1)}%
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                resultStatus.status === 'LULUS' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {resultStatus.status}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Nilai Kelulusan: {exam.passingGrade}%
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Durasi:</span> {exam.duration} menit
            </div>
            <div>
              <span className="font-semibold">Waktu Digunakan:</span> {formatTimeSpent(timeSpent)}
            </div>
            <div>
              <span className="font-semibold">Jumlah Soal:</span> {exam.totalQuestions}
            </div>
            <div>
              <span className="font-semibold">Dikirim pada:</span> {new Date(submittedAt).toLocaleString('id-ID')}
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {answers.filter(a => a.isCorrect).length}
              </div>
              <div className="text-sm text-gray-600">Jawaban Benar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {answers.filter(a => !a.isCorrect).length}
              </div>
              <div className="text-sm text-gray-600">Jawaban Salah</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {exam.questions.length - answers.length}
              </div>
              <div className="text-sm text-gray-600">Tidak Dijawab</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <QuestionNavigator
              questions={exam.questions}
              currentQuestionIndex={currentQuestionIndex}
              userAnswers={userAnswers}
              onQuestionSelect={handleQuestionSelect}
              isReview={true}
            />
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3">
            {currentQuestion && (
              <QuestionForm
                question={currentQuestion}
                currentAnswer={userAnswers[currentQuestion._id]}
                onAnswerChange={() => {}} // Disabled in review mode
                questionNumber={currentQuestionIndex + 1}
                isReview={true}
                correctAnswer={correctAnswers[currentQuestion._id]}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Sebelumnya
              </button>
              
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === exam.questions.length - 1}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => navigate('/exams')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Kembali ke Daftar Ujian
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cetak Hasil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewExamPage;