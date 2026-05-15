import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { useAuth } from '@/hooks/useAuth';

const DailyPage = lazy(() => import('@/pages/DailyPage').then((m) => ({ default: m.DailyPage })));
const DailyListPage = lazy(() => import('@/pages/DailyListPage').then((m) => ({ default: m.DailyListPage })));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const MonthlyDashboardPage = lazy(() => import('@/pages/MonthlyDashboardPage').then((m) => ({ default: m.MonthlyDashboardPage })));
const QuarterlyDashboardPage = lazy(() => import('@/pages/QuarterlyDashboardPage').then((m) => ({ default: m.QuarterlyDashboardPage })));
const OTDashboardPage = lazy(() => import('@/pages/OTDashboardPage').then((m) => ({ default: m.OTDashboardPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

function PageFallback() {
  return <div className="p-8 font-mono text-ink-500">โหลดหน้า…</div>;
}

function ProtectedShell() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-body">Loading…</div>;
  }
  if (!user) return <LoginPage />;
  return <AppShell />;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <HashRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<ProtectedShell />}>
              <Route index element={<DailyPage />} />
              <Route path="daily" element={<DailyListPage />} />
              <Route path="daily/:date" element={<DailyPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="dashboard/monthly" element={<MonthlyDashboardPage />} />
              <Route path="dashboard/quarterly" element={<QuarterlyDashboardPage />} />
              <Route path="dashboard/ot" element={<OTDashboardPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-paper border-1.5 border-ink-900 shadow-stamp font-body',
        }}
      />
    </QueryClientProvider>
  );
}
