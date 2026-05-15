/* Daily Entry — Saturday (holiday) variant showing OT 3x breakdown */

const SatStatusPill = ({ label, active, color }) => (
  <div style={{
    flex: 1, padding: '10px 4px', borderRadius: 12,
    background: active ? color : 'transparent',
    border: active ? '1.5px solid var(--ink-900)' : '1.5px dashed var(--ink-300)',
    boxShadow: active ? '2px 2px 0 0 var(--ink-900)' : 'none',
    fontFamily: 'var(--display)', fontWeight: 600, fontSize: 13,
    textAlign: 'center', color: active ? 'var(--ink-900)' : 'var(--ink-500)',
    transform: active ? 'translate(-1px,-1px)' : 'none',
  }}>{label}</div>
);

const DailyEntrySat = () => (
  <Phone>
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 16px',
        background: 'var(--lemon-soft)',
        borderBottom: '1.5px solid var(--ink-900)',
        position: 'relative',
      }}>
        {/* holiday banner */}
        <Sticker color="var(--lemon)" rotate={-4} style={{ position: 'absolute', top: 46, right: 16, fontSize: 11, padding: '4px 10px' }}>
          🎉 วันหยุดราชการ
        </Sticker>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 6 }}>
          <button style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--ink-900)', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 0 var(--ink-900)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 1 L3 7 L9 13" stroke="var(--ink-900)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>วันเสาร์</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>9 พ.ค. 2026</div>
          </div>
          <button style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--ink-900)', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 0 var(--ink-900)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 1 L11 7 L5 13" stroke="var(--ink-900)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* AI suggestion banner */}
        <div style={{
          padding: 12,
          background: 'var(--paper)',
          border: '1.5px solid var(--ink-900)',
          borderRadius: 12,
          boxShadow: '3px 3px 0 0 var(--mint)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--mint)', border: '1.5px solid var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>💡</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>วันหยุดแต่ทำงาน? คิด OT 1.5x ทั้งวัน</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.4 }}>เลือก WFH/Onsite แล้วบล็อกเวลาเริ่ม-เลิก ระบบหักพัก 1 ชม. ให้อัตโนมัติ</div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>วันนี้ทำงานยังไง</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <SatStatusPill label="WFH" active color="var(--peri-soft)" />
            <SatStatusPill label="Onsite" color="var(--mint-soft)" />
            <SatStatusPill label="ลา" color="var(--rose-soft)" />
            <SatStatusPill label="หยุด" color="var(--lemon-soft)" />
          </div>
        </div>

        {/* Time block — single big one */}
        <div>
          <label style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Time block</label>
          <div style={{
            marginTop: 8,
            padding: 14,
            background: 'var(--paper)',
            border: '1.5px solid var(--ink-900)',
            borderRadius: 14,
            boxShadow: '3px 3px 0 0 var(--ink-900)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700 }}>08:00</span>
              <span style={{ flex: 1, height: 2, background: 'var(--ink-900)' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700 }}>18:00</span>
            </div>

            {/* OT breakdown bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', height: 28, borderRadius: 8, overflow: 'hidden', border: '1.5px solid var(--ink-900)' }}>
                <div style={{ flex: 8, background: 'var(--lemon)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1.5px solid var(--ink-900)', fontFamily: 'var(--display)', fontWeight: 700, fontSize: 11 }}>1.5x · 8h</div>
                <div style={{ flex: 1, background: 'var(--cream-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1.5px solid var(--ink-900)', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 9, color: 'var(--ink-500)' }}>พัก</div>
                <div style={{ flex: 1, background: 'var(--tangerine)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--paper)', fontFamily: 'var(--display)', fontWeight: 700, fontSize: 11 }}>3x · 1h</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)' }}>
                <span>8:00</span><span>17:00</span><span>18:00</span>
              </div>
            </div>

            {/* projects */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { code: 'TAI', bg: 'var(--lemon-soft)', task: 'เก็บงาน sprint — finalize migration', p: '95%' },
                { code: 'SKR', bg: 'var(--rose-soft)', task: 'ทดสอบ raw materials sync บน staging', p: 'complete' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--cream-50)', borderRadius: 10, border: '1px solid var(--cream-300)' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12, padding: '2px 6px', borderRadius: 4, background: p.bg, border: '1px solid var(--ink-900)' }}>{p.code}</span>
                  <span style={{ flex: 1, fontSize: 13 }}>{p.task}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: p.p === 'complete' ? 'var(--mint)' : 'var(--ink-700)' }}>{p.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Note */}
        <div>
          <label style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Note</label>
          <div style={{
            marginTop: 8, padding: 12, minHeight: 60,
            background: 'var(--lemon-soft)',
            border: '1.5px solid var(--ink-900)',
            borderRadius: 12,
            fontFamily: 'var(--body)', fontSize: 13, lineHeight: 1.4,
            position: 'relative',
          }}>
            <Tape width={48} rotate={-6} style={{ top: -10, left: 16 }} />
            ทีม PM ขอเก็บงานวันเสาร์ก่อน demo จันทร์
          </div>
        </div>
      </div>

      {/* Bottom: big OT breakdown */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px 26px', background: 'var(--paper)', borderTop: '1.5px solid var(--ink-900)' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
          <div style={{ flex: 1, padding: '8px 12px', background: 'var(--ink-900)', color: 'var(--paper)', borderRadius: 10 }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 9, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>OT รวมวันนี้</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>9</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6 }}>ชม</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lemon)', fontWeight: 700, marginTop: 2 }}>฿5,625</div>
          </div>
          <button style={{
            flex: 1, padding: '14px 16px',
            background: 'var(--tangerine)', color: 'var(--paper)',
            border: '1.5px solid var(--ink-900)', borderRadius: 12,
            boxShadow: '3px 3px 0 0 var(--ink-900)',
            fontFamily: 'var(--display)', fontWeight: 700, fontSize: 15,
          }}>Save day ✓</button>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: 'var(--ink-900)', zIndex: 60 }} />
    </div>
  </Phone>
);

window.DailyEntrySat = DailyEntrySat;
