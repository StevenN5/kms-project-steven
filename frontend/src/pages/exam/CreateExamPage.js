// frontend/src/pages/exams/CreateExamPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateExamPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    passingGrade: 70,
    startTime: '',
    endTime: '',
    maxAttempts: 1,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'multiple_choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  });

  const handleExamDataChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      alert('Pertanyaan tidak boleh kosong');
      return;
    }

    if (currentQuestion.questionType === 'multiple_choice' && 
        currentQuestion.options.some(opt => !opt.trim())) {
      alert('Semua opsi jawaban harus diisi');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString() // Temporary ID
    };

    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    // Reset form for next question
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    });
  };

  const removeQuestion = (index) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const submitExam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/exams', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(examData)
      });

      // Di CreateExamPage.js - pastikan format questions seperti ini:
const questionData = {
  questionText: "Pertanyaan disini",
  questionType: "multiple_choice", 
  options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
  correctAnswer: 0, // Index of correct option
  points: 1
};
      if (!response.ok) throw new Error('Failed to create exam');

      const result = await response.json();
      alert('Ujian berhasil dibuat!');
      navigate('/exams');
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Gagal membuat ujian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!examData.title.trim()) {
        alert('Judul ujian harus diisi');
        return;
      }
      if (!examData.startTime || !examData.endTime) {
        alert('Waktu mulai dan selesai harus diisi');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Buat Ujian Baru</h1>
          <p className="text-gray-600 mb-6">Buat ujian untuk mengetes pengetahuan karyawan</p>

          {/* Step Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-24 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Informasi Dasar</span>
              <span>Buat Soal</span>
              <span>Review</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Informasi Ujian</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Ujian *
                </label>
                <input
                  type="text"
                  value={examData.title}
                  onChange={(e) => handleExamDataChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Knowledge Assessment Q1 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={examData.description}
                  onChange={(e) => handleExamDataChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi singkat tentang ujian ini..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durasi (menit) *
                  </label>
                  <input
                    type="number"
                    value={examData.duration}
                    onChange={(e) => handleExamDataChange('duration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai Kelulusan (%) *
                  </label>
                  <input
                    type="number"
                    value={examData.passingGrade}
                    onChange={(e) => handleExamDataChange('passingGrade', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Mulai *
                  </label>
                  <input
                    type="datetime-local"
                    value={examData.startTime}
                    onChange={(e) => handleExamDataChange('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Selesai *
                  </label>
                  <input
                    type="datetime-local"
                    value={examData.endTime}
                    onChange={(e) => handleExamDataChange('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Attempt
                </label>
                <input
                  type="number"
                  value={examData.maxAttempts}
                  onChange={(e) => handleExamDataChange('maxAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
          )}

          {/* Step 2: Create Questions */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Buat Soal</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-4">Soal Baru</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pertanyaan *
                  </label>
                  <textarea
                    value={currentQuestion.questionText}
                    onChange={(e) => handleQuestionChange('questionText', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tulis pertanyaan di sini..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Soal
                  </label>
                  <select
                    value={currentQuestion.questionType}
                    onChange={(e) => handleQuestionChange('questionType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="multiple_choice">Pilihan Ganda</option>
                    <option value="true_false">Benar/Salah</option>
                  </select>
                </div>

                {currentQuestion.questionType === 'multiple_choice' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Opsi Jawaban *
                    </label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => handleQuestionChange('correctAnswer', index)}
                          className="text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Opsi ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poin
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <button
                  onClick={addQuestion}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Tambah Soal
                </button>
              </div>

              {/* List of Added Questions */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4">
                  Soal yang Sudah Ditambahkan ({examData.questions.length})
                </h3>
                {examData.questions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Belum ada soal yang ditambahkan
                  </p>
                ) : (
                  <div className="space-y-3">
                    {examData.questions.map((question, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {index + 1}. {question.questionText}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Tipe: {question.questionType === 'multiple_choice' ? 'Pilihan Ganda' : 'Benar/Salah'} | 
                              Poin: {question.points} | 
                              Jawaban Benar: {question.correctAnswer + 1}
                            </p>
                          </div>
                          <button
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Review Ujian</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-4">Informasi Ujian</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Judul:</strong> {examData.title}</div>
                  <div><strong>Durasi:</strong> {examData.duration} menit</div>
                  <div><strong>Nilai Kelulusan:</strong> {examData.passingGrade}%</div>
                  <div><strong>Maks Attempt:</strong> {examData.maxAttempts}</div>
                  <div><strong>Jumlah Soal:</strong> {examData.questions.length}</div>
                  <div><strong>Total Poin:</strong> {examData.questions.reduce((sum, q) => sum + q.points, 0)}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Daftar Soal</h3>
                {examData.questions.map((question, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      {index + 1}. {question.questionText}
                    </h4>
                    {question.questionType === 'multiple_choice' && (
                      <div className="space-y-1 ml-4">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className={`text-sm ${
                            optIndex === question.correctAnswer ? 'text-green-600 font-semibold' : 'text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Poin: {question.points} | Tipe: {question.questionType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sebelumnya
              </button>
            ) : (
              <button
                onClick={() => navigate('/exams')}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={submitExam}
                disabled={loading || examData.questions.length === 0}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Membuat...' : 'Buat Ujian'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExamPage;