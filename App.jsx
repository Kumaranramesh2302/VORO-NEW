import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAuthStore, useThemeStore } from './context/store';
import { PageLoader } from './components/common';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Public pages
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import PricingPage from './pages/PricingPage';
import TemplatesPage from './pages/TemplatesPage';
import ContactPage from './pages/ContactPage';
import { LoginPage, SignupPage } from './pages/AuthPages';

// Client dashboard
import DashboardPage from './pages/DashboardPage';
import { ProjectsPage, ProjectDetailPage } from './pages/ProjectPages';
import NewProjectPage from './pages/NewProjectPage';
import { ProfilePage, NotificationsPage } from './pages/ProfilePages';

// Admin
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AdminUsersPage, AdminProjectsPage } from './pages/AdminPages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

// ─── Route guards ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

// ─── Public layout wrapper ────────────────────────────────────────────────────
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function AppInner() {
  const { init } = useThemeStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface)',
            color: 'var(--fg)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
        <Route path="/portfolio/:slug" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
        <Route path="/templates" element={<PublicLayout><TemplatesPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

        {/* Auth */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />

        {/* Client dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<NewProjectPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="messages" element={<PlaceholderPage title="Messages" description="Real-time messaging with your project team." />} />
          <Route path="billing" element={<PlaceholderPage title="Billing & Invoices" description="View and pay your invoices here." />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><DashboardLayout isAdmin /></ProtectedRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="packages" element={<PlaceholderPage title="Package Management" description="Create and manage service packages." />} />
          <Route path="reviews" element={<PlaceholderPage title="Reviews" description="Moderate and respond to client reviews." />} />
          <Route path="messages" element={<PlaceholderPage title="Contact Messages" description="Manage incoming contact form submissions." />} />
          <Route path="portfolio" element={<PlaceholderPage title="Portfolio Manager" description="Add and manage portfolio items." />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-5">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-2xl font-display font-bold mb-2">{title}</h2>
      <p className="text-[var(--muted)] max-w-sm">{description}</p>
      <p className="text-xs text-[var(--muted)] mt-4 bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full">
        Connect to backend API to enable this feature
      </p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
