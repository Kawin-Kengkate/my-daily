import { NavLink, Outlet, useMatch, useResolvedPath, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDays, LayoutDashboard, Coins, FolderKanban,
  Settings as SettingsIcon, GraduationCap, BookOpen, Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

type Module = 'work' | 'learning';

interface NavItemDef {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
  matchPaths?: string[];
}

const WORK_NAV: NavItemDef[] = [
  { to: '/', label: 'Daily', Icon: CalendarDays, end: true, matchPaths: ['/daily', '/daily/:date'] },
  { to: '/dashboard/monthly', label: 'Dashboard', Icon: LayoutDashboard, matchPaths: ['/dashboard/quarterly', '/dashboard/compare'] },
  { to: '/dashboard/ot', label: 'OT Table', Icon: Coins },
  { to: '/projects', label: 'Projects', Icon: FolderKanban },
];

const LEARNING_NAV: NavItemDef[] = [
  { to: '/learning', label: 'Dashboard', Icon: GraduationCap, end: true },
  { to: '/learning/new', label: 'Log Session', Icon: Plus },
  { to: '/learning/courses', label: 'Courses', Icon: BookOpen },
];

function useCurrentModule(): Module {
  const { pathname } = useLocation();
  return pathname.startsWith('/learning') ? 'learning' : 'work';
}

function useIsActive({ to, end, matchPaths }: NavItemDef) {
  const resolved = useResolvedPath(to);
  const directMatch = useMatch({ path: resolved.pathname, end });
  const location = useLocation();
  const extraMatch =
    matchPaths?.some((p) => {
      const re = new RegExp('^' + p.replace(/:[^/]+/g, '[^/]+') + '/?$');
      return re.test(location.pathname);
    }) ?? false;
  return !!directMatch || extraMatch;
}

function ModuleSwitcher({ compact = false }: { compact?: boolean }) {
  const mod = useCurrentModule();
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'relative inline-flex items-center border-1.5 border-ink-900 rounded-full bg-cream-100 shadow-stamp-sm p-0.5',
        compact ? 'text-[11px]' : 'text-xs',
      )}
      role="tablist"
      aria-label="Module switcher"
    >
      {(['work', 'learning'] as const).map((m) => {
        const active = mod === m;
        return (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => navigate(m === 'work' ? '/' : '/learning')}
            className={cn(
              'relative px-3 py-1 rounded-full font-display font-bold uppercase tracking-wide transition-colors',
              active ? 'text-paper' : 'text-ink-600 hover:text-ink-900',
            )}
          >
            {active && (
              <motion.span
                layoutId="module-pill"
                className={cn(
                  'absolute inset-0 rounded-full -z-0',
                  m === 'work' ? 'bg-ink-900' : 'bg-peri',
                )}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{m}</span>
          </button>
        );
      })}
    </div>
  );
}

function TopNavItem(item: NavItemDef & { accent: Module }) {
  const { to, label, Icon, end, accent } = item;
  const isActive = useIsActive(item);
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
          className={cn(
            'absolute inset-0 rounded-button -z-0',
            accent === 'learning' ? 'bg-peri' : 'bg-ink-900',
          )}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <Icon size={15} className="relative z-10 shrink-0" />
      <span className="relative z-10">{label}</span>
    </NavLink>
  );
}

function BottomNavItem(item: NavItemDef & { accent: Module }) {
  const { to, label, Icon, end, accent } = item;
  const isActive = useIsActive(item);
  return (
    <NavLink
      to={to}
      end={end}
      className={cn(
        'relative flex flex-col items-center justify-center gap-0.5 py-2 transition-colors',
        isActive ? 'text-ink-900' : 'text-ink-500',
      )}
    >
      {isActive && (
        <motion.span
          layoutId="bottom-nav-active"
          className={cn(
            'absolute top-0 inset-x-3 h-[2px]',
            accent === 'learning' ? 'bg-peri' : 'bg-ink-900',
          )}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <Icon size={20} className="shrink-0" />
      <span className="font-display font-semibold text-[11px] leading-none">{label}</span>
    </NavLink>
  );
}

export function AppShell() {
  const { user, signOut } = useAuth();
  const mod = useCurrentModule();
  const subNav = mod === 'learning' ? LEARNING_NAV : WORK_NAV;
  const settingsItem: NavItemDef = { to: '/settings', label: 'Settings', Icon: SettingsIcon };
  const bottomItems = [...subNav, settingsItem];

  return (
    <div className="min-h-full">
      <header
        className={cn(
          'sticky top-0 z-30 border-b-1.5 border-ink-900 shadow-stamp-sm transition-colors',
          mod === 'learning' ? 'bg-peri/5' : 'bg-paper',
        )}
      >
        {/* Row 1: brand + module switcher + actions */}
        <div className="max-w-6xl mx-auto flex items-center gap-3 md:gap-4 px-5 md:px-8 py-3">
          <div className="flex items-center gap-2.5 pr-1">
            <Logo size="sm" />
            <span className="font-display font-bold text-h4 hidden sm:inline">My Daily</span>
          </div>

          <ModuleSwitcher />

          <div className="ml-auto flex items-center gap-2">
            {user?.email && (
              <span className="text-hint font-mono text-ink-500 hidden lg:inline">
                {user.email}
              </span>
            )}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn('p-2 rounded-button hover:bg-cream-100 transition-colors hidden md:inline-flex', isActive && 'bg-cream-200')
              }
              aria-label="Settings"
            >
              <SettingsIcon size={16} />
            </NavLink>
            <Button variant="paper" size="sm" onClick={() => signOut()} className="hidden md:inline-flex">
              Sign out
            </Button>
          </div>
        </div>

        {/* Row 2: contextual sub-nav (desktop only) */}
        <nav className="hidden md:block border-t border-cream-200">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-1.5 flex items-center gap-1 overflow-x-auto">
            {subNav.map((n) => (
              <TopNavItem key={n.to} {...n} accent={mod} />
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-6 pb-16 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile bottom nav — contextual to current module */}
      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-paper border-t-1.5 border-ink-900 shadow-[0_-2px_0_0_rgba(15,27,45,0.06)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${bottomItems.length}, minmax(0, 1fr))` }}
        >
          {bottomItems.map((n) => (
            <BottomNavItem key={n.to} {...n} accent={mod} />
          ))}
        </div>
      </nav>
    </div>
  );
}
