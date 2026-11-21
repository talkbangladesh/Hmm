import React, { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { ProgrammesPage } from './pages/ProgrammesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { InstitutionalTrainingPage } from './pages/InstitutionalTrainingPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { MenuPage } from './pages/MenuPage';
import { FaqPage, FreeSessionPage, PolicyPage } from './pages/InfoAndPolicyPages';
import {
  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage,
  SignupPage,
  VerifyEmailPage,
} from './pages/AuthPages';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import {
  DashboardAssignments,
  DashboardCourses,
  DashboardOverview,
  DashboardProfile,
  DashboardProgress,
  DashboardSchedule,
} from './pages/dashboard/DashboardPrimaryViews';
import {
  DashboardCertificates,
  DashboardNotifications,
  DashboardPayments,
  DashboardResources,
  DashboardScholarships,
  DashboardSettings,
  DashboardSupport,
} from './pages/dashboard/DashboardSecondaryViews';
import { AdminPanelPage } from './pages/admin/AdminPanelPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
      <p className="text-xs uppercase tracking-wide text-[#1D4ED8] font-semibold">404</p>
      <h1 className="text-3xl font-bold text-[#0F172A]">Page Not Found</h1>
      <p className="text-sm text-[#334155]">
        The requested route does not exist. Explore our programmes or return to the homepage.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Link to="/" className="px-4 py-2 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px]">
          Return Home
        </Link>
        <Link to="/programmes" className="px-4 py-2 text-sm font-medium border border-[#CBD5E1] rounded-[8px]">
          All Programmes
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white text-[#0F172A]">
          <Header />
          <div className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/programmes" element={<ProgrammesPage />} />
              <Route path="/programmes/foundation" element={<ProgrammesPage categorySlug="foundation" />} />
              <Route path="/programmes/applied-ai" element={<ProgrammesPage categorySlug="applied-ai" />} />
              <Route
                path="/programmes/professional-development"
                element={<ProgrammesPage categorySlug="professional-development" />}
              />
              <Route path="/programmes/specialized" element={<ProgrammesPage categorySlug="specialized" />} />
              <Route path="/courses/:code" element={<CourseDetailPage mode="course" />} />
              <Route path="/specialized-programmes/:slug" element={<CourseDetailPage mode="specialized" />} />
              <Route path="/institutional-training" element={<InstitutionalTrainingPage />} />
              <Route path="/institutional-corporate-training" element={<InstitutionalTrainingPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/resources/:id" element={<ResourceDetailPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/scholarships" element={<ScholarshipsPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/free-session" element={<FreeSessionPage />} />
              <Route path="/verify-certificate" element={<VerifyCertificatePage />} />

              {/* Policy Pages */}
              <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
              <Route path="/terms-and-conditions" element={<PolicyPage type="terms" />} />
              <Route path="/certificate-policy" element={<PolicyPage type="certificate" />} />
              <Route path="/accessibility-statement" element={<PolicyPage type="accessibility" />} />

              {/* Auth Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Student Dashboard + All 12 Child Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="profile" element={<DashboardProfile />} />
                <Route path="courses" element={<DashboardCourses />} />
                <Route path="progress" element={<DashboardProgress />} />
                <Route path="schedule" element={<DashboardSchedule />} />
                <Route path="assignments" element={<DashboardAssignments />} />
                <Route path="certificates" element={<DashboardCertificates />} />
                <Route path="resources" element={<DashboardResources />} />
                <Route path="scholarships" element={<DashboardScholarships />} />
                <Route path="payments" element={<DashboardPayments />} />
                <Route path="notifications" element={<DashboardNotifications />} />
                <Route path="settings" element={<DashboardSettings />} />
                <Route path="support" element={<DashboardSupport />} />
              </Route>

              {/* Secure Admin Panel */}
              <Route path="/admin" element={<AdminPanelPage />} />

              {/* Canonical education.atlasai.institute top-level course slug URLs (e.g. /ai-powered-content-creation) */}
              <Route path="/:slug" element={<CourseDetailPage mode="course" />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
          <BottomNav />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
