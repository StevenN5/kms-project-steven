import { useState, useCallback } from 'react';
import api from '../api/axios'; // <-- 1. Menggunakan instance Axios yang benar

/**
 * Hook kustom untuk semua logika terkait ujian.
 * Menggantikan 'fetch' dengan 'api' (axios) untuk
 * menangani token autentikasi secara otomatis.
 */
export const useExamActions = () => {
  const [state, setState] = useState({
    exams: [],
    currentExam: null,
    currentAttempt: null,
    answers: {},
    timeLeft: 0,
    loading: false,
    error: null,
    results: []
  });

  // Dispatcher untuk mengelola state internal
  const dispatch = (action) => {
    switch (action.type) {
      case 'SET_LOADING':
        setState(prev => ({ ...prev, loading: action.payload }));
        break;
      case 'SET_EXAMS':
        setState(prev => ({ ...prev, exams: action.payload }));
        break;
      case 'SET_CURRENT_EXAM':
        setState(prev => ({ ...prev, currentExam: action.payload }));
        break;
      case 'SET_CURRENT_ATTEMPT':
        setState(prev => ({ ...prev, currentAttempt: action.payload }));
        break;
      case 'SET_ANSWERS':
        setState(prev => ({ ...prev, answers: action.payload }));
        break;
      case 'UPDATE_ANSWER':
        setState(prev => ({
          ...prev,
          answers: {
            ...prev.answers,
            [action.payload.questionId]: action.payload.answer
          }
        }));
        break;
      case 'SET_TIME_LEFT':
        setState(prev => ({ ...prev, timeLeft: action.payload }));
        break;
      case 'SET_RESULTS':
        setState(prev => ({ ...prev, results: action.payload }));
        break;
      case 'SET_ERROR':
        setState(prev => ({ ...prev, error: action.payload }));
        break;
      default:
        break;
    }
  };

  // --- SEMUA FUNGSI API DIUBAH MENGGUNAKAN 'api' (axios) ---

  const fetchExams = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // 'api.get' akan otomatis mengirim token
      const { data } = await api.get('/exams'); 
      const examsArray = data.data || data || [];
      dispatch({ type: 'SET_EXAMS', payload: examsArray });
      return examsArray;
    } catch (error) {
      console.error('❌ Error fetching exams:', error);
      const errorMsg = error.response?.data?.message || 'Gagal mengambil data ujian';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      throw new Error(errorMsg);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchExam = useCallback(async (examId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await api.get(`/exams/${examId}`);
      dispatch({ type: 'SET_CURRENT_EXAM', payload: data.data });
      return data.data;
    } catch (error) {
      console.error('Error fetching exam:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const startExamAttempt = useCallback(async (examId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await api.post(`/exams/${examId}/start`);
      // Simpan data ujian dan attempt dari respons
      dispatch({ type: 'SET_CURRENT_EXAM', payload: data.data.exam || state.currentExam }); 
      dispatch({ type: 'SET_CURRENT_ATTEMPT', payload: data.data });
      dispatch({ type: 'SET_ANSWERS', payload: {} });
      // Gunakan timeLeft dari server, atau durasi ujian sebagai fallback
      const durationInSeconds = (data.data.exam?.duration || state.currentExam?.duration || 0) * 60;
      dispatch({ type: 'SET_TIME_LEFT', payload: data.data.timeLeft || durationInSeconds });
      return data.data;
    } catch (error) {
      console.error('Error starting exam:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentExam]); // Tambahkan dependensi

  const submitExamAnswers = useCallback(async (attemptId, answers) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Periksa apakah currentExam ada di state
    if (!state.currentExam || !state.currentExam._id) {
        const errorMsg = 'Tidak ada ujian aktif untuk disubmit.';
        console.error(errorMsg);
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        throw new Error(errorMsg);
    }
    
    try {
      // FIX: Rute API yang benar adalah /exams/:examId/submit
      const examId = state.currentExam._id;
      const { data } = await api.post(`/exams/${examId}/submit`, { attemptId, answers }); 
      dispatch({ type: 'SET_CURRENT_ATTEMPT', payload: data.data });
      return data.data;
    } catch (error) {
      console.error('Error submitting exam:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentExam]); // Tambahkan currentExam sebagai dependensi

  const fetchUserResults = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await api.get('/exams/results');
      const resultsArray = data.data || data || [];
      dispatch({ type: 'SET_RESULTS', payload: resultsArray });
      return resultsArray;
    } catch (error) {
      console.error('Error fetching results:', error);
      dispatch({ type: 'SET_RESULTS', payload: [] });
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);
  
  // Fungsi ini untuk halaman Review dan Result
  const fetchAttemptById = useCallback(async (attemptId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await api.get(`/exams/attempts/${attemptId}`);
      dispatch({ type: 'SET_CURRENT_ATTEMPT', payload: data.data });
      dispatch({ type: 'SET_CURRENT_EXAM', payload: data.data.exam });
      return data.data;
    } catch (error) {
      console.error('Error fetching attempt:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);


  // --- Fungsi Utilitas ---
  
  const updateTimeLeft = useCallback((timeLeft) => {
    dispatch({ type: 'SET_TIME_LEFT', payload: timeLeft });
  }, []);

  const clearCurrentExam = useCallback(() => {
    dispatch({ type: 'SET_CURRENT_EXAM', payload: null });
    dispatch({ type: 'SET_CURRENT_ATTEMPT', payload: null });
    dispatch({ type: 'SET_ANSWERS', payload: {} });
    dispatch({ type: 'SET_TIME_LEFT', payload: 0 });
  }, []);

  const updateAnswer = useCallback((questionId, answer) => {
    dispatch({ type: 'UPDATE_ANSWER', payload: { questionId, answer } });
  }, []);

  return {
    ...state,
    apiLoading: state.loading,
    fetchExams,
    fetchExam,
    startExamAttempt,
    submitExamAnswers,
    fetchUserResults,
    fetchAttemptById, // <-- Fungsi ini untuk ReviewPage & ResultsPage
    updateTimeLeft,
    clearCurrentExam,
    updateAnswer
  };
};