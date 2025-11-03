import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RepositoryPage from './pages/RepositoryPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UploadPage from './pages/UploadPage';
import { ExamProvider } from './contexts/ExamContext';
import ExamListPage from './pages/ExamListPage';
import TakeExamPage from './pages/TakeExamPage';
import ReviewExamPage from './pages/ReviewExamPage';
import CreateExamPage from './pages/CreateExamPage';
import ExamResultsPage from './pages/ExamResultsPage';
import ErrorBoundary from './components/ErrorBoundary';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import Chatbot from './components/Chatbot';

// Component untuk protected routes
const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Please login to access this page' 
        } 
      });
    }
  }, [userInfo, navigate, location]);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return children;
};

// Component untuk admin-only routes
const AdminRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Please login to access this page' 
        } 
      });
    } else if (userInfo.role !== 'admin') {
      navigate('/', { 
        state: { 
          error: 'Access denied. Admin privileges required.' 
        } 
      });
    }
  }, [userInfo, navigate, location]);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (userInfo.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">Access Denied</div>
          <p className="text-gray-600">Admin privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

// Komponen Layout dengan conditional Navbar
const AppLayout = () => {
  const location = useLocation();
  const userInfo = localStorage.getItem('userInfo');
  
  // Routes yang hanya menampilkan limited navbar (login/register)
  const limitedNavbarRoutes = ['/login', '/register'];
  
  // Cek apakah route saat ini termasuk yang butuh navbar terbatas
  const showLimitedNavbar = limitedNavbarRoutes.includes(location.pathname);
  
  // Cek apakah user sudah login untuk chatbot (jangan tampilkan di login/register)
  const showChatbot = userInfo && !limitedNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditional Navbar */}
      <Navbar limited={showLimitedNavbar} />
      
      <main className="flex-1 w-full">
        <Routes>
          {/* Public Routes - bisa diakses semua orang */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes - hanya untuk user yang login */}
          <Route 
            path="/repository" 
            element={
              <ProtectedRoute>
                <RepositoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documents/:id" 
            element={
              <ProtectedRoute>
                <DocumentDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exams" 
            element={
              <ProtectedRoute>
                <ExamListPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exams/take/:id" 
            element={
              <ProtectedRoute>
                <TakeExamPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exams/review/:id" 
            element={
              <ProtectedRoute>
                <ReviewExamPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exams/results/:id" 
            element={
              <ProtectedRoute>
                <ExamResultsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Only Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="/exams/create" 
            element={
              <AdminRoute>
                <CreateExamPage />
              </AdminRoute>
            } 
          />
        </Routes>
      </main>
      
      {/* Conditional Chatbot - hanya untuk user login dan bukan di auth pages */}
      {showChatbot && <Chatbot />}
    </div>
  );
};

// App component utama
function App() {
  return (
    <ErrorBoundary>
      <ExamProvider>
        <Router>
          <AppLayout />
        </Router>
      </ExamProvider>
    </ErrorBoundary>
  );
}

export default App;