import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

const NAV = [
  { to: '/', label: 'Daily', end: true },
  { to: '/dashboard/monthly', label: 'Dashboard' },
  { to: '/dashboard/ot', label: 'OT Table' },
  { to: '/projects', label: 'Projects' },
  { to: '/settings', label: 'Settings' },
];

export function AppShell() {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-full">
      <header className="bg-paper border-b-1.5 border-ink-900">
        <div className="max-w-6xl mx-auto flex items-center gap-4 px-5 md:px-8 py-4">
          <div className="flex items-center gap-3 pr-2">
            <Logo size="sm" />
            <span className="font-display font-bold text-h4 hidden sm:inline">My Daily</span>
          </div>
          <nav className="flex items-center gap-1 ml-2 flex-1 overflow-x-auto">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-button font-display font-semibold text-sm whitespace-nowrap',
                    isActive ? 'bg-ink-900 text-paper' : 'text-ink-700 hover:bg-cream-100',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user?.email && (
              <span className="text-hint font-mono text-ink-500 hidden md:inline">
                {user.email}
              </span>
            )}
            <Button variant="paper" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 md:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
