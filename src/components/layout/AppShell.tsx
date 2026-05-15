import { NavLink, Outlet, useMatch, useResolvedPath, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, LayoutDashboard, Coins, FolderKanban, Settings as SettingsIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

interface NavItemDef {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
  matchPaths?: string[];
}

const NAV: NavItemDef[] = [
  { to: '/', label: 'Daily', Icon: CalendarDays, end: true, matchPaths: ['/daily', '/daily/:date'] },
  { to: '/dashboard/monthly', label: 'Dashboard', Icon: LayoutDashboard, matchPaths: ['/dashboard/quarterly'] },
  { to: '/dashboard/ot', label: 'OT Table', Icon: Coins },
  { to: '/projects', label: 'Projects', Icon: FolderKanban },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
];

function NavItem({ to, label, Icon, end, matchPaths }: NavItemDef) {
  const resolved = useResolvedPath(to);
  const directMatch = useMatch({ path: resolved.pathname, end });
  const location = useLocation();
  const extraMatch =
    matchPaths?.some((p) => {
      const re = new RegExp('^' + p.replace(/:[^/]+/g, '[^/]+') + '/?$');
      return re.test(location.pathname);
    }) ?? false;
  const isActive = !!directMatch || extraMatch;

  return (
    <NavLink
      to={to}
      end={end}
      className={cn(
        'relative px-3 py-1.5 rounded-button font-display font-semibold text-sm whitespace-nowrap transition-colors inline-flex items-center gap-1.5',
        isActive ? 'text-paper' : 'text-ink-700 hover:bg-cream-100',
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 bg-ink-900 rounded-button -z-0"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <Icon size={15} className="relative z-10 shrink-0" />
      <span className="relative z-10">{label}</span>
    </NavLink>
  );
}

export function AppShell() {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-paper border-b-1.5 border-ink-900 shadow-stamp-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4 px-5 md:px-8 py-3">
          <div className="flex items-center gap-3 pr-2">
            <Logo size="sm" />
            <span className="font-display font-bold text-h4 hidden sm:inline">My Daily</span>
          </div>
          <nav className="flex items-center gap-1 ml-2 flex-1 overflow-x-auto">
            {NAV.map((n) => (
              <NavItem key={n.to} {...n} />
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
