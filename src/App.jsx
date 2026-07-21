import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import MyAccountPage from './pages/MyAccountPage';
import BandwidthMonitorPage from './pages/BandwidthMonitorPage';
import WifiRegistrationPage from './pages/WifiRegistrationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const EMPTY_USER = { id: null, schoolId: '', role: '', firstName: '', lastName: '', email: '', course: '', year: '', contactNumber: '' };

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ isLoggedIn, userRole, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (userRole !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function buildUser(data) {
  if (!data) return { ...EMPTY_USER };
  return {
    id: data.id ?? null,
    schoolId: data.schoolId || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    course: data.course || '',
    year: data.yearLevel || data.year || '',
    contactNumber: data.contactNumber || '',
    role: data.role === 'ADMIN' ? 'admin' : (data.role || ''),
  };
}

export default function App() {
  const navigateRouter = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ ...EMPTY_USER });

  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authService.validateToken();
        setUser(buildUser(profile));
        setIsLoggedIn(true);
      } catch {
        authService.logout();
        setIsLoggedIn(false);
        setUser({ ...EMPTY_USER });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const navigate = useCallback((page) => {
    const PAGE_MAP = {
      landing: '/',
      login: '/login',
      register: '/register',
      'forgot-password': '/forgot-password',
      about: '/about',
      contact: '/contact',
      dashboard: '/dashboard',
      'my-account': '/my-account',
      'bandwidth-monitor': '/bandwidth-monitor',
      'wifi-registration': '/wifi-registration',
      'admin-panel': '/admin-panel',
    };
    const path = PAGE_MAP[page] || '/';
    navigateRouter(path);
    window.scrollTo(0, 0);
  }, [navigateRouter]);

  const handleUpdateUser = useCallback((updatedData) => {
    const full = authService.updateStoredUser(updatedData);
    setUser(buildUser(full));
  }, []);

  const handleLogin = useCallback((data) => {
    setUser(buildUser(data.user));
    setIsLoggedIn(true);
    const role = data.user?.role;
    navigate(role === 'admin' ? 'admin-panel' : 'dashboard');
  }, [navigate]);

  const handleRegister = useCallback((data) => {
    setUser(buildUser(data.user));
    setIsLoggedIn(true);
    navigate('dashboard');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    authService.logout();
    setIsLoggedIn(false);
    setUser({ ...EMPTY_USER });
    navigate('landing');
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn && location.pathname === '/') {
      navigateRouter('/dashboard');
    }
  }, [isLoggedIn, location.pathname, navigateRouter]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a0a0a', color: '#d4a843', fontFamily: 'system-ui', fontSize: '16px' }}>
        Loading...
      </div>
    );
  }

  const userDisplayName = user.firstName ? `${user.firstName} ${user.lastName}` : user.schoolId;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<LandingPage onNavigate={navigate} />} />
        <Route path="/login" element={<LoginPage onNavigate={navigate} onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onNavigate={navigate} onRegister={handleRegister} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage onNavigate={navigate} />} />
        <Route path="/about" element={<AboutPage onNavigate={navigate} />} />
        <Route path="/contact" element={<ContactPage onNavigate={navigate} />} />

        <Route path="/dashboard" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <DashboardPage onNavigate={navigate} onLogout={handleLogout} onUpdateUser={handleUpdateUser} userName={userDisplayName} userRole={user.role} user={user} />
          </ProtectedRoute>
        } />
        <Route path="/my-account" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyAccountPage onNavigate={navigate} onLogout={handleLogout} onUpdateUser={handleUpdateUser} userName={userDisplayName} userRole={user.role} user={user} />
          </ProtectedRoute>
        } />
        <Route path="/bandwidth-monitor" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <BandwidthMonitorPage onNavigate={navigate} onLogout={handleLogout} userName={userDisplayName} userRole={user.role} />
          </ProtectedRoute>
        } />
        <Route path="/wifi-registration" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <WifiRegistrationPage onNavigate={navigate} onLogout={handleLogout} userName={userDisplayName} userRole={user.role} />
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={user.role}>
            <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} />
          </AdminRoute>
        } />
        <Route path="/network-overview" element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={user.role}>
            <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} />
          </AdminRoute>
        } />
        <Route path="/all-users" element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={user.role}>
            <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} />
          </AdminRoute>
        } />
        <Route path="/device-requests" element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={user.role}>
            <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} />
          </AdminRoute>
        } />
        <Route path="/usage-reports" element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={user.role}>
            <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} />
          </AdminRoute>
        } />
        <Route path="/access-control" element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={user.role}>
            <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} />
          </AdminRoute>
        } />
        <Route path="/admin-panel" element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={user.role}>
            <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} />
          </AdminRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
