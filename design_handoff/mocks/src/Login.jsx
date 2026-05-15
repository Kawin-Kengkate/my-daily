/* Login — mobile, playful intro screen */

const LoginScreen = () => (
  <Phone>
    {/* decorative bg shapes */}
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'var(--lemon-soft)' }} />
      <div style={{ position: 'absolute', top: 110, left: -50, width: 160, height: 160, borderRadius: '50%', background: 'var(--peri-soft)' }} />
      <div style={{ position: 'absolute', bottom: 220, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'var(--mint-soft)' }} />
      <Star4 size={36} color="var(--tangerine)" style={{ position: 'absolute', top: 90, right: 80 }} />
      <Burst size={22} color="var(--lemon)" style={{ position: 'absolute', top: 320, left: 50, transform: 'rotate(20deg)' }} />
      <Star4 size={20} color="var(--peri)" style={{ position: 'absolute', bottom: 280, left: 40 }} />
    </div>

    <div style={{ position: 'relative', height: '100%', padding: '120px 32px 50px', display: 'flex', flexDirection: 'column' }}>
      {/* Logo lockup */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'var(--tangerine)',
          border: '1.5px solid var(--ink-900)',
          boxShadow: 'var(--shadow-stamp-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'rotate(-6deg)',
        }}>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, color: 'var(--paper)', letterSpacing: '-0.04em' }}>M</span>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 600, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>v.1.0 · personal</div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>My Daily</div>
        </div>
      </div>

      <h1 style={{
        fontFamily: 'var(--display)', fontWeight: 800,
        fontSize: 52, lineHeight: 0.95, letterSpacing: '-0.04em',
        margin: '40px 0 16px', color: 'var(--ink-900)',
      }}>
        บันทึก<br/>
        ทุกวัน<br/>
        <span style={{ color: 'var(--tangerine)', position: 'relative' }}>
          ได้ OT
          <svg viewBox="0 0 200 18" style={{ position: 'absolute', left: 0, right: 0, bottom: -8, width: '100%', height: 14 }} preserveAspectRatio="none">
            <path d="M 4 12 Q 50 2, 100 8 T 196 6" stroke="var(--lemon)" strokeWidth="5" fill="none" strokeLinecap="round"/>
          </svg>
        </span>
      </h1>

      <p style={{
        fontFamily: 'var(--body)', fontSize: 16, lineHeight: 1.5,
        color: 'var(--ink-500)', margin: '0 0 auto', maxWidth: 280,
      }}>
        กรอก daily log · ดู dashboard · คำนวณ OT ครบในที่เดียว — เฉพาะ kawinkengkate@gmail.com เท่านั้น
      </p>

      {/* Google sign-in button */}
      <button style={{
        marginTop: 32,
        width: '100%', padding: '18px 20px',
        background: 'var(--ink-900)', color: 'var(--paper)',
        border: '1.5px solid var(--ink-900)',
        borderRadius: 16,
        fontFamily: 'var(--display)', fontWeight: 600, fontSize: 17,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        boxShadow: '4px 4px 0 0 var(--tangerine)',
        cursor: 'pointer',
      }}>
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3a12 12 0 0 1-23.3-4 12 12 0 0 1 19.5-9.4l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3c-.5.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.4-.4-3.5z"/></svg>
        Continue with Google
      </button>

      {/* helper row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)' }}>
        <span>RLS enabled</span>
        <span>·</span>
        <span>whitelist only</span>
        <span>·</span>
        <span>built for 1</span>
      </div>

      {/* home indicator */}
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: 'var(--ink-900)' }} />
    </div>
  </Phone>
);

window.LoginScreen = LoginScreen;
