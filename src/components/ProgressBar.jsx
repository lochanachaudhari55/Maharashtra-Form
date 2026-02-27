import React from 'react';

export default function ProgressBar({ currentStep, stepLabels, goTo, submitted }) {
  return (
    <div style={{
      background: '#fff', borderBottom: '2px solid #e0e7ef',
      padding: '28px 40px 20px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        position: 'relative', maxWidth: 960, margin: '0 auto',
      }}>
        {/* Connecting line */}
        <div style={{
          position: 'absolute', top: 20, left: 20, right: 20,
          height: 3, background: '#003d7a', zIndex: 0,
        }} />

        {stepLabels.map((label, idx) => {
          const step = idx + 1;
          const isActive = !submitted && step === currentStep;
          const isDone = submitted || step < currentStep;
          return (
            <div
              key={step}
              onClick={() => goTo(step)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                position: 'relative', flex: 1, cursor: 'pointer',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: '#003d7a',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, zIndex: 1, position: 'relative',
                boxShadow: isActive
                  ? '0 0 0 5px rgba(0,61,122,0.18)'
                  : '0 2px 8px rgba(0,61,122,0.2)',
                transition: 'all 0.25s',
              }}>
                {isDone ? '✓' : step}
              </div>
              <div style={{
                fontSize: 11, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#003d7a' : '#003d7a',
                marginTop: 10, textAlign: 'center', whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
              }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
