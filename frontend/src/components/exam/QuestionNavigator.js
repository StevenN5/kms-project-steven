// frontend/src/components/exam/QuestionNavigator.js
import React from 'react';
import { calculateProgress } from '../../utils/examUtils';

const QuestionNavigator = ({ 
  questions, 
  currentQuestionIndex, 
  userAnswers, 
  onQuestionSelect,
  isReview = false 
}) => {
  const { answered, total, percentage } = calculateProgress(questions, userAnswers);

  const getQuestionStatus = (question, index) => {
    if (isReview) {
      const userAnswer = userAnswers[question._id];
      const isCorrect = userAnswer === question.correctAnswer;
      return isCorrect ? 'correct' : 'incorrect';
    }
    
    return userAnswers[question._id] !== undefined ? 'answered' : 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-blue-500 border-blue-600';
      case 'correct':
        return 'bg-green-500 border-green-600';
      case 'incorrect':
        return 'bg-red-500 border-red-600';
      default:
        return 'bg-gray-300 border-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {answered}/{total} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <button
              key={question._id}
              onClick={() => onQuestionSelect(index)}
              className={`
                w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium
                ${getStatusColor(status)}
                ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                text-white transition-all hover:scale-105
              `}
              title={`Soal ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {!isReview ? (
          <>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
              <span>Terjawab</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>
              <span>Belum dijawab</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              <span>Benar</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
              <span>Salah</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>
              <span>Tidak dijawab</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionNavigator;