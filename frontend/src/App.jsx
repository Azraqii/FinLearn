import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Article from './pages/Article'
import Quiz from './pages/Quiz'
import QuizPlay from './pages/QuizPlay'
import QuizResult from './pages/QuizResult'
import Calculator from './pages/Calculator'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Register from './pages/Register'
import PendingApproval from './pages/PendingApproval'
import StudentDashboard from './pages/StudentDashboard'
import MentorDashboard from './pages/MentorDashboard'
import AdminDashboard from './pages/AdminDashboard'

function DashboardRedirect() {
  const { dashboardPath } = useAuth()
  return <Navigate to={dashboardPath} replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-fin-mist text-fin-ink">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:topic" element={<Article />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:topic/result" element={<QuizResult />} />
            <Route path="/quiz/:topic" element={<QuizPlay />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/student/dashboard"
              element={(
                <ProtectedRoute roles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/mentor/dashboard"
              element={(
                <ProtectedRoute roles={['mentor']}>
                  <MentorDashboard />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/admin/dashboard"
              element={(
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              )}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
