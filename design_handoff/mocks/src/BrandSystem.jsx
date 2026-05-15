/* Brand & system reference card */

const Swatch = ({ name, color, hex, fg = 'var(--ink-900)' }) => (
  <div style={{
    flex: 1,
    background: color, color: fg,
    border: '1.5px solid var(--ink-900)',
    borderRadius: 12,
    padding: '14px 14px 12px',
    boxShadow: '3px 3px 0 0 var(--ink-900)',
    minWidth: 0,
  }}>
    <div style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em' }}>{name}</div>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.7, marginTop: 32 }}>{hex}</div>
  </div>
);

const BrandSystem = () => (
  <div style={{
    width: 1280, height: 740,
    background: 'var(--cream-50)',
    fontFamily: 'var(--body)',
    color: 'var(--ink-900)',
    padding: 32, position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>brand · type · color</div>
      <h1 style={{ fontFamily: 'var(--display)', fontSize: 48, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.04em', lineHeight: 1 }}>
        ระบบที่ทำให้ <span style={{ color: 'var(--tangerine)' }}>เด้ง</span> แต่ <span style={{ color: 'var(--peri)' }}>คุม</span>
      </h1>
    </div>

    {/* Type stack */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 22 }}>
      <div style={{ background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Display</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)' }}>Bricolage Grotesque · variable · 700–800</span>
        </div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95 }}>เด้ง.</div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>164.5 ชั่วโมง</div>

        <hr style={{ border: 0, borderTop: '1px dashed var(--ink-200)', margin: '18px 0' }} />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Body</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)' }}>IBM Plex Sans Thai · 400 / 600</span>
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.45 }}>กรอก daily log ทุกวันทำงาน ดู dashboard รายเดือน และ copy ตาราง OT ไปกรอกฟอร์มเบิก — เร็ว สวย ไม่หาย</div>

        <hr style={{ border: 0, borderTop: '1px dashed var(--ink-200)', margin: '18px 0' }} />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mono</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)' }}>JetBrains Mono · 600 / 700</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700 }}>17:00 → 20:30 · ฿1,312</div>
      </div>

      {/* Sticker / accent gallery */}
      <div style={{ background: 'var(--paper)', border: '1.5px solid var(--ink-900)', borderRadius: 16, boxShadow: '4px 4px 0 0 var(--ink-900)', padding: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Stickers · stamps · accents</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <Sticker color="var(--tangerine)" rotate={-4} style={{ color: 'var(--paper)' }}>OT 1.5x</Sticker>
          <Sticker color="var(--lemon)" rotate={3}>วันหยุด 🎉</Sticker>
          <Sticker color="var(--mint)" rotate={-2}>✓ complete</Sticker>
          <Sticker color="var(--peri)" rotate={4} style={{ color: 'var(--paper)' }}>WFH</Sticker>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <Pill color="var(--peri-soft)" dot="var(--peri)">MFG-API</Pill>
          <Pill color="var(--lemon-soft)" dot="var(--lemon)">TAI</Pill>
          <Pill color="var(--mint-soft)" dot="var(--mint)">CMMS</Pill>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
          <Star4 size={24} color="var(--tangerine)" />
          <Star4 size={20} color="var(--lemon)" />
          <Burst size={26} color="var(--mint)" />
          <Burst size={20} color="var(--peri)" />
          <Squiggle width={80} color="var(--ink-900)" strokeWidth={3} />
        </div>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 700, position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>highlight word</span>
            <span style={{ position: 'absolute', inset: '6px -6px', background: 'var(--lemon)', borderRadius: 4, zIndex: 0, transform: 'rotate(-1deg)' }} />
          </span>
        </div>
      </div>
    </div>

    {/* Color row */}
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Palette</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)' }}>cream base + 4 accents · ทุกตัวมีหน้าที่</span>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Swatch name="cream-100" color="var(--cream-100)" hex="#F5EFE4 · canvas" />
        <Swatch name="paper" color="var(--paper)" hex="#FFFCF5 · cards" />
        <Swatch name="ink-900" color="var(--ink-900)" hex="#0F1B2D · text/stroke" fg="var(--paper)" />
        <Swatch name="tangerine" color="var(--tangerine)" hex="#FF6B35 · OT / money" fg="var(--paper)" />
        <Swatch name="lemon" color="var(--lemon)" hex="#F7C548 · holiday" />
        <Swatch name="mint" color="var(--mint)" hex="#4FB389 · done" fg="var(--paper)" />
        <Swatch name="peri" color="var(--peri)" hex="#6B7FE8 · project" fg="var(--paper)" />
        <Swatch name="rose" color="var(--rose)" hex="#F291A6 · leave" />
      </div>
    </div>

    {/* Decorative bg */}
    <Star4 size={36} color="var(--tangerine)" style={{ position: 'absolute', top: 30, right: 50, transform: 'rotate(20deg)' }}/>
    <Burst size={28} color="var(--lemon)" style={{ position: 'absolute', top: 90, right: 110 }}/>
  </div>
);

window.BrandSystem = BrandSystem;
