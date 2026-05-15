import { useParams } from 'react-router-dom';
import { DailyForm } from '@/features/daily-entry/DailyForm';
import { todayISO } from '@/lib/date';

export function DailyPage() {
  const { date } = useParams();
  const dateISO = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayISO();
  return <DailyForm key={dateISO} dateISO={dateISO} />;
}
