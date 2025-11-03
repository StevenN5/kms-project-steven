// frontend/src/components/exam/ExamCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { formatExamDate, canTakeExam } from '../../utils/examUtils';

const ExamCard = ({ exam, userAttempts = [] }) => {
  const { canTake, reason } = canTakeExam(exam);
  const userAttempt = userAttempts.find(attempt => attempt.exam._id === exam._id);
  const attemptsLeft = exam.maxAttempts - userAttempts.filter(a => a.exam._id === exam._id).length;

  const getCardStatus = () => {
    if (userAttempt && userAttempt.status === 'completed') {
      return {
        status: 'SELESAI',
        color: 'bg-green-100 border-green-500',
        textColor: 'text-green-700'
      };
    }
    
    if (userAttempt && userAttempt.status === 'in_progress') {
      return {
        status: 'DILANJUTKAN',
        color: 'bg-blue-100 border-blue-500',
        textColor: 'text-blue-700'
      };
    }
    
    if (!canTake) {
      return {
        status: reason,
        color: 'bg-gray-100 border-gray-400',
        textColor: 'text-gray-600'
      };
    }
    
    return {
      status: 'MULAI UJIAN',
      color: 'bg-white border-green-500',
      textColor: 'text-green-700'
    };
  };

  const cardStatus = getCardStatus();

  return (
    <div className={`border-2 rounded-lg p-6 ${cardStatus.color} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{exam.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${cardStatus.textColor} border`}>
          {cardStatus.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{exam.description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
        <div>
          <span className="font-semibold">Durasi:</span> {exam.duration} menit
        </div>
        <div>
          <span className="font-semibold">Jumlah Soal:</span> {exam.totalQuestions}
        </div>
        <div>
          <span className="font-semibold">Nilai Kelulusan:</span> {exam.passingGrade}%
        </div>
        <div>
          <span className="font-semibold">Sisa Attempt:</span> {attemptsLeft}/{exam.maxAttempts}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-4">
        <div><strong>Mulai:</strong> {formatExamDate(exam.startTime)}</div>
        <div><strong>Selesai:</strong> {formatExamDate(exam.endTime)}</div>
      </div>

      <div className="flex justify-between items-center">
        {userAttempt && userAttempt.status === 'completed' ? (
          <Link
            to={`/exams/results/${userAttempt._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lihat Hasil
          </Link>
        ) : userAttempt && userAttempt.status === 'in_progress' ? (
          <Link
            to={`/exams/take/${exam._id}`}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Lanjutkan Ujian
          </Link>
        ) : canTake ? (
          <Link
            to={`/exams/take/${exam._id}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Mulai Ujian
          </Link>
        ) : (
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          >
            {reason}
          </button>
        )}
        
        {userAttempt && userAttempt.score !== undefined && (
          <div className={`text-lg font-bold ${
            userAttempt.score >= exam.passingGrade ? 'text-green-600' : 'text-red-600'
          }`}>
            {userAttempt.score.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamCard;