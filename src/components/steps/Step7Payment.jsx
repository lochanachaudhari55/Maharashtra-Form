import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Input, Select, Alert, ErrorBanner } from '../UI';
import { validateStep7Payment } from '../../utils/validate';

const ICON_PAY = 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z';
const FEE = '2000';

const BANKS = [
  '','State Bank of India','Bank of Maharashtra','Punjab National Bank',
  'Bank of Baroda','Canara Bank','Union Bank of India','HDFC Bank','ICICI Bank',
  'Axis Bank','Kotak Mahindra Bank','IDBI Bank','Yes Bank','IndusInd Bank',
  'Federal Bank','South Indian Bank','UCO Bank','Bank of India',
];

/* ══════════════════════════════════════════
   QR Code SVG Generator (real QR structure)
══════════════════════════════════════════ */
function QRCodeSVG({ seed = 'msbvett@upi' }) {
  const N = 25;
  const CELL = 8;
  const TOTAL = N * CELL;

  // Finder pattern positions: top-left, top-right, bottom-left
  const finder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c > N - 8) || (r > N - 8 && c < 7);
  const finderWhite = (r, c) =>
    (r >= 1 && r <= 5 && c >= 1 && c <= 5) ||
    (r >= 1 && r <= 5 && c >= N - 6 && c <= N - 2) ||
    (r >= N - 6 && r <= N - 2 && c >= 1 && c <= 5);
  const finderBlack = (r, c) =>
    (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
    (r >= 2 && r <= 4 && c >= N - 5 && c <= N - 3) ||
    (r >= N - 5 && r <= N - 3 && c >= 2 && c <= 4);
  const timing = (r, c) =>
    (r === 6 && c >= 8 && c <= N - 9) || (c === 6 && r >= 8 && r <= N - 9);
  const alignment = (r, c) => r >= N-9 && r <= N-5 && c >= N-9 && c <= N-5;

  // Pseudo-random data based on seed
  const hash = seed.split('').reduce((a, ch) => ((a << 5) - a + ch.charCodeAt(0)) | 0, 0);
  const data = (r, c) => ((hash * 7 + r * 31 + c * 17) % 5) < 2;

  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let black = false;
      if (finder(r, c))      black = !finderWhite(r, c) || finderBlack(r, c);
      else if (timing(r, c)) black = (r + c) % 2 === 0;
      else if (alignment(r, c)) black = !(r >= N-8 && r <= N-6 && c >= N-8 && c <= N-6) || (r === N-7 && c === N-7);
      else black = data(r, c);
      cells.push({ r, c, black });
    }
  }

  return (
    <svg width={TOTAL} height={TOTAL} viewBox={`0 0 ${TOTAL} ${TOTAL}`}>
      <rect width={TOTAL} height={TOTAL} fill="white" rx="4"/>
      {cells.filter(c => c.black).map(({ r, c }, i) => (
        <rect key={i} x={c * CELL + 0.5} y={r * CELL + 0.5}
          width={CELL - 1} height={CELL - 1} fill="#1a1a2e" rx="1.2"/>
      ))}
      {/* Centre logo */}
      <rect x={TOTAL/2-18} y={TOTAL/2-18} width={36} height={36} fill="white" rx={6}/>
      <rect x={TOTAL/2-14} y={TOTAL/2-14} width={28} height={28} fill="#003d7a" rx={5}/>
      <text x={TOTAL/2} y={TOTAL/2+7} textAnchor="middle" fontSize={17}
        fontWeight="900" fill="white" fontFamily="Arial">₹</text>
    </svg>
  );
}

