/* Settings — desktop */

const Toggle = ({ on, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{
      display: 'inline-block', width: 44, height: 26, borderRadius: 14,
      background: on ? 'var(--mint)' : 'var(--cream-200)',
      border: '1.5px solid var(--ink-900)',
      position: 'relative', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 18, height: 18, borderRadius: '50%',
        background: 'var(--paper)', border: '1.5px solid var(--ink-900)',
        transition: 'left 0.15s',
      }} />
    </span>
    {label && <span style={{ fontSize: 13, color: 'var(--ink-700)' }}>{label}</span>}
  </div>
);

const Field = ({ label, value, suffix, hint, mono = true }) => (
  <div>
    <label style={{ fontFamily: 'var(--display)', fontSize: 11, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    <div style={{
      marginTop: 6,
      display: 'flex', alignItems: 'center',
      padding: '10px 14px',
      background: 'var(--cream-50)',
      border: '1.5px solid var(--ink-900)',
      borderRadius: 10,
      boxShadow: '2px 2px 0 0 var(--ink-900)',
    }}>
      <span style={{ flex: 1, fontFamily: mono ? 'var(--mono)' : 'var(--body)', fontSize: 14, fontWeight: 700 }}>{value}</span>
      {suffix && <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)' }}>{suffix}</span>}
    </div>
    {hint && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)', marginTop: 4 }}>{hint}</div>}
  </div>
);

const Settings = () => (
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
        {[{ l: 'Dashboard' }, { l: 'Daily' }, { l: 'OT Table' }, { l: 'Projects' }, { l: 'Settings', active: true }].map((t, i) => (
          <div key={i} style={{ padding: '8px 14px', borderRadius: 10, background: t.active ? 'var(--ink-900)' : 'transparent', color: t.active ? 'var(--paper)' : 'var(--ink-700)', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 14 }}>{t.l}</div>
        ))}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--peri)', border: '1.5px solid var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--paper)' }}>K</div>
      </div>
    </div>

    {/* header */}
    <div style={{ padding: '32px 32px 20px' }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Settings</div>
      <h1 style={{ fontFamily: 'var(--display)', fontSize: 44, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.04em', lineHeight: 1 }}>
        ตั้งค่าให้ <span style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{ position: 'relative', zIndex: 1 }}>OT คำนวณถูก</span>
          <svg viewBox="0 0 280 14" style={{ position: 'absolute', left: 0, right: 0, bottom: -2, width: '100%', height: 12, zIndex: 0 }} preserveAspectRatio="none">
            <path d="M 4 10 Q 70 2, 140 7 T 276 5" stroke="var(--tangerine)" strokeWidth="5" fill="none" strokeLinecap="round"/>
          </svg>
        </span>
      </h1>
    </div>

    {/* Two column body */}
    <div style={{ padding: '0 32px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18 }}>
      {/* LEFT — money + hours */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Salary card */}
        <div style={{ padding: 20, background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)', position: 'relative' }}>
          <Sticker color="var(--rose)" rotate={-3} style={{ position: 'absolute', top: -10, right: 18, fontSize: 10, padding: '3px 10px' }}>🔒 ความลับ</Sticker>
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>เงินเดือน + ฐาน OT</h3>
          <p style={{ margin: '6px 0 16px', fontSize: 12, color: 'var(--ink-500)' }}>เก็บใน <code style={{ fontFamily: 'var(--mono)', background: 'var(--cream-100)', padding: '1px 5px', borderRadius: 3 }}>user_settings.salary</code> · ไม่ encrypt แต่ ไม่ log</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="เงินเดือนรวม" value="•••••••" suffix="THB / เดือน" hint="กดดวงตาเพื่อเปิดดู" />
            <Field label="baseHourly (auto)" value="฿250.00" suffix="/ ชม" hint="salary ÷ 30 ÷ 8" />
            <Field label="1.5x rate" value="฿375.00" suffix="/ ชม" />
            <Field label="3x rate" value="฿750.00" suffix="/ ชม" />
          </div>
        </div>

        {/* Work hours card */}
        <div style={{ padding: 20, background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>เวลาทำงาน + กฎ OT</h3>
          <p style={{ margin: '6px 0 16px', fontSize: 12, color: 'var(--ink-500)' }}>ใช้ตอน aggregate · เปลี่ยนถ้าบริษัทย้ายกะ</p>

          {/* Timeline graphic */}
          <div style={{ position: 'relative', height: 56, marginBottom: 14, padding: '0 8px' }}>
            <div style={{ position: 'absolute', top: 22, left: 8, right: 8, height: 14, background: 'var(--cream-100)', borderRadius: 8, border: '1.5px solid var(--ink-900)', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '47%', background: 'var(--peri-soft)', borderRight: '1.5px solid var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700 }}>งานปกติ</div>
              <div style={{ width: '5%', background: 'repeating-linear-gradient(45deg, var(--cream-200) 0 4px, var(--cream-300) 4px 8px)', borderRight: '1.5px solid var(--ink-900)' }} />
              <div style={{ width: '48%', background: 'var(--tangerine)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: 'var(--paper)' }}>OT 1.5x</div>
            </div>
            {/* tick marks */}
            {[
              { left: '0%', l: '8:00' },
              { left: '47%', l: '16:40' },
              { left: '52%', l: '17:00' },
              { left: '100%', l: '23:00' },
            ].map((t, i) => (
              <span key={i} style={{ position: 'absolute', top: 38, left: `calc(${t.left} + 8px)`, transform: 'translateX(-50%)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>{t.l}</span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <Field label="เริ่มงาน" value="08:00" />
            <Field label="พักกินข้าวเที่ยง" value="40" suffix="นาที" hint="รวมในเวลางาน" />
            <Field label="พักก่อน OT" value="16:40 → 17:00" mono={false} hint="ไม่นับเงิน" />
          </div>

          <div style={{ marginTop: 14, padding: 12, background: 'var(--lemon-soft)', border: '1.5px dashed var(--ink-900)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--lemon)', border: '1.5px solid var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>⚠</div>
            <div style={{ flex: 1, fontSize: 12, lineHeight: 1.4 }}>หักพัก 1 ชม. อัตโนมัติเมื่อทำงานต่อเนื่อง <b>เกิน 5 ชม.</b></div>
            <Toggle on={true} />
          </div>
        </div>
      </div>

      {/* RIGHT — holidays + account */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Account */}
        <div style={{ padding: 20, background: 'var(--ink-900)', color: 'var(--paper)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--tangerine)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--peri)', border: '1.5px solid var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 24 }}>K</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Kawin Kengkate</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7 }}>kawinkengkate@gmail.com</div>
            </div>
            <Pill color="var(--mint)" dot={null} style={{ color: 'var(--ink-900)', border: '1.5px solid var(--paper)' }}>whitelisted</Pill>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
            <button style={{ flex: 1, padding: '8px 12px', background: 'transparent', color: 'var(--paper)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 8, fontFamily: 'var(--display)', fontWeight: 600, fontSize: 12 }}>Export ข้อมูล</button>
            <button style={{ flex: 1, padding: '8px 12px', background: 'transparent', color: 'var(--paper)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 8, fontFamily: 'var(--display)', fontWeight: 600, fontSize: 12 }}>Sign out</button>
          </div>
        </div>

        {/* Holidays */}
        <div style={{ padding: 20, background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>วันหยุดราชการ 2026</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--ink-500)' }}>static · อัพเดทมือปีละครั้ง</p>
            </div>
            <button style={{ padding: '6px 12px', background: 'var(--lemon)', border: '1.5px solid var(--ink-900)', borderRadius: 8, boxShadow: '2px 2px 0 0 var(--ink-900)', fontFamily: 'var(--display)', fontWeight: 700, fontSize: 12 }}>+ เพิ่ม</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflow: 'hidden' }}>
            {[
              { d: '1 ม.ค.', n: 'วันขึ้นปีใหม่', past: true },
              { d: '10 ก.พ.', n: 'วันมาฆบูชา', past: true },
              { d: '6 เม.ย.', n: 'วันจักรี', past: true },
              { d: '13–15 เม.ย.', n: 'วันสงกรานต์', past: true },
              { d: '1 พ.ค.', n: 'วันแรงงานแห่งชาติ', past: true },
              { d: '4 พ.ค.', n: 'วันฉัตรมงคล', past: true },
              { d: '1 มิ.ย.', n: 'วันวิสาขบูชา', past: false, next: true },
              { d: '28 ก.ค.', n: 'วันเฉลิม ร.10', past: false },
              { d: '12 ส.ค.', n: 'วันแม่แห่งชาติ', past: false },
              { d: '13 ต.ค.', n: 'วันคล้ายวันสวรรคต ร.9', past: false },
            ].map((h, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 10px', borderRadius: 8,
                background: h.next ? 'var(--lemon-soft)' : 'transparent',
                border: h.next ? '1.5px solid var(--ink-900)' : '1px solid var(--cream-300)',
                opacity: h.past ? 0.45 : 1,
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12, width: 80 }}>{h.d}</span>
                <span style={{ flex: 1, fontSize: 13 }}>{h.n}</span>
                {h.next && <Pill color="var(--lemon)" style={{ fontSize: 9 }}>next ↗</Pill>}
                {h.past && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)' }}>past</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.Settings = Settings;
