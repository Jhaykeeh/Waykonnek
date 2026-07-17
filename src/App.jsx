/**
 * App.jsx - Main Application Router
 */

import { useState, useEffect } from 'react';
import { authService, userService } from './services/authService';
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

const PUBLIC_PAGES = ['landing', 'login', 'register', 'forgot-password', 'about', 'contact'];

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

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (authService.isAuthenticated()) return 'dashboard';
    return 'landing';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [user, setUser] = useState(getInitialUser);

  // Redirect unauthorized users away from protected pages
  useEffect(() => {
    if (!isLoggedIn && !PUBLIC_PAGES.includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [isLoggedIn, currentPage]);

  // Redirect non-admin users away from admin pages
  useEffect(() => {
    if (isLoggedIn && currentPage === 'admin-panel' && user.role !== 'admin') {
      setCurrentPage('dashboard');
    }
  }, [isLoggedIn, currentPage, user.role]);

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
  }, [isLoggedIn]);

  // Navigation
  const navigate = (page) => {
    setCurrentPage(page);
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

  // Update user profile handler
  const handleUpdateUser = (updatedData) => {
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
  };

  // Logout
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser({ schoolId: '', role: '', firstName: '', lastName: '', email: '', course: '', year: '', contactNumber: '' });
    navigate('landing');
  };

  const renderPage = () => {
    const userName = user.schoolId;
    const userRole = user.role;
    const userDisplayName = user.firstName ? `${user.firstName} ${user.lastName}` : user.schoolId;

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;

      case 'login':
        return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;

      case 'register':
        return <RegisterPage onNavigate={navigate} onRegister={handleRegister} />;

      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={navigate} />;

      case 'about':
        return <AboutPage onNavigate={navigate} />;

      case 'contact':
        return <ContactPage onNavigate={navigate} />;

      case 'dashboard':
        if (!isLoggedIn) return null;
        return (
          <DashboardPage
            onNavigate={navigate}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            userName={userDisplayName}
            userRole={userRole}
            user={user}
          />
        );

      case 'my-account':
        if (!isLoggedIn) return null;
        return (
          <MyAccountPage
            onNavigate={navigate}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            userName={userDisplayName}
            userRole={userRole}
            user={user}
          />
        );

      case 'bandwidth-monitor':
        if (!isLoggedIn) return null;
        return (
          <BandwidthMonitorPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userDisplayName}
            userRole={userRole}
          />
        );

      case 'wifi-registration':
        if (!isLoggedIn) return null;
        return (
          <WifiRegistrationPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userDisplayName}
            userRole={userRole}
          />
        );

      case 'admin-panel':
        if (!isLoggedIn || user.role !== 'admin') return null;
        return (
          <AdminDashboardPage
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        );

      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return <div style={{ minHeight: '100vh' }}>{renderPage()}</div>;
}
