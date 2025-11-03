// frontend/src/contexts/ExamContext.js
import React, { createContext, useContext, useReducer } from 'react';

const ExamContext = createContext();

const examReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EXAMS':
      return { ...state, exams: action.payload };
    case 'SET_CURRENT_EXAM':
      return { ...state, currentExam: action.payload };
    case 'SET_CURRENT_ATTEMPT':
      return { ...state, currentAttempt: action.payload };
    case 'SET_ANSWERS':
      return { ...state, userAnswers: action.payload };
    case 'UPDATE_ANSWER':
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.payload.questionId]: action.payload.answer
        }
      };
    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  exams: [],
  currentExam: null,
  currentAttempt: null,
  userAnswers: {},
  timeLeft: 0,
  results: [],
  loading: false,
  error: null
};

export const ExamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(examReducer, initialState);

  return (
    <ExamContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};