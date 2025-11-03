import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResultStatus } from '../utils/examUtils';

const ReviewExamPage = () => {
  const { id: attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/exams/attempts/${attemptId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch exam attempt');

        const result = await response.json();
        setAttempt(result.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching exam attempt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptData();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat review ujian...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
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

  const { exam, score, answers } = attempt;
  const resultStatus = getResultStatus(score, exam.passingGrade);
  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion._id);

  const formatTime = (seconds) => {
    if (!seconds) return '0 menit';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes} menit ${remainingSeconds} detik` : `${remainingSeconds} detik`;
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Review Jawaban Ujian</h1>
                <p className="text-blue-100">{exam.title}</p>
              </div>
              <div className="mt-4 md:mt-0 text-center md:text-right">
                <div className={`text-3xl font-bold ${resultStatus.textColor} mb-2`}>
                  {score.toFixed(1)}%
                </div>
                <div className={`px-4 py-1 rounded-full text-sm font-semibold inline-block ${
                  resultStatus.status === 'LULUS' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {resultStatus.status}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Soal:</span>
                <span className="font-semibold">{exam.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jawaban Benar:</span>
                <span className="font-semibold text-green-600">
                  {answers.filter(a => a.isCorrect).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Waktu Digunakan:</span>
                <span className="font-semibold">{formatTime(attempt.timeSpent)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="font-semibold text-gray-800 mb-4">Daftar Soal</h3>
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2">
                {exam.questions.map((question, index) => {
                  const answer = answers.find(a => a.questionId === question._id);
                  const isCurrent = index === currentQuestionIndex;
                  const isAnswered = answer && answer.answer !== undefined && answer.answer !== null;
                  const isCorrect = answer ? answer.isCorrect : false;

                  return (
                    <button
                      key={question._id}
                      onClick={() => navigateToQuestion(index)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : isAnswered
                            ? isCorrect
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                    <span className="text-gray-600">Jawaban Benar</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                    <span className="text-gray-600">Jawaban Salah</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                    <span className="text-gray-600">Tidak Dijawab</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/exams/results/${attemptId}`}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg transition-colors block"
                >
                  Kembali ke Hasil
                </Link>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-lg">
              {/* Question Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Soal {currentQuestionIndex + 1} dari {exam.questions.length}
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentAnswer?.isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentAnswer?.isCorrect ? 'BENAR' : 'SALAH'}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    {currentQuestion.questionText}
                  </h3>
                  
                  {currentQuestion.questionType === 'multiple_choice' && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = currentAnswer && currentAnswer.answer === index;
                        const isCorrect = index === currentQuestion.correctAnswer;
                        
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              isCorrect
                                ? 'bg-green-50 border-green-300'
                                : isSelected && !isCorrect
                                ? 'bg-red-50 border-red-300'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                                isCorrect
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-500 border-red-500 text-white'
                                  : 'border-gray-300'
                              }`}>
                                {isCorrect && '✓'}
                                {isSelected && !isCorrect && '✗'}
                              </div>
                              <span className={`font-medium ${
                                isCorrect ? 'text-green-800' : 
                                isSelected && !isCorrect ? 'text-red-800' : 
                                'text-gray-700'
                              }`}>
                                {option}
                              </span>
                              {isCorrect && (
                                <span className="ml-auto text-green-600 text-sm font-semibold">
                                  Jawaban Benar
                                </span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="ml-auto text-red-600 text-sm font-semibold">
                                  Jawaban Anda
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {currentQuestion.questionType === 'true_false' && (
                    <div className="space-y-3">
                      {['Benar', 'Salah'].map((option, index) => {
                        const isSelected = currentAnswer && currentAnswer.answer === index;
                        const isCorrect = index === currentQuestion.correctAnswer;
                        
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              isCorrect
                                ? 'bg-green-50 border-green-300'
                                : isSelected && !isCorrect
                                ? 'bg-red-50 border-red-300'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                                isCorrect
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-500 border-red-500 text-white'
                                  : 'border-gray-300'
                              }`}>
                                {isCorrect && '✓'}
                                {isSelected && !isCorrect && '✗'}
                              </div>
                              <span className={`font-medium ${
                                isCorrect ? 'text-green-800' : 
                                isSelected && !isCorrect ? 'text-red-800' : 
                                'text-gray-700'
                              }`}>
                                {option}
                              </span>
                              {isCorrect && (
                                <span className="ml-auto text-green-600 text-sm font-semibold">
                                  Jawaban Benar
                                </span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="ml-auto text-red-600 text-sm font-semibold">
                                  Jawaban Anda
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {currentQuestion.questionType === 'essay' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Jawaban Anda:</h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-800 whitespace-pre-wrap">
                            {currentAnswer?.answer || 'Tidak ada jawaban'}
                          </p>
                        </div>
                      </div>
                      
                      {currentQuestion.correctAnswer && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Jawaban Contoh:</h4>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 whitespace-pre-wrap">
                              {currentQuestion.correctAnswer}
                            </p>
                          </div>
                        </div>
                      )}

                      {currentQuestion.explanation && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Penjelasan:</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800">{currentQuestion.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Sebelumnya
                  </button>
                  
                  <span className="text-gray-600 font-medium">
                    {currentQuestionIndex + 1} / {exam.questions.length}
                  </span>
                  
                  <button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === exam.questions.length - 1}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>

            {/* Question Points */}
            <div className="mt-4 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">Poin Soal</h4>
                  <p className="text-gray-600 text-sm">
                    Soal ini bernilai {currentQuestion.points || 1} poin
                  </p>
                </div>
                <div className={`text-lg font-bold ${
                  currentAnswer?.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentAnswer?.isCorrect ? `+${currentQuestion.points || 1}` : '+0'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewExamPage;