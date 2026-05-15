/* Projects management — desktop */

const projectData = [
  { code: 'MFG-API', name: 'Manufacturing API', desc: 'REST API + auth + integration tests สำหรับโรงงาน', color: 'var(--peri)', soft: 'var(--peri-soft)', active: true, hours: 248, days: 32, tasks: 47, lastTouch: '14 พ.ค.', stars: 3 },
  { code: 'TAI',     name: 'Tractor Asset Inventory', desc: 'ระบบเก็บข้อมูล asset + schema v2 + migration', color: 'var(--lemon)', soft: 'var(--lemon-soft)', active: true, hours: 142, days: 19, tasks: 23, lastTouch: '14 พ.ค.', stars: 2 },
  { code: 'CMMS',    name: 'Computerized Maintenance Mgmt System', desc: 'รีวิว PR + standup + ดูแล production', color: 'var(--mint)', soft: 'var(--mint-soft)', active: true, hours: 96, days: 28, tasks: 34, lastTouch: '13 พ.ค.', stars: 1 },
  { code: 'SKR',     name: 'Siam Kubota Raw materials', desc: 'Sync raw materials กับระบบ ERP', color: 'var(--rose)', soft: 'var(--rose-soft)', active: true, hours: 64, days: 11, tasks: 18, lastTouch: '12 พ.ค.', stars: 1 },
  { code: 'etc',     name: 'งานเบ็ดเตล็ด', desc: 'งานเล็กๆ ที่ไม่อยู่ในโปรเจคหลัก — meeting, doc, support', color: 'var(--cream-300)', soft: 'var(--cream-200)', active: true, hours: 38, days: 22, tasks: 12, lastTouch: '10 พ.ค.', stars: 0 },
];

const Projects = () => (
  <div style={{ width: 1280, height: 900, background: 'var(--cream-100)', fontFamily: 'var(--body)', color: 'var(--ink-900)', overflow: 'hidden', position: 'relative' }}>
    {/* nav */}
    <div style={{ display: 'flex', alignItems: 'center', padding: '20px 32px', borderBottom: '1.5px solid var(--ink-900)', background: 'var(--paper)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--tangerine)', border: '1.5px solid var(--ink-900)', boxShadow: '2px 2px 0 0 var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 22, color: 'var(--paper)' }}>M</span>
        </div>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em' }}>My Daily</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginLeft: 40 }}>
        {[{ l: 'Dashboard' }, { l: 'Daily' }, { l: 'OT Table' }, { l: 'Projects', active: true }, { l: 'Settings' }].map((t, i) => (
          <div key={i} style={{ padding: '8px 14px', borderRadius: 10, background: t.active ? 'var(--ink-900)' : 'transparent', color: t.active ? 'var(--paper)' : 'var(--ink-700)', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 14 }}>{t.l}</div>
        ))}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--peri)', border: '1.5px solid var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--paper)' }}>K</div>
      </div>
    </div>

    {/* header */}
    <div style={{ padding: '32px 32px 20px', display: 'flex', alignItems: 'flex-end', gap: 24 }}>
      <div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>โปรเจคทั้งหมด · ตลอดกาล</div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 52, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.04em', lineHeight: 1 }}>
          5 โปรเจคที่ทำให้
          <span style={{ position: 'relative', display: 'inline-block', marginLeft: 12 }}>
            <span style={{ position: 'relative', zIndex: 1 }}>หมุน</span>
            <span style={{ position: 'absolute', inset: '4px -8px', background: 'var(--lemon)', borderRadius: 8, zIndex: 0, transform: 'rotate(-1deg)' }} />
          </span>
        </h1>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button style={{ padding: '10px 14px', background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 10, boxShadow: '2px 2px 0 0 var(--ink-900)', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 13 }}>Active only ▾</button>
        <button style={{ padding: '10px 16px', background: 'var(--ink-900)', color: 'var(--paper)', borderRadius: 10, boxShadow: '3px 3px 0 0 var(--tangerine)', fontFamily: 'var(--display)', fontWeight: 700, fontSize: 13, border: 'none' }}>+ New project</button>
      </div>
    </div>

    {/* cards grid */}
    <div style={{ padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
      {projectData.map((p, i) => (
        <div key={i} style={{
          padding: 18,
          background: 'var(--paper)',
          border: '1.5px solid var(--ink-900)',
          borderRadius: 16,
          boxShadow: '4px 4px 0 0 var(--ink-900)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* corner accent */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 80, height: 80, borderRadius: '50%', background: p.soft }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: p.color,
              border: '1.5px solid var(--ink-900)',
              boxShadow: '2px 2px 0 0 var(--ink-900)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transform: `rotate(${[-4, 3, -2, 4, 0][i]}deg)`,
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: p.code.length > 4 ? 11 : 14, color: p.color === 'var(--cream-300)' ? 'var(--ink-900)' : 'var(--paper)', letterSpacing: '-0.02em' }}>{p.code}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{p.name}</h3>
              <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                {[1,2,3].map((s) => (
                  <Star4 key={s} size={11} color={s <= p.stars ? 'var(--lemon)' : 'var(--cream-300)'} />
                ))}
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)', marginLeft: 6 }}>last · {p.lastTouch}</span>
              </div>
            </div>
            <button style={{ width: 26, height: 26, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-500)' }}>⋯</button>
          </div>

          <p style={{ position: 'relative', margin: '12px 0', fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.4, textWrap: 'pretty', minHeight: 36 }}>{p.desc}</p>

          {/* stat row */}
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 12, padding: '10px 0', borderTop: '1px dashed var(--ink-200)', borderBottom: '1px dashed var(--ink-200)' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hours</div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{p.hours}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Days</div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{p.days}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tasks ✓</div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--mint)' }}>{p.tasks}</div>
            </div>
          </div>

          {/* sparkline */}
          <div style={{ position: 'relative', marginTop: 12, display: 'flex', alignItems: 'flex-end', gap: 2, height: 32 }}>
            {Array.from({ length: 22 }).map((_, j) => {
              const seedH = [9,12,5,18,22,15,8,3,14,20,28,32,18,12,7,15,22,30,25,18,12,8][j];
              return (
                <div key={j} style={{ flex: 1, height: seedH, background: p.color, opacity: 0.4 + (seedH/40)*0.6, borderRadius: 1 }} />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-500)' }}>
            <span>22 wk ago</span><span>now</span>
          </div>
        </div>
      ))}

      {/* add new placeholder */}
      <div style={{
        padding: 18,
        background: 'transparent',
        border: '1.5px dashed var(--ink-300)',
        borderRadius: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 280,
        gap: 8,
        color: 'var(--ink-500)',
      }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--cream-100)', border: '1.5px dashed var(--ink-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: 30, color: 'var(--ink-300)' }}>+</div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 15, fontWeight: 600 }}>Add a new project</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)', textAlign: 'center', maxWidth: 200 }}>Code (เช่น MFG-API) + ชื่อเต็ม + description</div>
      </div>
    </div>
  </div>
);

window.Projects = Projects;
