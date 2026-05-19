import { useEffect, useState } from 'react';
import { Eye, EyeOff, CalendarRange, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/lib/notify';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/Field';
import { TimePicker } from '@/components/TimePicker';
import { Skeleton } from '@/components/Skeleton';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

export function SettingsPage() {
  const navigate = useNavigate();
  const { data: settings, isLoading } = useSettings();
  const save = useSaveSettings();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    salary: 0,
    work_start: '08:00',
    work_end: '16:40',
    break_minutes: 40,
    ot_rate_weekday: 1.5,
    ot_rate_holiday_day: 1.5,
    ot_rate_holiday_night: 3,
  });

  useEffect(() => {
    if (!settings) return;
    setForm({
      salary: settings.salary,
      work_start: settings.work_start.slice(0, 5),
      work_end: settings.work_end.slice(0, 5),
      break_minutes: settings.break_minutes ?? 40,
      ot_rate_weekday: settings.ot_rate_weekday,
      ot_rate_holiday_day: settings.ot_rate_holiday_day,
      ot_rate_holiday_night: settings.ot_rate_holiday_night,
    });
  }, [settings]);

  const onSave = async () => {
    try {
      await save.mutateAsync(form);
      notify.success('Saved ✓');
    } catch (e) {
      notify.error((e as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5 max-w-2xl mx-auto">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-32" rounded="card" bordered />
        <Skeleton className="h-32" rounded="card" bordered />
        <Skeleton className="h-32" rounded="card" bordered />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <h2 className="font-display font-extrabold text-display">Settings</h2>

      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-h4">💰 Salary</h3>
          <button onClick={() => setShow(!show)} className="text-ink-500 hover:text-ink-900">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <Field
          label="เงินเดือน (THB)"
          type={show ? 'number' : 'password'}
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
          hint="ใช้คำนวณ OT: baseHourly = salary / 30 / 8"
          suffix="THB"
        />
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-display font-bold text-h4">🕐 Work hours</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-display font-bold text-label text-ink-500 uppercase">Start</label>
            <div className="mt-1.5">
              <TimePicker value={form.work_start} onChange={(v) => setForm({ ...form, work_start: v })} />
            </div>
          </div>
          <div>
            <label className="font-display font-bold text-label text-ink-500 uppercase">End</label>
            <div className="mt-1.5">
              <TimePicker value={form.work_end} onChange={(v) => setForm({ ...form, work_end: v })} />
            </div>
          </div>
          <div className="mt-3">
            <Field
              label="พักกลางวัน (วันธรรมดา)"
              type="number"
              min={0}
              max={120}
              value={form.break_minutes}
              onChange={(e) => setForm({ ...form, break_minutes: Number(e.target.value) })}
              hint="หักออกจากชั่วโมงทำงานปกติ (ไม่ใช่ OT)"
              suffix="นาที"
            />
          </div>
        </div>
      </Card>

      <Card
        className="p-5 flex items-center gap-3 cursor-pointer hover:bg-cream-50 transition-colors"
        onClick={() => navigate('/settings/calendar')}
      >
        <CalendarRange size={22} className="text-peri shrink-0" />
        <div className="flex-1">
          <h3 className="font-display font-bold text-h4 leading-tight">ปฏิทินวันทำงาน</h3>
          <p className="font-body text-sm text-ink-500 mt-0.5">
            จัดการเสาร์ที่ต้องทำงาน + วันหยุดพิเศษของบริษัท
          </p>
        </div>
        <ChevronRight size={18} className="text-ink-500" />
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-display font-bold text-h4">📊 OT Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Weekday" type="number" step="0.1" value={form.ot_rate_weekday} onChange={(e) => setForm({ ...form, ot_rate_weekday: Number(e.target.value) })} suffix="x" />
          <Field label="Holiday day" type="number" step="0.1" value={form.ot_rate_holiday_day} onChange={(e) => setForm({ ...form, ot_rate_holiday_day: Number(e.target.value) })} suffix="x" />
          <Field label="Holiday night" type="number" step="0.1" value={form.ot_rate_holiday_night} onChange={(e) => setForm({ ...form, ot_rate_holiday_night: Number(e.target.value) })} suffix="x" />
        </div>
      </Card>

      <Button variant="primary" size="lg" onClick={onSave} disabled={save.isPending}>
        {save.isPending ? (
          <span className="inline-flex items-center gap-2">
            กำลังบันทึก
            <span className="inline-flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block w-1.5 h-1.5 rounded-full bg-paper"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </span>
          </span>
        ) : (
          'Save settings'
        )}
      </Button>
    </div>
  );
}
