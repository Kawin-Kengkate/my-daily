import { useSyncExternalStore } from 'react';
import { DEFAULT_THEME, THEME_STORAGE_KEY, isThemeId, type ThemeId } from '@/lib/theme';

// source of truth = <html data-theme> (index.html ตั้งให้ก่อน paint จาก localStorage)
const listeners = new Set<() => void>();

function readTheme(): ThemeId {
  const value = document.documentElement.getAttribute('data-theme');
  return isThemeId(value) ? value : DEFAULT_THEME;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** status bar มือถือ (meta theme-color) = tangerine ของ theme ปัจจุบัน */
export function syncThemeColorMeta() {
  const channels = getComputedStyle(document.documentElement).getPropertyValue('--c-tangerine').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (channels && meta) meta.setAttribute('content', `rgb(${channels.split(/\s+/).join(', ')})`);
}

function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute('data-theme', id);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // storage ถูกบล็อก (private mode) — ใช้ได้แค่ในแท็บนี้
  }
  syncThemeColorMeta();
  listeners.forEach((l) => l());
}

/** from = element ที่กด → theme ใหม่ขยายเป็นวงกลมออกจากตรงนั้น (ถ้า browser รองรับ View Transitions) */
export function setTheme(id: ThemeId, from?: Element) {
  if (id === readTheme()) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!from || reduceMotion || !('startViewTransition' in document)) {
    applyTheme(id);
    return;
  }
  const rect = from.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = document.startViewTransition(() => applyTheme(id));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {
      // transition ถูก skip — theme ถูก apply ไปแล้วใน callback
    });
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme);
  return { theme, setTheme };
}
