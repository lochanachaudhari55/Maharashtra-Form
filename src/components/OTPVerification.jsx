import React, { useState, useRef, useEffect } from 'react';

export default function OTPVerification({ mobile, onVerified, onClose }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (sent && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) { setCanResend(true); clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sent, timer]);

  const handleSendOTP = () => {
    setSent(true);
    setTimer(30);
    setCanResend(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleResend = () => {
    handleSendOTP();
  };

  const handleChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setError('');
    if (value && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleVerify = () => {
    const entered = otp.join('');
    if (entered.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate: any 6-digit OTP works for demo
      setSuccess(true);
      setTimeout(() => { onVerified(); }, 1200);
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '36px 40px', width: 420,
        maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.25s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#003d7a', marginBottom: 4 }}>
              Mobile Verification
            </h2>
            <p style={{ fontSize: 13, color: '#666' }}>
              {sent
                ? <>OTP sent to <strong>+91 {mobile}</strong></>
                : <>Verify your mobile number <strong>+91 {mobile}</strong></>}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 22, color: '#999', lineHeight: 1, padding: 4,
          }}>✕</button>
        </div>

        {!sent ? (
          /* Send OTP Screen */
          <>
            <div style={{
              background: '#f0f7ff', border: '1px solid #cce0ff',
              borderRadius: 8, padding: '14px 16px', marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>📱</span>
                <div>
                  <p style={{ fontSize: 13, color: '#333', fontWeight: 600 }}>Send OTP to</p>
                  <p style={{ fontSize: 16, color: '#003d7a', fontWeight: 700 }}>+91 {mobile}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSendOTP}
              style={{
                width: '100%', background: '#003d7a', color: '#fff',
                border: 'none', borderRadius: 8, padding: '13px',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = '#005bb5'}
              onMouseLeave={e => e.target.style.background = '#003d7a'}
            >
              Send OTP
            </button>
            <button onClick={onClose} style={{
              width: '100%', background: 'none', border: '1px solid #dde3ec',
              borderRadius: 8, padding: '11px', fontSize: 13, color: '#666',
              cursor: 'pointer', marginTop: 10,
            }}>
              Cancel
            </button>
          </>
        ) : success ? (
          /* Success */
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{
              width: 64, height: 64, background: '#e8f5e9', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 32,
            }}>✓</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#2e7d32', marginBottom: 6 }}>
              Verified Successfully!
            </p>
            <p style={{ fontSize: 13, color: '#666' }}>Your mobile number has been verified.</p>
          </div>
        ) : (
          /* OTP Input Screen */
          <>
            {/* OTP boxes */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  style={{
                    width: 48, height: 56, textAlign: 'center',
                    fontSize: 22, fontWeight: 700, color: '#003d7a',
                    border: `2px solid ${digit ? '#003d7a' : error ? '#e53935' : '#cdd6e0'}`,
                    borderRadius: 8, outline: 'none',
                    background: digit ? '#f0f7ff' : '#fff',
                    transition: 'border 0.2s, background 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => e.target.style.borderColor = '#003d7a'}
                  onBlur={e => e.target.style.borderColor = digit ? '#003d7a' : '#cdd6e0'}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p style={{ fontSize: 12, color: '#e53935', textAlign: 'center', marginBottom: 12 }}>
                ⚠ {error}
              </p>
            )}

            {/* Timer / Resend */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {canResend ? (
                <button onClick={handleResend} style={{
                  background: 'none', border: 'none', color: '#003d7a',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
                }}>
                  Resend OTP
                </button>
              ) : (
                <p style={{ fontSize: 13, color: '#888' }}>
                  Resend OTP in{' '}
                  <span style={{ color: '#003d7a', fontWeight: 700 }}>0:{String(timer).padStart(2, '0')}</span>
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length < 6}
              style={{
                width: '100%', background: loading || otp.join('').length < 6 ? '#aaa' : '#003d7a',
                color: '#fff', border: 'none', borderRadius: 8, padding: '13px',
                fontSize: 14, fontWeight: 700,
                cursor: loading || otp.join('').length < 6 ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent',
                    borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite',
                  }} />
                  Verifying...
                </>
              ) : 'Verify OTP'}
            </button>

            <button onClick={onClose} style={{
              width: '100%', background: 'none', border: '1px solid #dde3ec',
              borderRadius: 8, padding: '11px', fontSize: 13, color: '#666',
              cursor: 'pointer', marginTop: 10,
            }}>
              Cancel
            </button>

            <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 14 }}>
              Didn't receive OTP? Check your SMS inbox or try resending.
            </p>
          </>
        )}

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