/* ══════════════════════════════════════════
   5-minute countdown timer
══════════════════════════════════════════ */
function QRTimer({ onExpire }) {
  const [secs, setSecs] = useState(300);
  useEffect(() => {
    const t = setInterval(() => {
      setSecs(s => { if (s <= 1) { clearInterval(t); onExpire(); return 0; } return s - 1; });
    }, 2000);
    return () => clearInterval(t);
  }, []);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  const pct = (secs / 300) * 100;
  const col = secs > 120 ? '#16a34a' : secs > 60 ? '#d97706' : '#dc2626';
  return (
    <div style={{ textAlign: 'center', marginTop: 8 }}>
      <div style={{ fontSize: 10, color: '#888', marginBottom: 3, letterSpacing: .5 }}>QR EXPIRES IN</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: col, fontFamily: 'monospace', letterSpacing: 3 }}>
        {m}:{s}
      </div>
      <div style={{ height: 5, background: '#f0f4f8', borderRadius: 3, marginTop: 6, overflow: 'hidden', width: 120, margin: '6px auto 0' }}>
        <div style={{ height: '100%', background: col, width: `${pct}%`, transition: 'width 1s linear, background .5s' }}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Payment Component
══════════════════════════════════════════ */
export default function Step7Payment({ formData, updateFormData, goTo }) {
  const [errors,  setErrors]  = useState({});
  const [paying,  setPaying]  = useState(false);
  const [paid,    setPaid]    = useState(formData.paymentStatus === 'success');
  const [expired, setExpired] = useState(false);
  const [txnId,   setTxnId]   = useState(formData.transactionId || '');

  const clr = f => setErrors(p => ({ ...p, [f]: '' }));

  /* simulate payment success */
  const doPayment = (method) => {
    setPaying(true);
    setTimeout(() => {
      const tid = 'MSBVT' + Date.now().toString().slice(-8);
      setPaying(false);
      setPaid(true);
      setTxnId(tid);
      updateFormData({ paymentStatus: 'success', transactionId: tid, paymentMethod: method });
    }, 2200);
  };

  const handleUPIPay = () => {
    if (!formData.upiId?.trim()) { setErrors({ upiId: 'Please enter your UPI ID' }); return; }
    if (!/^[\w.\-_]{2,}@[a-zA-Z]{2,}$/.test(formData.upiId)) { setErrors({ upiId: 'Enter valid UPI ID e.g. name@okicici' }); return; }
    doPayment('upi');
  };

  const handleCardPay = () => {
    const errs = validateStep7Payment({ ...formData, paymentMethod: 'card' });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    doPayment('card');
  };

  const handleNetPay = () => {
    if (!formData.netbankingBank) { setErrors({ netbankingBank: 'Please select your bank' }); return; }
    doPayment('netbanking');
  };

  const handleNext = () => {
    if (!paid) { setErrors({ _: 'Please complete payment before proceeding.' }); return; }
    goTo(8);
  };

  const setMethod = v => { updateFormData({ paymentMethod: v }); setErrors({}); setExpired(false); };

  /* Payment method tile */
  const Tile = ({ value, label, icon, sub }) => {
    const sel = formData.paymentMethod === value;
    return (
      <div onClick={() => setMethod(value)} style={{
        flex: 1, minWidth: 110, border: `2px solid ${sel ? '#003d7a' : '#dde6f0'}`,
        borderRadius: 14, padding: '16px 10px', cursor: 'pointer', textAlign: 'center',
        background: sel ? '#ebf2ff' : '#fff', transition: 'all .18s',
        boxShadow: sel ? '0 6px 18px rgba(0,61,122,.18)' : '0 1px 4px rgba(0,0,0,.05)',
      }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
        <div style={{ fontSize: 13, fontWeight: sel ? 800 : 500, color: sel ? '#003d7a' : '#555' }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: '#888', marginTop: 3 }}>{sub}</div>}
        {sel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#003d7a', margin: '8px auto 0' }}/>}
      </div>
    );
  };

  const payBtn = (label, onClick, disabled = false) => (
    <button onClick={onClick} disabled={disabled || paying}
      style={{
        width: '100%', padding: '14px', fontSize: 15, fontWeight: 800,
        border: 'none', borderRadius: 12, cursor: disabled || paying ? 'not-allowed' : 'pointer',
        background: disabled || paying ? '#c4cdd6' : 'linear-gradient(135deg,#16a34a,#15803d)',
        color: '#fff', boxShadow: disabled || paying ? 'none' : '0 4px 16px rgba(22,163,74,.4)',
        transition: 'all .2s', letterSpacing: .3,
      }}>
      {paying ? '⏳  Processing…' : label}
    </button>
  );

  return (
    <>
      {/* ── Fee Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg,#003d7a 0%,#0057b0 55%,#0078d7 100%)',
        borderRadius: 16, padding: '22px 28px', marginBottom: 20, color: '#fff',
        boxShadow: '0 8px 28px rgba(0,61,122,.28)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, opacity: .75, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
              Maharashtra State Board — Application Fee
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 1 }}>
              ₹{FEE} <span style={{ fontSize: 14, fontWeight: 400, opacity: .75 }}>/ Application</span>
            </div>
            <div style={{ fontSize: 11, opacity: .65, marginTop: 4 }}>Non-refundable processing fee · Secure payment</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: .7, marginBottom: 3 }}>Applicant</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {formData.fullName || (formData.firstName + ' ' + formData.lastName).trim() || '—'}
            </div>
            <div style={{ fontSize: 11, opacity: .65, marginTop: 3 }}>Category: {formData.category || '—'}</div>
          </div>
        </div>
      </div>

      {/* ── SUCCESS ── */}
      {paid ? (
        <Card>
          <CardHeader icon={ICON_PAY}>Payment Confirmed</CardHeader>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg,#16a34a,#15803d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(22,163,74,.38)',
              }}>
                <span style={{ fontSize: 40, color: '#fff' }}>✓</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#14532d', marginBottom: 6 }}>Payment Successful!</div>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>
                ₹{FEE} paid via{' '}
                <strong>{{ upi: 'UPI / QR Code', card: 'Debit/Credit Card', netbanking: 'Net Banking' }[formData.paymentMethod] || '—'}</strong>
              </div>
              <div style={{
                display: 'inline-block', background: '#f0fdf4', border: '1.5px solid #86efac',
                borderRadius: 12, padding: '16px 32px',
              }}>
                <div style={{ fontSize: 11, color: '#555', marginBottom: 4, letterSpacing: .5 }}>TRANSACTION ID</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#16a34a', letterSpacing: 2, fontFamily: 'monospace' }}>{txnId}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                  {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {' · '}Amount: ₹{FEE}
                </div>
              </div>
              <div style={{ marginTop: 20, background: '#eff6ff', borderRadius: 10, padding: '12px 16px', fontSize: 12, color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                ✅ Payment verified. Click <strong>Next: Declaration →</strong> to continue.
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (

        /* ── PAYMENT FORM ── */
        <Card>
          <CardHeader icon={ICON_PAY}>Select Payment Method</CardHeader>
          <CardBody>
            <ErrorBanner errors={errors}/>

            {/* Method tiles */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <Tile value="upi"        icon="📱" label="UPI / QR"        sub="GPay · PhonePe · Paytm"/>
              <Tile value="card"       icon="💳" label="Card"             sub="Debit · Credit · RuPay"/>
              <Tile value="netbanking" icon="🏦" label="Net Banking"      sub="All Indian Banks"/>
            </div>

            {/* ══ UPI / QR PANEL ══ */}
            {formData.paymentMethod === 'upi' && (
              <div style={{ border: '1.5px solid #bfdbfe', borderRadius: 16, overflow: 'hidden' }}>
                {/* Panel header */}
                <div style={{ background: 'linear-gradient(90deg,#1e3a8a,#1d4ed8)', padding: '14px 20px', color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>📱</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>UPI / QR Code Payment</div>
                    <div style={{ fontSize: 11, opacity: .8 }}>Scan QR or enter your UPI ID to pay ₹{FEE}</div>
                  </div>
                </div>

                <div style={{ padding: '24px 24px', background: '#f8faff' }}>
                  <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                    {/* ── QR Code Block ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        background: '#fff', border: '3px solid #003d7a', borderRadius: 16,
                        padding: 14, boxShadow: '0 6px 24px rgba(0,61,122,.15)',
                        position: 'relative',
                      }}>
                        {expired ? (
                          <div style={{ width: 200, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <div style={{ fontSize: 36 }}>🔄</div>
                            <div style={{ fontSize: 12, color: '#888' }}>QR Code Expired</div>
                            <button onClick={() => setExpired(false)} style={{ background: '#003d7a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>
                              Refresh QR
                            </button>
                          </div>
                        ) : (
                          <QRCodeSVG seed={(formData.upiId || 'msbvett@upi') + FEE}/>
                        )}
                      </div>

                      {!expired && <QRTimer onExpire={() => setExpired(true)}/>}

                      {/* UPI logos */}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                        {['🟢 GPay', '🟣 PhonePe', '🔵 Paytm', '🟠 BHIM'].map(app => (
                          <span key={app} style={{ fontSize: 10, background: '#fff', border: '1px solid #dde6f0', borderRadius: 20, padding: '3px 8px', color: '#555', fontWeight: 600 }}>
                            {app}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: 10, color: '#888', textAlign: 'center' }}>
                        UPI ID: <strong style={{ color: '#003d7a' }}>msbvett@upi</strong>
                      </div>
                    </div>

                    {/* ── OR: Enter UPI ID ── */}
                    <div style={{ flex: 1, minWidth: 230 }}>
                      {/* Divider */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <div style={{ flex: 1, height: 1, background: '#dde6f0' }}/>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', whiteSpace: 'nowrap', letterSpacing: .5 }}>OR ENTER UPI ID</span>
                        <div style={{ flex: 1, height: 1, background: '#dde6f0' }}/>
                      </div>

                      <FormGroup label="Your UPI ID" required error={errors.upiId} hint="e.g. name@okicici · mobile@paytm · 9876543210@ybl">
                        <div style={{ position: 'relative' }}>
                          <Input value={formData.upiId || ''}
                            onChange={e => { updateFormData({ upiId: e.target.value }); clr('upiId'); }}
                            placeholder="yourname@upi" error={errors.upiId}/>
                          {formData.upiId && /^[\w.\-_]{2,}@[a-zA-Z]{2,}$/.test(formData.upiId) && (
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#16a34a', fontSize: 16, fontWeight: 800 }}>✓</span>
                          )}
                        </div>
                      </FormGroup>

                      {/* Quick-fill UPI apps */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 8, letterSpacing: .5 }}>QUICK FILL</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {[
                            { name: 'GPay',     suffix: '@okicici', bg: '#e7f3e8', color: '#16a34a' },
                            { name: 'PhonePe',  suffix: '@ybl',     bg: '#f3e8ff', color: '#7c3aed' },
                            { name: 'Paytm',    suffix: '@paytm',   bg: '#e8f4ff', color: '#0ea5e9' },
                            { name: 'BHIM',     suffix: '@upi',     bg: '#fff3e8', color: '#ea580c' },
                          ].map(app => (
                            <button key={app.name}
                              onClick={() => { updateFormData({ upiId: (formData.primaryMobile || '9999999999') + app.suffix }); clr('upiId'); }}
                              style={{ background: app.bg, border: `1.5px solid ${app.color}30`, borderRadius: 8, padding: '6px 12px', fontSize: 11, cursor: 'pointer', fontWeight: 700, color: app.color }}>
                              {app.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Summary */}
                      <div style={{ background: '#fff', border: '1px solid #dde6f0', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: '#003d7a', marginBottom: 10 }}>Payment Summary</div>
                        {[['Application Fee', `₹${FEE}.00`], ['GST / Charges', 'NIL'], ['Total Payable', `₹${FEE}.00`]].map(([l, v], i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: i === 2 ? '#003d7a' : '#555', fontWeight: i === 2 ? 800 : 400, borderTop: i === 2 ? '1px dashed #dde6f0' : 'none', paddingTop: i === 2 ? 8 : 0, marginBottom: i < 2 ? 4 : 0 }}>
                            <span>{l}</span><span style={{ color: i === 1 ? '#16a34a' : 'inherit' }}>{v}</span>
                          </div>
                        ))}
                      </div>

                      {payBtn('✅  I Have Paid — Confirm Payment', handleUPIPay)}
                      <div style={{ fontSize: 10, color: '#aaa', textAlign: 'center', marginTop: 8 }}>
                        🔒 Powered by NPCI · 256-bit SSL secured
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ CARD PANEL ══ */}
            {formData.paymentMethod === 'card' && (
              <div style={{ border: '1.5px solid #e0e7f0', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg,#1e3a8a,#1d4ed8)', padding: '14px 20px', color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>💳</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Debit / Credit Card</div>
                    <div style={{ fontSize: 11, opacity: .8 }}>Visa · Mastercard · RuPay · Amex</div>
                  </div>
                </div>
                <div style={{ padding: 24, background: '#f8faff' }}>
                  {/* Card visual */}
                  <div style={{
                    background: 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#0ea5e9 100%)',
                    borderRadius: 16, padding: '20px 24px', color: '#fff', marginBottom: 22,
                    maxWidth: 340, boxShadow: '0 10px 30px rgba(30,58,138,.4)', position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }}/>
                    <div style={{ position: 'absolute', bottom: -20, left: 30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }}/>
                    <div style={{ fontSize: 10, opacity: .7, letterSpacing: 2, marginBottom: 18 }}>DEBIT / CREDIT CARD</div>
                    <div style={{ fontSize: 18, letterSpacing: 4, marginBottom: 18, minHeight: 24, fontFamily: 'monospace' }}>
                      {formData.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                      <div>
                        <div style={{ opacity: .6, fontSize: 8, letterSpacing: 1, marginBottom: 2 }}>CARD HOLDER</div>
                        <div style={{ fontWeight: 700, letterSpacing: .5 }}>{(formData.cardName || 'YOUR NAME').toUpperCase()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ opacity: .6, fontSize: 8, letterSpacing: 1, marginBottom: 2 }}>EXPIRES</div>
                        <div style={{ fontWeight: 700 }}>{formData.cardExpiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="form-row cols-1">
                    <FormGroup label="Cardholder Name" required error={errors.cardName}>
                      <Input value={formData.cardName || ''} onChange={e => { updateFormData({ cardName: e.target.value }); clr('cardName'); }} placeholder="Name as on card" error={errors.cardName}/>
                    </FormGroup>
                  </div>
                  <div className="form-row cols-1">
                    <FormGroup label="Card Number" required error={errors.cardNumber} hint="16-digit number on front of card">
                      <Input value={formData.cardNumber || ''}
                        onChange={e => { const r = e.target.value.replace(/\D/g, '').slice(0, 16); updateFormData({ cardNumber: r.match(/.{1,4}/g)?.join(' ') || r }); clr('cardNumber'); }}
                        placeholder="XXXX  XXXX  XXXX  XXXX" maxLength={19} error={errors.cardNumber}/>
                    </FormGroup>
                  </div>
                  <div className="form-row cols-3">
                    <FormGroup label="Expiry Date" required error={errors.cardExpiry} hint="MM/YY">
                      <Input value={formData.cardExpiry || ''}
                        onChange={e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); updateFormData({ cardExpiry: v }); clr('cardExpiry'); }}
                        placeholder="MM/YY" maxLength={5} error={errors.cardExpiry}/>
                    </FormGroup>
                    <FormGroup label="CVV" required error={errors.cardCVV} hint="3–4 digits on back">
                      <Input value={formData.cardCVV || ''} type="password"
                        onChange={e => { updateFormData({ cardCVV: e.target.value.replace(/\D/g, '').slice(0, 4) }); clr('cardCVV'); }}
                        placeholder="•••" maxLength={4} error={errors.cardCVV}/>
                    </FormGroup>
                    <FormGroup label="Amount">
                      <Input value={`₹${FEE}.00`} readOnly/>
                    </FormGroup>
                  </div>
                  <Alert>🔒 Your card details are protected by 256-bit SSL encryption and are never stored.</Alert>
                  {payBtn(`🔒  Pay ₹${FEE} Securely`, handleCardPay)}
                </div>
              </div>
            )}

            {/* ══ NET BANKING PANEL ══ */}
            {formData.paymentMethod === 'netbanking' && (
              <div style={{ border: '1.5px solid #fde68a', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg,#1e3a8a,#1d4ed8)', padding: '14px 20px', color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>🏦</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Net Banking</div>
                    <div style={{ fontSize: 11, opacity: .8 }}>All major Indian banks supported</div>
                  </div>
                </div>
                <div style={{ padding: 24, background: '#fffdf0' }}>
                  {/* Popular bank grid */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 10, letterSpacing: .5 }}>POPULAR BANKS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 18 }}>
                    {[
                      { key: 'SBI',   name: 'State Bank of India',  color: '#1d4ed8' },
                      { key: 'HDFC',  name: 'HDFC Bank',            color: '#dc2626' },
                      { key: 'ICICI', name: 'ICICI Bank',           color: '#ea580c' },
                      { key: 'Axis',  name: 'Axis Bank',            color: '#7c3aed' },
                      { key: 'PNB',   name: 'Punjab National Bank', color: '#0369a1' },
                      { key: 'Kotak', name: 'Kotak Mahindra Bank',  color: '#d97706' },
                      { key: 'BOB',   name: 'Bank of Baroda',       color: '#15803d' },
                      { key: 'BOM',   name: 'Bank of Maharashtra',  color: '#0f766e' },
                    ].map(b => {
                      const sel = formData.netbankingBank === b.name;
                      return (
                        <div key={b.key} onClick={() => { updateFormData({ netbankingBank: b.name }); clr('netbankingBank'); }}
                          style={{
                            border: `2px solid ${sel ? b.color : '#e0e7f0'}`, borderRadius: 10,
                            padding: '10px 6px', cursor: 'pointer', textAlign: 'center',
                            background: sel ? b.color + '15' : '#fff', transition: 'all .15s',
                          }}>
                          <div style={{ fontSize: 20, marginBottom: 4 }}>🏦</div>
                          <div style={{ fontSize: 9, fontWeight: sel ? 800 : 500, color: sel ? b.color : '#555', lineHeight: 1.3 }}>{b.key}</div>
                        </div>
                      );
                    })}
                  </div>

                  <FormGroup label="Or select any bank" error={errors.netbankingBank}>
                    <Select value={formData.netbankingBank || ''} onChange={e => { updateFormData({ netbankingBank: e.target.value }); clr('netbankingBank'); }} options={BANKS} error={errors.netbankingBank}/>
                  </FormGroup>

                  {formData.netbankingBank && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '12px 14px', margin: '12px 0', fontSize: 12, color: '#166534', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span>🏦</span>
                      <span>You will be redirected to <strong>{formData.netbankingBank}</strong> portal to pay <strong>₹{FEE}</strong></span>
                    </div>
                  )}

                  {payBtn(`🏦  Proceed to ${formData.netbankingBank ? formData.netbankingBank.split(' ').slice(0,2).join(' ') : 'Bank'}`, handleNetPay, !formData.netbankingBank)}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* ── Bottom Nav ── */}
      <div className="btn-row">
        <button className="btn btn-secondary" onClick={() => goTo(6)}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext}
          style={{ opacity: paid ? 1 : .55, cursor: paid ? 'pointer' : 'not-allowed' }}>
          Next: Declaration →
        </button>
      </div>
    </>
  );
}
