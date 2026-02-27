import React from 'react';

export default function SuccessScreen() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{
        width: 72, height: 72, background: '#e8f5e9', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', fontSize: 36, color: '#2e7d32',
      }}>✓</div>
      <h2 style={{ color: '#2e7d32', fontSize: 22, marginBottom: 8 }}>
        Application Submitted Successfully!
      </h2>
      <p style={{ color: '#555', fontSize: 14, marginBottom: 4 }}>
        Your Form No: <strong>2025S01516</strong>
      </p>
      <p style={{ color: '#555', fontSize: 13 }}>
        Please save your Form Number for future reference. You will receive a confirmation
        on your registered email and mobile number.
      </p>
      <button
        className="btn btn-primary"
        style={{ marginTop: 24 }}
        onClick={() => window.print()}
      >
        🖨 Print Application
      </button>
    </div>
  );
}
