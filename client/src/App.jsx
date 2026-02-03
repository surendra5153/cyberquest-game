import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';

// Components
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot/Chatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';

// Game Levels
import Level1Phishing from './game/Level1Phishing';
import Level2Password from './game/Level2Password';
import Level3CyberRush from './game/Level3CyberRush';
import Level4Story from './game/Level4Story';

// Side Quests
import SideQuestMenu from './side-quests/SideQuestMenu';
import CyberSnake from './side-quests/CyberSnake/CyberSnake';
import CyberPacman from './side-quests/CyberPacman/CyberPacman';
import FirewallBreaker from './side-quests/FirewallBreaker/FirewallBreaker';

// CSS
import './index.css';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="cyber-spinner w-12 h-12" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * Dashboard Router
 * Redirects to appropriate dashboard based on role
 */
function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  return <ParentDashboard />;
}

/**
 * App Routes Component
 * Must be inside AuthProvider to access auth context
 */
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - All Users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Students Only */}
        <Route
          path="/levels"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels/1"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Level1Phishing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels/2"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Level2Password />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels/3"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Level3CyberRush />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels/4"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Level4Story />
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Side Quests */}
        <Route
          path="/side-quests"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <SideQuestMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/side-quests/snake"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CyberSnake />
            </ProtectedRoute>
          }
        />
        <Route
          path="/side-quests/pacman"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CyberPacman />
            </ProtectedRoute>
          }
        />
        <Route
          path="/side-quests/breaker"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <FirewallBreaker />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Parents/Teachers Only */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={['parent', 'teacher']}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={['parent', 'teacher']}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

/**
 * Main App Component
 * Wraps everything in providers
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <div className="min-h-screen bg-cyber-dark">
            <AppRoutes />
            <Chatbot />
          </div>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
