// frontend/src/utils/examUtils.js

// Format waktu dari detik ke MM:SS
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Hitung progress pengerjaan
export const calculateProgress = (questions, answers) => {
  const answered = Object.keys(answers).length;
  const total = questions.length;
  return {
    answered,
    total,
    percentage: total > 0 ? Math.round((answered / total) * 100) : 0
  };
};

// Validasi apakah exam bisa diakses
export const canTakeExam = (exam) => {
  const now = new Date();
  const startTime = new Date(exam.startTime);
  const endTime = new Date(exam.endTime);
  
  if (now < startTime) {
    return { canTake: false, reason: 'Ujian belum dimulai' };
  }
  
  if (now > endTime) {
    return { canTake: false, reason: 'Ujian sudah berakhir' };
  }
  
  if (!exam.isActive) {
    return { canTake: false, reason: 'Ujian tidak aktif' };
  }
  
  return { canTake: true };
};

// Format tanggal untuk display
export const formatExamDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Determine result status
export const getResultStatus = (score, passingGrade) => {
  if (score >= passingGrade) {
    return { status: 'LULUS', color: 'green', textColor: 'text-green-600' };
  } else {
    return { status: 'TIDAK LULUS', color: 'red', textColor: 'text-red-600' };
  }
};
// Tambahkan di file utils/examUtils.js
export const formatTimeSpent = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} menit ${remainingSeconds} detik`;
};