import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// Auth components
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ClubsPage from './pages/ClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Student Dashboard Pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import MyRegistrationsPage from './pages/dashboard/MyRegistrationsPage';
import SavedEventsPage from './pages/dashboard/SavedEventsPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import CertificatesPage from './pages/dashboard/CertificatesPage';
import ResultsPage from './pages/dashboard/ResultsPage';
import CalendarPage from './pages/dashboard/CalendarPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import CreateEventPage from './pages/admin/CreateEventPage';
import EditEventPage from './pages/admin/EditEventPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminFacultyPage from './pages/admin/AdminFacultyPage';
import AdminClubsPage from './pages/admin/AdminClubsPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';
import AdminCertificatesPage from './pages/admin/AdminCertificatesPage';
import AdminResultsPage from './pages/admin/AdminResultsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';

import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px',
              },
              success: {
                iconTheme: { primary: '#6366f1', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:id" element={<EventDetailPage />} />
              <Route path="clubs" element={<ClubsPage />} />
              <Route path="clubs/:id" element={<ClubDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="registration-success" element={<RegistrationSuccessPage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Student Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="registrations" element={<MyRegistrationsPage />} />
              <Route path="saved" element={<SavedEventsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute roles={['admin', 'faculty', 'coordinator']}>
                    <AdminLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="events/create" element={<CreateEventPage />} />
              <Route path="events/:id/edit" element={<EditEventPage />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="faculty" element={<AdminFacultyPage />} />
              <Route path="clubs" element={<AdminClubsPage />} />
              <Route path="registrations" element={<AdminRegistrationsPage />} />
              <Route path="certificates" element={<AdminCertificatesPage />} />
              <Route path="results" element={<AdminResultsPage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
            </Route>

            {/* Redirect /admin to admin dashboard */}
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  </ErrorBoundary>
  );
}

export default App;
