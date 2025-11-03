// frontend/src/pages/exams/TakeExamPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamActions } from '../../hooks/useExam';
import Timer from './Timer';
import QuestionForm from './QuestionForm';
import QuestionNavigator from './QuestionNavigator';

const TakeExamPage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const {
    currentExam,
    currentAttempt,
    userAnswers,
    timeLeft,
    loading,
    error,
    fetchExam,
    startExamAttempt,
    submitExamAnswers,
    updateAnswer,
    updateTimeLeft,
    clearCurrentExam
  } = useExamActions();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const initializeExam = async () => {
      try {
        // Fetch exam data
        const exam = await fetchExam(examId);
        
        // Start attempt if not already started
        if (!currentAttempt) {
          await startExamAttempt(examId);
        }
      } catch (err) {
        console.error('Error initializing exam:', err);
        navigate('/exams');
      }
    };

    initializeExam();

    return () => {
      // Cleanup on unmount
      if (!isSubmitting) {
        clearCurrentExam();
      }
    };
  }, [examId]);

  const handleTimeUp = async () => {
    await handleSubmitExam();
  };

  const handleAnswerChange = (questionId, answer) => {
    updateAnswer(questionId, answer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentExam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = async () => {
    try {
      setIsSubmitting(true);
      await submitExamAnswers(currentAttempt._id, userAnswers);
      setShowSubmitModal(false);
      navigate(`/exams/results/${currentAttempt._id}`);
    } catch (err) {
      console.error('Error submitting exam:', err);
      alert('Gagal mengirim jawaban. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = currentExam?.questions?.[currentQuestionIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Mempersiapkan ujian...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  if (!currentExam || !currentAttempt) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {currentExam.title}
              </h1>
              <p className="text-gray-600">{currentExam.description}</p>
            </div>
            <Timer 
              initialTime={timeLeft} 
              onTimeUp={handleTimeUp}
              isActive={!isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Durasi:</span> {currentExam.duration} menit
            </div>
            <div>
              <span className="font-semibold">Jumlah Soal:</span> {currentExam.totalQuestions}
            </div>
            <div>
              <span className="font-semibold">Nilai Kelulusan:</span> {currentExam.passingGrade}%
            </div>
            <div>
              <span className="font-semibold">Status:</span> 
              <span className="ml-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                Sedang Berlangsung
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <QuestionNavigator
              questions={currentExam.questions}
              currentQuestionIndex={currentQuestionIndex}
              userAnswers={userAnswers}
              onQuestionSelect={handleQuestionSelect}
            />
            
            {/* Submit Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={isSubmitting}
              className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? 'Mengirim...' : 'Selesai & Kirim Jawaban'}
            </button>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3">
            {currentQuestion && (
              <QuestionForm
                question={currentQuestion}
                currentAnswer={userAnswers[currentQuestion._id]}
                onAnswerChange={handleAnswerChange}
                questionNumber={currentQuestionIndex + 1}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Sebelumnya
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === currentExam.questions.length - 1}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Konfirmasi Pengiriman
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin mengirim jawaban? Setelah dikirim, Anda tidak dapat mengubah jawaban lagi.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? 'Mengirim...' : 'Ya, Kirim Jawaban'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeExamPage;