/* Daily Entry — mobile flagship */

const StatusPill = ({ label, active, color }) => (
  <div style={{
    flex: 1,
    padding: '10px 4px',
    borderRadius: 12,
    background: active ? color : 'transparent',
    border: active ? '1.5px solid var(--ink-900)' : '1.5px dashed var(--ink-300)',
    boxShadow: active ? '2px 2px 0 0 var(--ink-900)' : 'none',
    fontFamily: 'var(--display)', fontWeight: 600, fontSize: 13,
    textAlign: 'center', color: active ? 'var(--ink-900)' : 'var(--ink-500)',
    transform: active ? 'translate(-1px,-1px)' : 'none',
  }}>{label}</div>
);

const TimeBlock = ({ start, end, projects, color, kind }) => (
  <div style={{
    background: 'var(--paper)',
    border: '1.5px solid var(--ink-900)',
    borderRadius: 14,
    boxShadow: '3px 3px 0 0 var(--ink-900)',
    padding: 12,
    position: 'relative',
  }}>
    {/* time row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700,
        letterSpacing: '-0.02em',
      }}>{start}</span>
      <span style={{ flex: 1, height: 2, background: 'var(--ink-900)', borderRadius: 2, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 0, top: -3, width: 8, height: 8, borderRadius: 8, background: color, border: '1.5px solid var(--ink-900)' }} />
        <span style={{ position: 'absolute', right: 0, top: -3, width: 8, height: 8, borderRadius: 8, background: color, border: '1.5px solid var(--ink-900)' }} />
      </span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700 }}>{end}</span>
      {kind && (
        <span style={{
          fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700,
          padding: '2px 8px', borderRadius: 999,
          background: color, color: 'var(--ink-900)',
          border: '1.5px solid var(--ink-900)',
        }}>{kind}</span>
      )}
    </div>
    {/* projects */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {projects.map((p, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', background: 'var(--cream-50)',
          borderRadius: 10, border: '1px solid var(--cream-300)',
        }}>
          <span style={{
            fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12,
            padding: '2px 6px', borderRadius: 4,
            background: p.codeBg, color: 'var(--ink-900)',
            border: '1px solid var(--ink-900)',
          }}>{p.code}</span>
          <span style={{ flex: 1, fontSize: 13, lineHeight: 1.3 }}>{p.task}</span>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
            color: p.progress === 'complete' ? 'var(--mint)' : 'var(--ink-700)',
          }}>{p.progress}</span>
        </div>
      ))}
    </div>
  </div>
);

