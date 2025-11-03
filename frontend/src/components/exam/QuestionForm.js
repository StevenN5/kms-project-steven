// frontend/src/components/exam/QuestionForm.js
import React from 'react';

const QuestionForm = ({ 
  question, 
  currentAnswer, 
  onAnswerChange, 
  questionNumber,
  isReview = false,
  correctAnswer 
}) => {
  const handleAnswerChange = (answer) => {
    if (!isReview) {
      onAnswerChange(question._id, answer);
    }
  };

  const getOptionStyle = (optionIndex) => {
    if (!isReview) {
      return currentAnswer === optionIndex 
        ? "bg-blue-100 border-blue-500" 
        : "bg-white border-gray-300";
    }
    
    // Review mode styles
    if (optionIndex === correctAnswer) {
      return "bg-green-100 border-green-500";
    }
    if (optionIndex === currentAnswer && currentAnswer !== correctAnswer) {
      return "bg-red-100 border-red-500";
    }
    return "bg-white border-gray-300";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Soal #{questionNumber}
        </h3>
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
          {question.points || 1} Poin
        </span>
      </div>
      
      <p className="text-gray-700 mb-6 text-lg">{question.questionText}</p>
      
      <div className="space-y-3">
        {question.options && question.options.map((option, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${getOptionStyle(index)} ${
              !isReview ? 'hover:bg-gray-50' : ''
            }`}
            onClick={() => handleAnswerChange(index)}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                currentAnswer === index 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-400'
              }`}>
                {currentAnswer === index && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-gray-800">{option}</span>
              
              {isReview && (
                <div className="ml-auto">
                  {index === correctAnswer && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      Jawaban Benar
                    </span>
                  )}
                  {index === currentAnswer && currentAnswer !== correctAnswer && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Jawaban Anda
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {isReview && question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Penjelasan:</h4>
          <p className="text-blue-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;