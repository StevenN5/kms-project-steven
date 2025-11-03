import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam } from '../contexts/ExamContext';

const TakeExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useExam();
  
  const { exams, currentExam, userAnswers, timeLeft } = state;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate progress - FIXED: Safe check for currentExam and questions
  const calculateProgress = () => {
    if (!currentExam || !currentExam.questions || currentExam.questions.length === 0) return 0;
    const totalQuestions = currentExam.questions.length;
    const answeredQuestions = Object.keys(userAnswers).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  // Move handleSubmitExam inside useCallback to make it stable
  const handleSubmitExam = useCallback(async () => {
    if (isSubmitting || !currentExam) return;
    
    setIsSubmitting(true);
    try {
      // Calculate score
      let score = 0;
      let totalQuestions = 0;
      
      if (currentExam.questions) {
        totalQuestions = currentExam.questions.length;
        currentExam.questions.forEach((question) => {
          const questionId = question.id || question._id;
          if (userAnswers[questionId] === question.correctAnswer) {
            score++;
          }
        });
      }

      const result = {
        examId: id,
        examTitle: currentExam.title || 'Unknown Exam',
        score: score,
        totalQuestions: totalQuestions,
        percentage: totalQuestions > 0 ? (score / totalQuestions) * 100 : 0,
        answers: userAnswers,
        timestamp: new Date().toISOString(),
        timeSpent: (currentExam.duration * 60) - timeLeft
      };

      // Save result to context
      dispatch({ type: 'SET_RESULTS', payload: [...state.results, result] });
      
      // Navigate to results page
      navigate(`/exams/results/${id}`, { state: { result } });
    } catch (error) {
      console.error('Error submitting exam:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit exam' });
      alert('Error submitting exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentExam, isSubmitting, userAnswers, timeLeft, id, dispatch, state.results, navigate]);

  // Initialize exam
  useEffect(() => {
    const initializeExam = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // If exams are already loaded, find the exam
        if (exams && exams.length > 0) {
          const exam = exams.find(exam => exam.id === id || exam._id === id);
          if (exam) {
            dispatch({ type: 'SET_CURRENT_EXAM', payload: exam });
            dispatch({ type: 'SET_TIME_LEFT', payload: exam.duration * 60 }); // Convert minutes to seconds
            
            // Initialize empty answers object
            const initialAnswers = {};
            if (exam.questions && exam.questions.length > 0) {
              exam.questions.forEach((question, index) => {
                initialAnswers[question.id || index] = '';
              });
            }
            dispatch({ type: 'SET_ANSWERS', payload: initialAnswers });
          } else {
            navigate('/exams', { state: { error: 'Exam not found' } });
          }
        } else {
          // If exams are not loaded, you might want to fetch them here
          console.log('No exams found, might need to fetch from API');
          navigate('/exams', { state: { error: 'Exams not loaded' } });
        }
      } catch (error) {
        console.error('Error initializing exam:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load exam' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeExam();
  }, [id, exams, dispatch, navigate]);

  // Timer effect - FIXED: Added handleSubmitExam to dependencies
  useEffect(() => {
    if (timeLeft > 0 && currentExam) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_TIME_LEFT', payload: timeLeft - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentExam) {
      handleSubmitExam();
    }
  }, [timeLeft, currentExam, dispatch, handleSubmitExam]);

  const handleAnswerSelect = (questionId, answer) => {
    dispatch({
      type: 'UPDATE_ANSWER',
      payload: {
        questionId: questionId,
        answer: answer
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentExam && currentExam.questions && currentQuestionIndex < currentExam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">Error</div>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={() => navigate('/exams')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  // Safe check for current exam
  if (!currentExam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">Exam Not Found</div>
          <p className="text-gray-600 mb-4">The requested exam could not be loaded.</p>
          <button
            onClick={() => navigate('/exams')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  // Safe check for questions
  if (!currentExam.questions || currentExam.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">No Questions Available</div>
          <p className="text-gray-600 mb-4">This exam doesn't have any questions yet.</p>
          <button
            onClick={() => navigate('/exams')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = currentExam.questions[currentQuestionIndex];
  const questionId = currentQuestion.id || currentQuestionIndex;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentExam.title}</h1>
              <p className="text-gray-600">{currentExam.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-red-600 mb-2">
                Time Left: {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {currentExam.questions.length} questions
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Progress: {Math.round(calculateProgress())}% ({Object.keys(userAnswers).length}/{currentExam.questions.length} answered)
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Question {currentQuestionIndex + 1}
            </h2>
            <p className="text-gray-700 text-lg mb-6">{currentQuestion.question}</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options && currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition duration-200 ${
                  userAnswers[questionId] === option
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-300 hover:border-cyan-400'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${questionId}`}
                  value={option}
                  checked={userAnswers[questionId] === option}
                  onChange={() => handleAnswerSelect(questionId, option)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg transition duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {currentQuestionIndex === currentExam.questions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200 disabled:bg-green-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Next Question
            </button>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Question Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {currentExam.questions.map((question, index) => {
              const qId = question.id || index;
              const isAnswered = userAnswers[qId] && userAnswers[qId] !== '';
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition duration-200 ${
                    index === currentQuestionIndex
                      ? 'bg-cyan-600 text-white'
                      : isAnswered
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExamPage;