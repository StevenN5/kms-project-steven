import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useExamActions } from '../hooks/useExam';

const ExamsSection = () => {
    const { exams, loading, results, fetchExams, fetchUserResults } = useExamActions();
    const [activeTab, setActiveTab] = useState('available');

    const getUserInfo = () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo && userInfo !== 'undefined' ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Error parsing userInfo:', error);
            return null;
        }
    };

    const userInfo = getUserInfo();

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchExams();
                await fetchUserResults();
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, [fetchExams, fetchUserResults]);

    // Process available exams - handle different data formats
    const availableExams = Array.isArray(exams) ? exams.filter(exam => {
        if (!exam || typeof exam !== 'object') return false;
        const now = new Date();
        const startTime = exam.startTime ? new Date(exam.startTime) : new Date(0);
        const endTime = exam.endTime ? new Date(exam.endTime) : new Date(0);
        
        return exam.isActive !== false && now >= startTime && now <= endTime;
    }) : [];

    // Process user's exams from results
    const myExams = Array.isArray(results) ? results.filter(attempt => 
        attempt && attempt.exam
    ).map(attempt => attempt.exam) : [];

    const calculateStats = () => {
        const totalExams = Array.isArray(exams) ? exams.length : 0;
        const completedExams = Array.isArray(results) ? results.filter(attempt => 
            attempt.status === 'completed'
        ).length : 0;
        
        const inProgressExams = Array.isArray(results) ? results.filter(attempt => 
            attempt.status === 'in_progress'
        ).length : 0;

        const averageScore = Array.isArray(results) && results.length > 0 
            ? Math.round(results.reduce((acc, attempt) => acc + (attempt.score || 0), 0) / results.length)
            : 0;

        return {
            totalExams,
            completedExams,
            inProgressExams,
            averageScore
        };
    };

    const stats = calculateStats();

    const formatDuration = (minutes) => {
        if (!minutes) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Ujian & Assessment</h2>
                        <p className="text-gray-600 mt-1">Test your knowledge with our exams</p>
                    </div>
                    {userInfo?.role === 'admin' && (
                        <Link
                            to="/exams/create"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                        >
                            Buat Ujian Baru
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="border-b border-gray-200 p-6 bg-gray-50">
                <div className="exam-stats grid grid-cols-4 gap-4">
                    <div className="stat-card bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-semibold text-blue-800">Total Ujian</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalExams}</p>
                    </div>
                    <div className="stat-card bg-green-50 p-4 rounded-lg border border-green-100">
                        <h3 className="text-lg font-semibold text-green-800">Selesai</h3>
                        <p className="text-2xl font-bold text-green-600">{stats.completedExams}</p>
                    </div>
                    <div className="stat-card bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <h3 className="text-lg font-semibold text-yellow-800">Dalam Proses</h3>
                        <p className="text-2xl font-bold text-yellow-600">{stats.inProgressExams}</p>
                    </div>
                    <div className="stat-card bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h3 className="text-lg font-semibold text-purple-800">Rata-rata Nilai</h3>
                        <p className="text-2xl font-bold text-purple-600">{stats.averageScore}%</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'available'
                                ? 'border-cyan-500 text-cyan-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Ujian Tersedia ({availableExams.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('myexams')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'myexams'
                                ? 'border-cyan-500 text-cyan-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Ujian Saya ({myExams.length})
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'available' && (
                    <div>
                        {availableExams.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">Tidak ada ujian yang tersedia saat ini.</p>
                                <p className="text-gray-400 text-sm mt-2">Total exams in system: {stats.totalExams}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {availableExams.map((exam) => (
                                    <div key={exam._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-gray-800 text-lg">{exam.title}</h3>
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                {exam.questions ? exam.questions.length : 0} Soal
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {exam.description || 'Tidak ada deskripsi'}
                                        </p>

                                        <div className="space-y-2 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Durasi: {formatDuration(exam.duration)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Nilai Kelulusan: {exam.passingGrade}%</span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/exams/take/${exam._id}`}
                                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-center block"
                                        >
                                            Mulai Ujian
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'myexams' && (
                    <div>
                        {myExams.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">Anda belum mengikuti ujian apapun.</p>
                                <Link
                                    to="/repository?tab=exams"
                                    className="inline-block mt-3 text-cyan-600 hover:text-cyan-700 font-medium"
                                >
                                    Lihat Ujian Tersedia
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {results.map((attempt) => (
                                    <div key={attempt._id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-800 text-lg">{attempt.exam?.title || 'Unknown Exam'}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                attempt.status === 'completed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {attempt.status === 'completed' ? 'Selesai' : 'Dalam Proses'}
                                            </span>
                                        </div>
                                        
                                        <div className="border border-gray-200 rounded-lg p-4 mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Attempt
                                                </span>
                                                <span className={`text-sm font-semibold ${
                                                    attempt.score >= (attempt.exam?.passingGrade || 70) 
                                                        ? 'text-green-600' 
                                                        : 'text-red-600'
                                                }`}>
                                                    {typeof attempt.score === 'number' ? attempt.score.toFixed(1) : '0'}%
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 space-y-1">
                                                <div>Completed: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : 'In Progress'}</div>
                                                <div className={`font-medium ${
                                                    attempt.score >= (attempt.exam?.passingGrade || 70) 
                                                        ? 'text-green-600' 
                                                        : 'text-red-600'
                                                }`}>
                                                    {attempt.score >= (attempt.exam?.passingGrade || 70) ? 'LULUS' : 'TIDAK LULUS'}
                                                </div>
                                            </div>
                                            
                                            {/* PERBAIKAN: Link Review Jawaban yang Benar */}
                                            {attempt.status === 'completed' && (
                                                <Link
                                                    to={`/exams/review/${attempt._id}`}
                                                    className="w-full mt-3 text-cyan-600 hover:text-cyan-700 text-sm font-medium text-center block"
                                                >
                                                    Review Jawaban
                                                </Link>
                                            )}
                                        </div>

                                        <div className="flex space-x-3">
                                            <Link
                                                to={`/exams/take/${attempt.exam?._id}`}
                                                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                            >
                                                {attempt.status === 'completed' ? 'Retake Exam' : 'Lanjutkan Exam'}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamsSection;