import { useEffect, useRef, useState } from 'react';
import type { LocationKind } from '@/types/db';

const DRAFT_PREFIX = 'mydaily:draft:';
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 วัน

export interface DraftEntry {
  project_id: string;
  start_time: string;
  end_time: string;
  progress: string;
  done_note: string;
  next_note: string;
}

export interface DraftPayload {
  location: LocationKind;
  is_holiday: boolean;
  note: string;
  entries: DraftEntry[];
}

interface StoredDraft {
  data: DraftPayload;
  ts: number;
}

function key(dateISO: string) {
  return DRAFT_PREFIX + dateISO;
}

export function loadDraft(dateISO: string): DraftPayload | null {
  try {
    const raw = localStorage.getItem(key(dateISO));
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredDraft;
    if (!stored?.ts || Date.now() - stored.ts > DRAFT_TTL_MS) {
      localStorage.removeItem(key(dateISO));
      return null;
    }
    return stored.data;
  } catch {
    return null;
  }
}

export function saveDraft(dateISO: string, data: DraftPayload): void {
  try {
    const stored: StoredDraft = { data, ts: Date.now() };
    localStorage.setItem(key(dateISO), JSON.stringify(stored));
  } catch {
    // quota หรือ disabled — เงียบไป
  }
}

export function clearDraft(dateISO: string): void {
  try {
    localStorage.removeItem(key(dateISO));
  } catch {
    // ignore
  }
}

/** debounce auto-save — เรียกทุกครั้งที่ data เปลี่ยน */
export function useAutoSaveDraft(dateISO: string, data: DraftPayload, enabled: boolean) {
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      saveDraft(dateISO, data);
      setSavedAt(Date.now());
    }, 500);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [dateISO, data, enabled]);

  return savedAt;
}