const DailyEntry = () => (
  <Phone>
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Top header */}
      <div style={{
        padding: '52px 20px 16px',
        background: 'var(--cream-100)',
        borderBottom: '1.5px solid var(--ink-900)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button style={{
            width: 38, height: 38, borderRadius: 10,
            border: '1.5px solid var(--ink-900)', background: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '2px 2px 0 0 var(--ink-900)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 1 L3 7 L9 13" stroke="var(--ink-900)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>วันพฤหัสบดี</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>14 พ.ค. 2026</div>
            <Star4 size={14} color="var(--tangerine)" style={{ position: 'absolute', top: -4, right: -16 }}/>
          </div>
          <button style={{
            width: 38, height: 38, borderRadius: 10,
            border: '1.5px solid var(--ink-900)', background: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '2px 2px 0 0 var(--ink-900)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 1 L11 7 L5 13" stroke="var(--ink-900)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Date strip */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
          {['ส','อา','จ','อ','พ','พฤ','ศ'].map((d, i) => {
            const num = [9,10,11,12,13,14,15][i];
            const isWknd = i < 2;
            const isToday = i === 5;
            return (
              <div key={i} style={{
                flex: 1, textAlign: 'center', padding: '6px 0',
                borderRadius: 10,
                background: isToday ? 'var(--tangerine)' : 'transparent',
                border: isToday ? '1.5px solid var(--ink-900)' : 'none',
                color: isToday ? 'var(--paper)' : (isWknd ? 'var(--ink-300)' : 'var(--ink-900)'),
                fontFamily: 'var(--display)',
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{d}</div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{num}</div>
                {/* dots = entries */}
                {!isWknd && !isToday && <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 3 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 4, background: 'var(--mint)' }} />
                  {i % 2 === 0 && <span style={{ width: 4, height: 4, borderRadius: 4, background: 'var(--tangerine)' }} />}
                </div>}
                {isToday && <div style={{ width: 4, height: 4, borderRadius: 4, background: 'var(--paper)', margin: '3px auto 0' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Status picker */}
        <div>
          <label style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>วันนี้ทำงานยังไง</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <StatusPill label="WFH" active color="var(--peri-soft)" />
            <StatusPill label="Onsite" color="var(--mint-soft)" />
            <StatusPill label="ลา" color="var(--rose-soft)" />
            <StatusPill label="Training" color="var(--lemon-soft)" />
          </div>
        </div>

        {/* Quick presets */}
        <div style={{
          padding: 10,
          background: 'var(--lemon-soft)',
          border: '1.5px dashed var(--ink-900)',
          borderRadius: 12,
          position: 'relative',
        }}>
          <Sticker color="var(--lemon)" rotate={-4} style={{ position: 'absolute', top: -10, left: 12, fontSize: 11, padding: '3px 8px' }}>⚡ Quick presets</Sticker>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'งานปกติ', sub: '8:00–16:40', color: 'var(--paper)' },
              { label: 'OT จนทุ่ม', sub: '8:00–20:00', color: 'var(--tangerine-soft)' },
              { label: 'เหมือนเมื่อวาน', sub: 'duplicate', color: 'var(--mint-soft)' },
            ].map((p, i) => (
              <button key={i} style={{
                flex: 1, minWidth: 100,
                padding: '8px 10px',
                background: p.color,
                border: '1.5px solid var(--ink-900)',
                borderRadius: 10,
                boxShadow: '2px 2px 0 0 var(--ink-900)',
                fontFamily: 'var(--display)',
                textAlign: 'left',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>{p.label}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)', marginTop: 2 }}>{p.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time blocks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Time blocks · 2 entries</label>
            <button style={{
              fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700,
              padding: '4px 10px', borderRadius: 8,
              background: 'var(--ink-900)', color: 'var(--paper)',
              border: 'none',
            }}>+ Add</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <TimeBlock
              start="08:00" end="16:40" color="var(--peri)"
              projects={[
                { code: 'MFG-API', codeBg: 'var(--peri-soft)', task: 'แก้ bug auth flow + integration test', progress: '90%' },
                { code: 'CMMS', codeBg: 'var(--mint-soft)', task: 'รีวิว PR + standup', progress: 'complete' },
              ]}
            />
            <TimeBlock
              start="17:00" end="20:30" color="var(--tangerine)" kind="OT 1.5x"
              projects={[
                { code: 'TAI', codeBg: 'var(--lemon-soft)', task: 'เริ่ม schema สำหรับ asset inventory v2', progress: '30%' },
              ]}
            />
          </div>
        </div>

        {/* Recent projects */}
        <div>
          <label style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent · tap เพื่อเพิ่ม</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {[
              { c: 'TAI', bg: 'var(--lemon-soft)' },
              { c: 'MFG-API', bg: 'var(--peri-soft)' },
              { c: 'SKR', bg: 'var(--rose-soft)' },
              { c: 'CMMS', bg: 'var(--mint-soft)' },
              { c: 'etc', bg: 'var(--cream-200)' },
            ].map((p, i) => (
              <button key={i} style={{
                padding: '5px 10px', borderRadius: 999,
                background: p.bg, border: '1.5px solid var(--ink-900)',
                fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12,
                color: 'var(--ink-900)',
              }}>+ {p.c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom OT preview + Save */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 20px 26px',
        background: 'var(--paper)',
        borderTop: '1.5px solid var(--ink-900)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            flex: 1, padding: '8px 12px',
            background: 'var(--tangerine)', color: 'var(--paper)',
            borderRadius: 10, border: '1.5px solid var(--ink-900)',
          }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 10, fontWeight: 600, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em' }}>OT วันนี้</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>3.5</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, opacity: 0.85 }}>ชม · 1.5x</span>
              <span style={{ flex: 1, textAlign: 'right', fontFamily: 'var(--display)', fontSize: 16, fontWeight: 700 }}>฿1,312</span>
            </div>
          </div>
          <button style={{
            padding: '14px 20px',
            background: 'var(--ink-900)', color: 'var(--paper)',
            border: '1.5px solid var(--ink-900)', borderRadius: 12,
            boxShadow: '3px 3px 0 0 var(--lemon)',
            fontFamily: 'var(--display)', fontWeight: 700, fontSize: 15,
          }}>Save</button>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: 'var(--ink-900)', zIndex: 60 }} />
    </div>
  </Phone>
);

window.DailyEntry = DailyEntry;
