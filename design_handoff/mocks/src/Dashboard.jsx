/* Dashboard — desktop, hero */

const StatBlock = ({ label, value, unit, sub, bg, accent, rotate = 0 }) => (
  <div style={{
    flex: 1,
    padding: '18px 20px',
    background: bg,
    border: '1.5px solid var(--ink-900)',
    borderRadius: 16,
    boxShadow: '4px 4px 0 0 var(--ink-900)',
    transform: `rotate(${rotate}deg)`,
    position: 'relative',
    minWidth: 0,
  }}>
    <div style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, color: 'var(--ink-700)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
      <span style={{ fontFamily: 'var(--display)', fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>{value}</span>
      {unit && <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink-500)' }}>{unit}</span>}
    </div>
    {sub && <div style={{ marginTop: 8, fontFamily: 'var(--body)', fontSize: 12, color: 'var(--ink-700)' }}>{sub}</div>}
    {accent}
  </div>
);

/* Calendar heatmap */
const CalHeat = () => {
  // 31 days of May 2026; first day = Friday (col 4)
  // map index -> {kind} : 'wfh' | 'onsite' | 'leave' | 'holiday' | 'wknd' | 'ot' | 'future'
  const days = [];
  // pad before
  for (let i = 0; i < 4; i++) days.push({ pad: true });
  const may = [
    'h','h',                        // 1 Fri (holiday labour day), 2 Sat
    'wknd',                         // 3 Sun
    'wfh','wfh','wfh','wfh','wfh',  // 4-8 Mon-Fri
    'ot','wknd',                    // 9 Sat (worked OT), 10 Sun
    'wfh','onsite','wfh','wfh-ot',  // 11-14
    'leave','wknd','wknd',          // 15 Fri leave, 16 Sat, 17 Sun
    'wfh','wfh','wfh','onsite','wfh-ot', // 18-22
    'wknd','wknd',                  // 23-24
    'wfh','wfh','wfh','wfh','wfh',  // 25-29
    'wknd','wknd',                  // 30-31
  ];
  may.forEach((k, i) => days.push({ kind: k, day: i + 1 }));

  const colorFor = (k) => {
    if (k === 'wfh') return 'var(--peri-soft)';
    if (k === 'wfh-ot') return 'var(--tangerine)';
    if (k === 'onsite') return 'var(--mint-soft)';
    if (k === 'leave') return 'var(--rose-soft)';
    if (k === 'h') return 'var(--lemon-soft)';
    if (k === 'ot') return 'var(--tangerine-soft)';
    if (k === 'wknd') return 'var(--cream-100)';
    return 'transparent';
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontFamily: 'var(--display)', fontSize: 10, fontWeight: 700, color: 'var(--ink-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', color: (i===0||i===6) ? 'var(--ink-300)' : 'var(--ink-500)' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((d, i) => d.pad ? (
          <div key={i} />
        ) : (
          <div key={i} style={{
            aspectRatio: '1',
            background: colorFor(d.kind),
            border: '1.2px solid var(--ink-900)',
            borderRadius: 6,
            padding: 4,
            position: 'relative',
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            color: d.kind === 'wfh-ot' ? 'var(--paper)' : 'var(--ink-900)',
          }}>
            {d.day}
            {d.kind === 'wfh-ot' && <Star4 size={8} color="var(--lemon)" style={{ position: 'absolute', bottom: 3, right: 3 }}/>}
            {d.kind === 'ot' && <Star4 size={8} color="var(--tangerine)" style={{ position: 'absolute', bottom: 3, right: 3 }}/>}
            {d.kind === 'h' && <span style={{ position: 'absolute', bottom: 2, right: 4, fontSize: 9 }}>🎉</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

/* Hours bar chart */
const HoursBars = () => {
  const data = [
    { w: 'W18', reg: 40, ot: 0 },
    { w: 'W19', reg: 40, ot: 3.5 },
    { w: 'W20', reg: 32, ot: 12.5 },
    { w: 'W21', reg: 40, ot: 8 },
    { w: 'W22 ›', reg: 32, ot: 3.5, current: true },
  ];
  const max = 55;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, padding: '0 4px' }}>
      {data.map((d, i) => {
        const regH = (d.reg / max) * 150;
        const otH = (d.ot / max) * 150;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -2, fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink-700)' }}>{(d.reg + d.ot).toFixed(0)}h</div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 150, marginTop: 14 }}>
              {d.ot > 0 && (
                <div style={{ width: '100%', height: otH, background: 'var(--tangerine)', border: '1.5px solid var(--ink-900)', borderBottom: 'none', borderTopLeftRadius: 6, borderTopRightRadius: 6 }} />
              )}
              <div style={{ width: '100%', height: regH, background: d.current ? 'var(--lemon)' : 'var(--peri-soft)', border: '1.5px solid var(--ink-900)', borderTopLeftRadius: d.ot > 0 ? 0 : 6, borderTopRightRadius: d.ot > 0 ? 0 : 6 }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: d.current ? 'var(--ink-900)' : 'var(--ink-500)' }}>{d.w}</div>
          </div>
        );
      })}
    </div>
  );
};

/* Project donut + breakdown */
const ProjectBreakdown = () => {
  const items = [
    { code: 'MFG-API', pct: 38, color: 'var(--peri)', hours: 62.5, complete: 8 },
    { code: 'TAI',     pct: 28, color: 'var(--lemon)', hours: 46, complete: 3 },
    { code: 'CMMS',    pct: 18, color: 'var(--mint)', hours: 29.5, complete: 12 },
    { code: 'SKR',     pct: 10, color: 'var(--rose)', hours: 16.5, complete: 4 },
    { code: 'etc',     pct:  6, color: 'var(--cream-300)', hours: 10, complete: 0 },
  ];
  let acc = 0;
  const C = 2 * Math.PI * 42;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" width="140" height="140">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ink-900)" strokeWidth="1.5" />
          {items.map((it, i) => {
            const len = (it.pct / 100) * C;
            const dash = `${len} ${C - len}`;
            const off = -((acc / 100) * C);
            acc += it.pct;
            return (
              <circle key={i} cx="50" cy="50" r="42" fill="none"
                stroke={it.color} strokeWidth="14"
                strokeDasharray={dash} strokeDashoffset={off}
                transform="rotate(-90 50 50)" />
            );
          })}
          <circle cx="50" cy="50" r="35" fill="var(--paper)" stroke="var(--ink-900)" strokeWidth="1.5" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>164.5</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)', marginTop: 2 }}>hours · 5 projects</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: it.color, border: '1.2px solid var(--ink-900)' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, width: 70 }}>{it.code}</span>
            <span style={{ flex: 1, height: 6, background: 'var(--cream-100)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--ink-200)' }}>
              <span style={{ display: 'block', width: `${it.pct * 2.5}%`, height: '100%', background: it.color }} />
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, width: 38, textAlign: 'right' }}>{it.hours}h</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--mint)', width: 42, textAlign: 'right' }}>{it.complete}✓</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => (
  <div style={{
    width: 1280, height: 900,
    background: 'var(--cream-100)',
    fontFamily: 'var(--body)',
    color: 'var(--ink-900)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Top nav */}
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '20px 32px',
      borderBottom: '1.5px solid var(--ink-900)',
      background: 'var(--paper)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--tangerine)', border: '1.5px solid var(--ink-900)', boxShadow: '2px 2px 0 0 var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 22, color: 'var(--paper)', letterSpacing: '-0.04em' }}>M</span>
        </div>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em' }}>My Daily</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginLeft: 40 }}>
        {[
          { l: 'Dashboard', active: true },
          { l: 'Daily' },
          { l: 'OT Table' },
          { l: 'Projects' },
          { l: 'Settings' },
        ].map((t, i) => (
          <div key={i} style={{
            padding: '8px 14px', borderRadius: 10,
            background: t.active ? 'var(--ink-900)' : 'transparent',
            color: t.active ? 'var(--paper)' : 'var(--ink-700)',
            fontFamily: 'var(--display)', fontWeight: 600, fontSize: 14,
          }}>{t.l}</div>
        ))}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--cream-100)', borderRadius: 999, border: '1px solid var(--ink-200)' }}>
          <span style={{ width: 8, height: 8, borderRadius: 8, background: 'var(--mint)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600 }}>synced 2m ago</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--peri)', border: '1.5px solid var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--paper)' }}>K</div>
      </div>
    </div>

    {/* Hero header */}
    <div style={{ padding: '32px 32px 24px', display: 'flex', alignItems: 'flex-end', gap: 40 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>พฤษภาคม 2026</span>
          <Sticker color="var(--mint)" rotate={-3} style={{ fontSize: 10, padding: '2px 8px' }}>21 / 22 วันกรอกแล้ว</Sticker>
        </div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, margin: 0, position: 'relative', display: 'inline-block' }}>
          เดือนนี้เก็บงาน
          <span style={{ color: 'var(--tangerine)' }}> 164.5</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 600, color: 'var(--ink-500)', marginLeft: 8 }}>ชั่วโมง</span>
          <Star4 size={26} color="var(--lemon)" style={{ position: 'absolute', top: -10, right: -32 }} />
        </h1>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button style={{ padding: '10px 14px', background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 10, boxShadow: '2px 2px 0 0 var(--ink-900)', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 13 }}>‹ Apr</button>
        <button style={{ padding: '10px 14px', background: 'var(--lemon)', border: '1.5px solid var(--ink-900)', borderRadius: 10, boxShadow: '2px 2px 0 0 var(--ink-900)', fontFamily: 'var(--display)', fontWeight: 700, fontSize: 13 }}>May 2026</button>
        <button style={{ padding: '10px 14px', background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 10, boxShadow: '2px 2px 0 0 var(--ink-900)', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 13, opacity: 0.5 }}>Jun ›</button>
      </div>
    </div>

    {/* Stat row */}
    <div style={{ padding: '0 32px', display: 'flex', gap: 14, marginBottom: 24 }}>
      <StatBlock label="OT ชั่วโมง" value="27.5" unit="ชม" sub="เทียบ Apr: +5.5h ▲" bg="var(--tangerine)" rotate={-0.6} accent={<Star4 size={20} color="var(--lemon)" style={{ position: 'absolute', top: 14, right: 14 }} />} />
      <StatBlock label="OT เงินได้" value="฿11,680" sub="1.5x · 22h | 3x · 5.5h" bg="var(--paper)" accent={<Burst size={22} color="var(--mint)" style={{ position: 'absolute', top: 14, right: 14, transform: 'rotate(15deg)' }} />} />
      <StatBlock label="WFH / Onsite" value="14/5" unit="วัน" sub="ลา 1 · หยุดทำงาน 1" bg="var(--peri-soft)" rotate={0.6} />
      <StatBlock label="โปรเจคที่แตะ" value="5" sub="MFG-API นำ 38% · 27✓ tasks done" bg="var(--lemon-soft)" />
    </div>

    {/* Grid: calendar + hours bars + project breakdown */}
    <div style={{ padding: '0 32px', display: 'grid', gridTemplateColumns: '1.1fr 1fr 1.2fr', gap: 14 }}>
      {/* Calendar */}
      <div style={{ background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)', padding: 18, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>May at a glance</h3>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)' }}>tap วัน เพื่อดู entry</span>
        </div>
        <CalHeat />
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-700)' }}>
          {[
            { c: 'var(--peri-soft)', l: 'WFH' },
            { c: 'var(--mint-soft)', l: 'Onsite' },
            { c: 'var(--rose-soft)', l: 'ลา' },
            { c: 'var(--lemon-soft)', l: 'หยุด' },
            { c: 'var(--tangerine)', l: 'WFH+OT' },
          ].map((x, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, background: x.c, border: '1.2px solid var(--ink-900)', borderRadius: 3 }}/>{x.l}
            </span>
          ))}
        </div>
      </div>

      {/* Weekly hours */}
      <div style={{ background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)', padding: 18, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>ชั่วโมง / สัปดาห์</h3>
          <div style={{ display: 'flex', gap: 8, fontFamily: 'var(--mono)', fontSize: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: 'var(--peri-soft)', border: '1.2px solid var(--ink-900)', borderRadius: 3 }} />Regular</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: 'var(--tangerine)', border: '1.2px solid var(--ink-900)', borderRadius: 3 }} />OT</span>
          </div>
        </div>
        <HoursBars />
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px dashed var(--ink-200)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11 }}>
          <span style={{ color: 'var(--ink-500)' }}>เฉลี่ย <b style={{ color: 'var(--ink-900)' }}>40.4h</b>/สัปดาห์</span>
          <span style={{ color: 'var(--ink-500)' }}>สัปดาห์นี้ <b style={{ color: 'var(--tangerine)' }}>+3.5h OT</b></span>
        </div>
      </div>

      {/* Projects breakdown */}
      <div style={{ background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)', padding: 18, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>โปรเจคเดือนนี้</h3>
          <Pill color="var(--lemon-soft)" style={{ fontFamily: 'var(--mono)', fontSize: 10 }}>5 active</Pill>
        </div>
        <ProjectBreakdown />
      </div>
    </div>

    {/* Recent entries strip */}
    <div style={{ padding: '14px 32px 0' }}>
      <div style={{ background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)', padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Recent entries</h3>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)' }}>last 5 days</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {[
            { d: '14 พฤ', tag: 'WFH · OT', tagBg: 'var(--tangerine)', tagFg: 'var(--paper)', hours: '11.5h', projects: ['MFG-API','CMMS','TAI'], note: 'แก้ bug auth + เริ่ม schema TAI v2' },
            { d: '13 พ',  tag: 'WFH',      tagBg: 'var(--peri-soft)', tagFg: 'var(--ink-900)', hours: '8h',  projects: ['MFG-API','CMMS'], note: 'standup + รีวิว PRs' },
            { d: '12 อ',  tag: 'Onsite',   tagBg: 'var(--mint-soft)', tagFg: 'var(--ink-900)', hours: '8h',  projects: ['SKR','MFG-API'], note: 'meeting ที่ลูกค้า — UAT walkthrough' },
            { d: '11 จ',  tag: 'WFH',      tagBg: 'var(--peri-soft)', tagFg: 'var(--ink-900)', hours: '8h',  projects: ['MFG-API'], note: 'ปั่น integration test ครบ' },
            { d: '9 ส',   tag: 'หยุด · OT', tagBg: 'var(--lemon)',    tagFg: 'var(--ink-900)', hours: '9h',  projects: ['TAI','SKR'], note: 'เก็บงาน sprint ก่อน demo' },
          ].map((e, i) => (
            <div key={i} style={{ padding: 10, background: 'var(--cream-50)', border: '1px solid var(--cream-300)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700 }}>{e.d}</span>
                <span style={{ fontFamily: 'var(--display)', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: e.tagBg, color: e.tagFg, border: '1px solid var(--ink-900)' }}>{e.tag}</span>
              </div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>{e.hours}</div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 6, marginBottom: 6 }}>
                {e.projects.map((p, j) => <span key={j} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'var(--paper)', border: '1px solid var(--ink-300)' }}>{p}</span>)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-700)', lineHeight: 1.3, textWrap: 'pretty' }}>{e.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

window.Dashboard = Dashboard;
