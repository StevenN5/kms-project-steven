import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResultStatus } from '../utils/examUtils';

const ExamResultsPage = () => {
  const { id: attemptId } = useParams();
  const navigate = useNavigate();
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

  const { exam, score, timeSpent, submittedAt, answers } = examResult;
  const resultStatus = getResultStatus(score, exam.passingGrade);
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const wrongAnswers = answers.filter(a => !a.isCorrect).length;
  const unanswered = exam.questions.length - answers.length;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} menit ${remainingSeconds} detik`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Hasil Ujian</h1>
            <p className="text-xl opacity-90">{exam.title}</p>
          </div>

          {/* Main Result */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className={`text-6xl font-bold ${resultStatus.textColor} mb-4`}>
                {score.toFixed(1)}%
              </div>
              <div className={`text-2xl font-semibold px-6 py-3 rounded-full inline-block ${
                resultStatus.status === 'LULUS' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {resultStatus.status}
              </div>
              <p className="text-gray-600 mt-2">
                Nilai Kelulusan: {exam.passingGrade}%
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {correctAnswers}
                </div>
                <div className="text-green-800 font-semibold">Jawaban Benar</div>
                <div className="text-green-600 text-sm mt-1">
                  {((correctAnswers / exam.questions.length) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {wrongAnswers}
                </div>
                <div className="text-red-800 font-semibold">Jawaban Salah</div>
                <div className="text-red-600 text-sm mt-1">
                  {((wrongAnswers / exam.questions.length) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {unanswered}
                </div>
                <div className="text-gray-800 font-semibold">Tidak Dijawab</div>
                <div className="text-gray-600 text-sm mt-1">
                  {((unanswered / exam.questions.length) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Exam Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Detail Ujian</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Soal:</span>
                  <span className="font-semibold">{exam.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durasi Ujian:</span>
                  <span className="font-semibold">{exam.duration} menit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waktu Digunakan:</span>
                  <span className="font-semibold">{formatTime(timeSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waktu Selesai:</span>
                  <span className="font-semibold">{new Date(submittedAt).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Ringkasan Performa</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Skor yang diperoleh:</span>
                  <span className="font-semibold text-blue-800">{score.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Status Kelulusan:</span>
                  <span className={`font-semibold ${
                    resultStatus.status === 'LULUS' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {resultStatus.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Akurasi Jawaban:</span>
                  <span className="font-semibold text-blue-800">
                    {answers.length > 0 ? ((correctAnswers / answers.length) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to={`/exams/review/${attemptId}`}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
              >
                📝 Review Jawaban Detail
              </Link>
              <Link
                to="/exams"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center font-semibold"
              >
                📋 Kembali ke Daftar Ujian
              </Link>
              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                🖨️ Cetak Sertifikat
              </button>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-8">
          {resultStatus.status === 'LULUS' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-green-600 text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Selamat!</h3>
              <p className="text-green-700">
                Anda telah berhasil menyelesaikan ujian dengan baik. Pertahankan prestasi ini!
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="text-orange-600 text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Terus Berusaha!</h3>
              <p className="text-orange-700">
                Jangan menyerah! Pelajari materi kembali dan coba lagi. Anda pasti bisa!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResultsPage;