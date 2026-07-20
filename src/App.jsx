/**
 * App.jsx - Main Application Router
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import { userService } from './services/userService';
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

const KEY_TO_PATH = {
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
  'admin-panel': '/admin',
};

function getInitialUser() {
  if (!authService.isAuthenticated()) {
    return { schoolId: '', role: '', firstName: '', lastName: '', email: '', course: '', year: '', contactNumber: '' };
  }

  try {
    const user = authService.getCurrentUser();
    if (!user) {
      return { schoolId: '', role: '', firstName: '', lastName: '', email: '', course: '', year: '', contactNumber: '' };
    }
    return {
      schoolId: user.schoolId || '',
      role: user.role === 'ADMIN' ? 'admin' : 'student',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      course: user.course || '',
      year: user.year || '',
      contactNumber: user.contactNumber || '',
    };
  } catch {
    return { schoolId: '', role: '', firstName: '', lastName: '', email: '', course: '', year: '', contactNumber: '' };
  }
}

// Route Protection Components
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ isLoggedIn, userRole, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const navigateRouter = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [user, setUser] = useState(getInitialUser);
  const reactNavigate = useNavigate();

  const PAGE_ROUTE = {
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

  const handleUpdateUser = useCallback((updatedData) => {
    const fullUpdatedUser = authService.updateStoredUser(updatedData);
    setUser({
      schoolId: fullUpdatedUser.schoolId || '',
      role: fullUpdatedUser.role === 'ADMIN' ? 'admin' : 'student',
      firstName: fullUpdatedUser.firstName || '',
      lastName: fullUpdatedUser.lastName || '',
      email: fullUpdatedUser.email || '',
      course: fullUpdatedUser.course || '',
      year: fullUpdatedUser.year || '',
      contactNumber: fullUpdatedUser.contactNumber || '',
    });
  }, []);

  // Auto-hydrate profile if logged in but data is missing
  useEffect(() => {
    if (isLoggedIn && !user.firstName) {
      userService.getProfile()
        .then(response => {
          const userData = response.user || response;
          if (userData && (userData.firstName || userData.lastName)) {
            handleUpdateUser(userData);
          }
        })
        .catch(() => {});
    }
  }, [isLoggedIn, user.firstName, handleUpdateUser]);

  const navigate = (page) => {
    let destination = page;
    if (!isLoggedIn && !PUBLIC_PAGES.includes(page)) {
      destination = 'login';
    } else if (page === 'admin-panel' && (!isLoggedIn || user.role !== 'admin')) {
      destination = 'dashboard';
    }

    const path = PAGE_ROUTE[destination] || '/';
    navigateRouter(path);
    window.scrollTo(0, 0);
  };

  // Login handler
  const handleLogin = (data) => {
    setIsLoggedIn(true);
    const userData = data.user || data;
    setUser({
      schoolId: userData.schoolId || '',
      role: userData.role === 'ADMIN' ? 'admin' : 'student',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      course: userData.course || '',
      year: userData.year || '',
      contactNumber: userData.contactNumber || '',
    });
    navigate('dashboard');
  };

  // Register handler
  const handleRegister = (data) => {
    setIsLoggedIn(true);
    const userData = data.user || data;
    setUser({
      schoolId: userData.schoolId || '',
      role: 'student',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      course: userData.course || '',
      year: userData.year || '',
      contactNumber: userData.contactNumber || '',
    });
    navigate('dashboard');
  };

  // Logout
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser({ schoolId: '', role: '', firstName: '', lastName: '', email: '', course: '', year: '', contactNumber: '' });
    navigate('landing');
  };

  // If user is on root and authenticated, redirect to dashboard
  useEffect(() => {
    if (location.pathname === '/' && isLoggedIn) {
      navigateRouter('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const userRole = user.role;
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

        <Route
          path="/dashboard"
          element={isLoggedIn ? (
            <DashboardPage
              onNavigate={navigate}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
              userName={userDisplayName}
              userRole={userRole}
              user={user}
            />
          ) : (
            <Navigate to="/login" replace />
          )}
        />

        <Route
          path="/my-account"
          element={isLoggedIn ? (
            <MyAccountPage
              onNavigate={navigate}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
              userName={userDisplayName}
              userRole={userRole}
              user={user}
            />
          ) : (
            <Navigate to="/login" replace />
          )}
        />

        <Route
          path="/bandwidth-monitor"
          element={isLoggedIn ? (
            <BandwidthMonitorPage
              onNavigate={navigate}
              onLogout={handleLogout}
              userName={userDisplayName}
              userRole={userRole}
            />
          ) : (
            <Navigate to="/login" replace />
          )}
        />

        <Route
          path="/wifi-registration"
          element={isLoggedIn ? (
            <WifiRegistrationPage
              onNavigate={navigate}
              onLogout={handleLogout}
              userName={userDisplayName}
              userRole={userRole}
            />
          ) : (
            <Navigate to="/login" replace />
          )}
        />

        <Route
          path="/admin/*"
          element={isLoggedIn && user.role === 'admin' ? (
            <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} />
          ) : (
            <Navigate to="/dashboard" replace />
          )}
        />

        {/* top-level friendly admin routes */}
        <Route path="/network-overview" element={isLoggedIn && user.role === 'admin' ? <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/all-users" element={isLoggedIn && user.role === 'admin' ? <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/device-requests" element={isLoggedIn && user.role === 'admin' ? <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/usage-reports" element={isLoggedIn && user.role === 'admin' ? <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/access-control" element={isLoggedIn && user.role === 'admin' ? <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin-panel" element={isLoggedIn && user.role === 'admin' ? <AdminDashboardPage onNavigate={navigate} onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
