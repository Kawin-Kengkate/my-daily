/* OT Table — desktop, copy-friendly */

const OTTable = () => {
  const rows = [
    { date: '1 พ.ค.', day: 'ศ', wd: false, kind: 'หยุด', s: '—', e: '—', h15: 0, h3: 0, note: 'วันแรงงาน · พักจริง', amount: 0 },
    { date: '9 พ.ค.', day: 'ส', wd: false, kind: 'WFH+หยุด', s: '08:00', e: '18:00', h15: 8, h3: 1, note: 'เก็บงาน sprint TAI, SKR', amount: 5625 },
    { date: '11 พ.ค.', day: 'จ', wd: true, kind: 'WFH', s: '17:00', e: '20:30', h15: 3.5, h3: 0, note: 'integration test MFG-API', amount: 1312 },
    { date: '13 พ.ค.', day: 'พ', wd: true, kind: 'WFH', s: '17:00', e: '19:00', h15: 2, h3: 0, note: 'ตามแก้ comment PR', amount: 750 },
    { date: '14 พ.ค.', day: 'พฤ', wd: true, kind: 'WFH', s: '17:00', e: '20:30', h15: 3.5, h3: 0, note: 'schema TAI v2 (ต่อพรุ่งนี้)', amount: 1312 },
    { date: '22 พ.ค.', day: 'ศ', wd: true, kind: 'WFH', s: '17:00', e: '22:00', h15: 5, h3: 0, note: 'deploy MFG-API staging', amount: 1875 },
    { date: '23 พ.ค.', day: 'ส', wd: false, kind: 'WFH+หยุด', s: '08:00', e: '13:00', h15: 4, h3: 0, note: 'hotfix bug auth', amount: 1500 },
  ];
  const sum15 = rows.reduce((s, r) => s + r.h15, 0);
  const sum3  = rows.reduce((s, r) => s + r.h3, 0);
  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div style={{ width: 1280, height: 900, background: 'var(--cream-100)', fontFamily: 'var(--body)', color: 'var(--ink-900)', overflow: 'hidden', position: 'relative' }}>
      {/* Top nav (compact, same as dashboard) */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 32px', borderBottom: '1.5px solid var(--ink-900)', background: 'var(--paper)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--tangerine)', border: '1.5px solid var(--ink-900)', boxShadow: '2px 2px 0 0 var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}>
            <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 22, color: 'var(--paper)' }}>M</span>
          </div>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em' }}>My Daily</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 40 }}>
          {[{ l: 'Dashboard' }, { l: 'Daily' }, { l: 'OT Table', active: true }, { l: 'Projects' }, { l: 'Settings' }].map((t, i) => (
            <div key={i} style={{ padding: '8px 14px', borderRadius: 10, background: t.active ? 'var(--ink-900)' : 'transparent', color: t.active ? 'var(--paper)' : 'var(--ink-700)', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 14 }}>{t.l}</div>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--peri)', border: '1.5px solid var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--paper)' }}>K</div>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '28px 32px 18px', display: 'flex', alignItems: 'flex-end', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OT report · May 2026</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 44, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.04em', lineHeight: 1 }}>
            พร้อม <span style={{ color: 'var(--tangerine)' }}>copy</span> ไปกรอกฟอร์มเบิก
          </h1>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{ padding: '10px 14px', background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 10, boxShadow: '2px 2px 0 0 var(--ink-900)', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 13 }}>Filter ▾</button>
          <button style={{ padding: '10px 14px', background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 10, boxShadow: '2px 2px 0 0 var(--ink-900)', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 13 }}>May 2026 ▾</button>
          <button style={{ padding: '10px 16px', background: 'var(--ink-900)', color: 'var(--paper)', borderRadius: 10, boxShadow: '3px 3px 0 0 var(--lemon)', fontFamily: 'var(--display)', fontWeight: 700, fontSize: 13, border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 14 14"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="5" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            Copy table
          </button>
        </div>
      </div>

      {/* Summary band */}
      <div style={{ padding: '0 32px 18px', display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, padding: '14px 18px', background: 'var(--tangerine)', color: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 14, boxShadow: '4px 4px 0 0 var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.1em' }}>เงิน OT รวม</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginTop: 4 }}>฿{total.toLocaleString()}</div>
          </div>
          <Star4 size={28} color="var(--lemon)" />
        </div>
        <div style={{ flex: 1, padding: '14px 18px', background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 14, boxShadow: '4px 4px 0 0 var(--ink-900)' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>1.5x · ชม</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{sum15}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-500)' }}>ชั่วโมง</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)', marginTop: 4 }}>= ฿{(sum15 * 375).toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, padding: '14px 18px', background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 14, boxShadow: '4px 4px 0 0 var(--ink-900)' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>3x · ชม</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{sum3}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-500)' }}>ชั่วโมง</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)', marginTop: 4 }}>= ฿{(sum3 * 750).toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, padding: '14px 18px', background: 'var(--lemon-soft)', border: '1.5px solid var(--ink-900)', borderRadius: 14, boxShadow: '4px 4px 0 0 var(--ink-900)' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, color: 'var(--ink-700)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>วันที่มี OT</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{rows.filter(r => r.h15 + r.h3 > 0).length}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-500)' }}>/ {rows.length} วัน</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-700)', marginTop: 4 }}>2 วันหยุด · 4 วันธรรมดา</div>
        </div>
      </div>

      {/* The table */}
      <div style={{ padding: '0 32px' }}>
        <div style={{ background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)' }}>
            <thead>
              <tr style={{ background: 'var(--ink-900)', color: 'var(--paper)' }}>
                {['วันที่','วัน','ประเภท','เริ่ม','เลิก','1.5x ชม','3x ชม','รายละเอียด','เงิน (บาท)'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 14px', fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, textAlign: i >= 5 && i !== 7 ? 'right' : 'left', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const isHoliday = !r.wd;
                return (
                  <tr key={i} style={{ borderTop: '1px solid var(--cream-300)', background: isHoliday ? 'var(--lemon-soft)' : 'transparent' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--display)', fontWeight: 700, fontSize: 14 }}>{r.date}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, background: isHoliday ? 'var(--lemon)' : 'var(--peri-soft)', border: '1px solid var(--ink-900)', fontSize: 11, fontWeight: 700 }}>{r.day}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: r.kind === 'หยุด' ? 'var(--cream-200)' : (r.kind.includes('หยุด') ? 'var(--lemon)' : 'var(--peri-soft)'), border: '1px solid var(--ink-900)' }}>{r.kind}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 13, color: r.s === '—' ? 'var(--ink-300)' : 'var(--ink-900)' }}>{r.s}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 13, color: r.e === '—' ? 'var(--ink-300)' : 'var(--ink-900)' }}>{r.e}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: r.h15 ? 'var(--ink-900)' : 'var(--ink-300)' }}>{r.h15 || '—'}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: r.h3 ? 'var(--tangerine)' : 'var(--ink-300)' }}>{r.h3 || '—'}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--body)', fontSize: 13, color: 'var(--ink-700)' }}>{r.note}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--display)', fontSize: 14, fontWeight: 800, color: r.amount ? 'var(--ink-900)' : 'var(--ink-300)' }}>{r.amount ? `฿${r.amount.toLocaleString()}` : '—'}</td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: '2px solid var(--ink-900)', background: 'var(--cream-50)' }}>
                <td colSpan="5" style={{ padding: '14px 14px', fontFamily: 'var(--display)', fontWeight: 700, fontSize: 14, textAlign: 'right', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-700)' }}>รวม</td>
                <td style={{ padding: '14px 14px', textAlign: 'right', fontFamily: 'var(--display)', fontSize: 16, fontWeight: 800 }}>{sum15}</td>
                <td style={{ padding: '14px 14px', textAlign: 'right', fontFamily: 'var(--display)', fontSize: 16, fontWeight: 800, color: 'var(--tangerine)' }}>{sum3}</td>
                <td style={{ padding: '14px 14px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)' }}>baseHourly = ฿250 · {rows.filter(r => r.h15 + r.h3 > 0).length} วัน</td>
                <td style={{ padding: '14px 14px', textAlign: 'right', fontFamily: 'var(--display)', fontSize: 20, fontWeight: 800, color: 'var(--tangerine)' }}>฿{total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 14, alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)' }}>
          <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><span style={{ width: 10, height: 10, background: 'var(--lemon-soft)', border: '1.2px solid var(--ink-900)', borderRadius: 2 }}/>= วันหยุด</span>
          <span>·</span>
          <span>หักพัก 1 ชม. อัตโนมัติเมื่อทำเกิน 5 ชม.ติด</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sticker color="var(--mint)" rotate={2} style={{ fontSize: 10, padding: '3px 8px' }}>✓ 7 rows · ready to paste</Sticker>
          </span>
        </div>
      </div>
    </div>
  );
};

window.OTTable = OTTable;
