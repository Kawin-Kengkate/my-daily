import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/Field';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

export function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const save = useSaveSettings();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    salary: 0,
    work_start: '08:00',
    work_end: '16:40',
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
      ot_rate_weekday: settings.ot_rate_weekday,
      ot_rate_holiday_day: settings.ot_rate_holiday_day,
      ot_rate_holiday_night: settings.ot_rate_holiday_night,
    });
  }, [settings]);

  const onSave = async () => {
    try {
      await save.mutateAsync(form);
      toast.success('Saved ✓');
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (isLoading) return <p className="font-body">Loading...</p>;

  return (
    <div className="space-y-5 max-w-2xl">
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
          <Field label="Start" type="time" value={form.work_start} onChange={(e) => setForm({ ...form, work_start: e.target.value })} />
          <Field label="End" type="time" value={form.work_end} onChange={(e) => setForm({ ...form, work_end: e.target.value })} />
        </div>
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
        {save.isPending ? 'กำลังบันทึก...' : 'Save settings'}
      </Button>
    </div>
  );
}
