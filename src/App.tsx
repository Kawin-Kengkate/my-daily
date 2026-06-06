import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { PageTransition } from '@/components/PageTransition';
import { PageSkeleton } from '@/components/Skeleton';
import { useAuth } from '@/hooks/useAuth';

const DailyPage = lazy(() => import('@/pages/DailyPage').then((m) => ({ default: m.DailyPage })));
const DailyListPage = lazy(() => import('@/pages/DailyListPage').then((m) => ({ default: m.DailyListPage })));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ProjectsManagePage = lazy(() => import('@/pages/ProjectsManagePage').then((m) => ({ default: m.ProjectsManagePage })));
const MonthlyDashboardPage = lazy(() => import('@/pages/MonthlyDashboardPage').then((m) => ({ default: m.MonthlyDashboardPage })));
const QuarterlyDashboardPage = lazy(() => import('@/pages/QuarterlyDashboardPage').then((m) => ({ default: m.QuarterlyDashboardPage })));
const OTDashboardPage = lazy(() => import('@/pages/OTDashboardPage').then((m) => ({ default: m.OTDashboardPage })));
const ComparePage = lazy(() => import('@/pages/ComparePage').then((m) => ({ default: m.ComparePage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const CalendarMaintenancePage = lazy(() => import('@/pages/CalendarMaintenancePage').then((m) => ({ default: m.CalendarMaintenancePage })));
const LearningDashboardPage = lazy(() => import('@/pages/LearningDashboardPage').then((m) => ({ default: m.LearningDashboardPage })));
const LearningCoursesPage = lazy(() => import('@/pages/LearningCoursesPage').then((m) => ({ default: m.LearningCoursesPage })));
const LogSessionPage = lazy(() => import('@/pages/LogSessionPage').then((m) => ({ default: m.LogSessionPage })));

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

function ProtectedShell() {
  const { user, loading } = useAuth();
  if (loading) {
    return <PageSkeleton />;
  }
  if (!user) return <LoginPage />;
  return <AppShell />;
}

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <HashRouter>
        <Routes>
          <Route element={<ProtectedShell />}>
            <Route element={<AnimatedOutlet />}>
              <Route index element={<DailyPage />} />
              <Route path="daily" element={<DailyListPage />} />
              <Route path="daily/:date" element={<DailyPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/manage" element={<ProjectsManagePage />} />
              <Route path="dashboard/monthly" element={<MonthlyDashboardPage />} />
              <Route path="dashboard/quarterly" element={<QuarterlyDashboardPage />} />
              <Route path="dashboard/ot" element={<OTDashboardPage />} />
              <Route path="dashboard/compare" element={<ComparePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="settings/calendar" element={<CalendarMaintenancePage />} />
              <Route path="learning" element={<LearningDashboardPage />} />
              <Route path="learning/new" element={<LogSessionPage />} />
              <Route path="learning/courses" element={<LearningCoursesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
