import React from 'react';

export function Card({ children }) { return <div className="card">{children}</div>; }

export function CardHeader({ icon, children }) {
  return (
    <div className="card-header">
      {icon && <svg viewBox="0 0 24 24"><path d={icon}/></svg>}
      {children}
    </div>
  );
}

export function CardBody({ children }) { return <div className="card-body">{children}</div>; }

export function FormGroup({ label, required, hint, error, children }) {
  return (
    <div className="form-group">
      {label && <label>{label}{required && <span className="req"> *</span>}</label>}
      {children}
      {error
        ? <span style={{display:'block',fontSize:11,color:'#e53935',marginTop:3,fontWeight:500}}>⚠ {error}</span>
        : hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type='text', readOnly, maxLength, error }) {
  return (
    <input
      type={type} value={value??''} placeholder={placeholder}
      onChange={onChange} readOnly={readOnly} maxLength={maxLength}
      style={{
        width:'100%', border:`1px solid ${error?'#e53935':'#cdd6e0'}`,
        borderRadius:5, padding:'9px 12px', fontSize:13, fontFamily:'inherit',
        outline:'none', background:readOnly?'#f5f7fa':'#fff',
        boxShadow:error?'0 0 0 3px rgba(229,57,53,.1)':'none',
      }}
    />
  );
}

export function Select({ value, onChange, options, error }) {
  return (
    <select value={value??''} onChange={onChange}
      style={{
        width:'100%', border:`1px solid ${error?'#e53935':'#cdd6e0'}`,
        borderRadius:5, padding:'9px 12px', fontSize:13, fontFamily:'inherit',
        outline:'none', background:'#fff',
        boxShadow:error?'0 0 0 3px rgba(229,57,53,.1)':'none',
      }}>
      <option value="">-- Select --</option>
      {options.filter(o => typeof o === 'string' ? o !== '' : true).map(opt =>
        typeof opt === 'string'
          ? <option key={opt} value={opt}>{opt}</option>
          : <option key={opt.value} value={opt.value}>{opt.label}</option>
      )}
    </select>
  );
}

export function Textarea({ value, onChange, rows=3, error }) {
  return (
    <textarea value={value??''} onChange={onChange} rows={rows}
      style={{border:`1px solid ${error?'#e53935':'#cdd6e0'}`, boxShadow:error?'0 0 0 3px rgba(229,57,53,.1)':'none'}}
    />
  );
}

/* ── RadioGroup – clean, no borders, simple radio circles ── */
export function RadioGroup({ fieldName, value, onChange, options, error }) {
  return (
    <div>
      <div style={{display:'flex', gap:'24px', flexWrap:'wrap', marginTop:6, alignItems:'center'}}>
        {options.map(opt => (
          <label key={opt.value} onClick={() => onChange(opt.value)}
            style={{
              display:'flex', alignItems:'center', gap:8,
              cursor:'pointer', fontSize:13, color:'#333',
              fontWeight: value===opt.value ? 600 : 400,
              userSelect:'none', padding:'4px 0',
            }}>
            {/* Outer ring */}
            <span style={{
                width:18, height:18, borderRadius:'50%', flexShrink:0,
                border:`2px solid ${value===opt.value ? '#003d7a' : '#9eaab8'}`,
                background:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .15s',
              }}>
              {/* Inner dot – only visible when selected */}
              {value===opt.value &&
                <span style={{width:9, height:9, borderRadius:'50%', background:'#003d7a', display:'block'}}/>}
            </span>
            <input type="radio" name={fieldName} value={opt.value}
              checked={value===opt.value} onChange={()=>onChange(opt.value)}
              style={{position:'absolute', opacity:0, pointerEvents:'none'}}/>
            {opt.label}
          </label>
        ))}
      </div>
      {error && <span style={{display:'block',fontSize:11,color:'#e53935',marginTop:4,fontWeight:500}}>⚠ {error}</span>}
    </div>
  );
}

export function CheckboxGroup({ options, selected, onChange }) {
  const toggle = val =>
    selected.includes(val) ? onChange(selected.filter(v=>v!==val)) : onChange([...selected, val]);
  return (
    <div className="checkbox-group">
      {options.map(opt => (
        <label key={opt}><input type="checkbox" checked={selected.includes(opt)} onChange={()=>toggle(opt)}/>{opt}</label>
      ))}
    </div>
  );
}

export function SubHeading({ children }) { return <div className="sub-heading">{children}</div>; }
export function Divider() { return <div className="divider"/>; }

export function Alert({ type='info', children }) {
  const s = {
    info:   {bg:'#e3f2fd',bd:'#1976d2',tx:'#1565c0'},
    success:{bg:'#e8f5e9',bd:'#2e7d32',tx:'#1b5e20'},
    error:  {bg:'#ffebee',bd:'#e53935',tx:'#c62828'},
    warning:{bg:'#fff8e1',bd:'#f9a825',tx:'#e65100'},
  }[type]||{bg:'#e3f2fd',bd:'#1976d2',tx:'#1565c0'};
  return (
    <div style={{background:s.bg,borderLeft:`4px solid ${s.bd}`,borderRadius:4,padding:'12px 16px',fontSize:12,color:s.tx,marginBottom:16}}>
      {children}
    </div>
  );
}

/* ErrorBanner – only shows when there are actual non-empty error messages */
export function ErrorBanner({ errors }) {
  const msgs = Object.values(errors).filter(v => typeof v === 'string' && v.trim().length > 0);
  if (!msgs.length) return null;
  return (
    <div style={{background:'#ffebee',border:'1px solid #e53935',borderRadius:8,padding:'12px 16px',marginBottom:16,fontSize:13,color:'#c62828',display:'flex',gap:10,alignItems:'flex-start'}}>
      <span style={{fontSize:18,flexShrink:0}}>⚠</span>
      <div>
        <strong>Please fix the following before proceeding:</strong>
        <ul style={{marginTop:6,marginLeft:16,lineHeight:1.9}}>
          {msgs.map((msg,i) => <li key={i}>{msg}</li>)}
        </ul>
      </div>
    </div>
  );
}

export function NavButtons({ onBack, onNext, nextLabel='Next →', nextClass='btn-primary', showBack=true }) {
  return (
    <div className="btn-row">
      {showBack ? <button className="btn btn-secondary" onClick={onBack}>← Back</button> : <span/>}
      <button className={`btn ${nextClass}`} onClick={onNext}>{nextLabel}</button>
    </div>
  );
}
