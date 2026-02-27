import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Input, Divider, ErrorBanner } from '../UI';
import { validateStep8Declaration } from '../../utils/validate';

const ICON = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z';
const YL   = v => v === 'yes' ? 'Yes' : v === 'no' ? 'No' : (v || '—');

const uplBtn = {
  width: '100%', background: '#0066cc', color: '#fff', border: 'none',
  borderRadius: 6, padding: '8px 0', fontSize: 11, fontWeight: 700,
  cursor: 'pointer', marginTop: 8,
};
const signBox = has => ({
  width: 200, height: 80, border: `2px dashed ${has ? '#003d7a' : '#cdd6e0'}`,
  borderRadius: 8, overflow: 'hidden', cursor: 'pointer', background: '#f9fafc',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

export default function Step8Declaration({ formData, updateFormData, goTo, onSubmit }) {
  const [candURL,  setCandURL]  = useState(null);
  const [guardURL, setGuardURL] = useState(null);
  const [errors,   setErrors]   = useState({});
  const candRef  = useRef(null);
  const guardRef = useRef(null);

  const clr = f => setErrors(p => ({ ...p, [f]: '' }));
  const upd = f => e => { updateFormData({ [f]: e.target.value }); clr(f); };

  const handleCand  = e => { const file = e.target.files[0]; if (!file) return; const url = URL.createObjectURL(file); setCandURL(url);  updateFormData({ candidateSignature: file, candidateSignatureURL: url }); };
  const handleGuard = e => { const file = e.target.files[0]; if (!file) return; const url = URL.createObjectURL(file); setGuardURL(url); updateFormData({ guardianSignature: file, guardianSignatureURL: url }); };

  const handleSubmit = () => {
    const errs = validateStep8Declaration(formData);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    onSubmit();
  };

  /* ── Preview Application in new window ── */
  const handlePreview = () => {
    const f  = formData;
    const ph = f.photo     ? URL.createObjectURL(f.photo)    : '';
    const cs = candURL     || f.candidateSignatureURL         || '';
    const gs = guardURL    || f.guardianSignatureURL          || '';

    const b64 = url => new Promise(res => {
      if (!url) return res('');
      fetch(url).then(r => r.blob()).then(b => {
        const rd = new FileReader(); rd.onload = () => res(rd.result); rd.readAsDataURL(b);
      }).catch(() => res(''));
    });

    Promise.all([b64(ph), b64(cs), b64(gs)]).then(([phB, csB, gsB]) => {
      const img  = (src, w, h) => src ? `<img src="${src}" style="width:${w}px;height:${h}px;object-fit:contain"/>` : '';
      const row  = (l, v) => `<tr><td class="lbl">${l}</td><td class="val">${v || '—'}</td></tr>`;
      const sec  = t => `<tr><td colspan="2" class="sec">${t}</td></tr>`;
      const qRow = q => `<tr><td>${q.type}</td><td>${q.obtained}</td><td>${q.max}</td><td>${q.percentage ? q.percentage + '%' : '—'}</td><td>${q.board || '—'}</td></tr>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Application – ${f.fullName || f.firstName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;font-size:12px;background:#f4f6f9;padding:20px;color:#222}
.page{max-width:920px;margin:0 auto;background:#fff;padding:24px;border-radius:10px;box-shadow:0 2px 16px rgba(0,0,0,.1)}
.top-bar{display:flex;justify-content:flex-end;gap:10px;margin-bottom:16px}
.btn{border:none;border-radius:7px;padding:9px 22px;font-size:13px;font-weight:700;cursor:pointer}
.btn-print{background:#003d7a;color:#fff}
.btn-close{background:#e5e7eb;color:#333}
.hdr{display:flex;align-items:center;border-bottom:3px solid #003d7a;padding-bottom:12px;margin-bottom:14px;gap:12px}
.hdr-mid{flex:1;text-align:center}
.hdr-mid h1{font-size:13px;font-weight:800;color:#003d7a;line-height:1.4}
.hdr-mid p{font-size:10px;color:#666;margin:2px 0}
.layout{display:flex;gap:14px}
.main{flex:1}
.sidebar{width:120px;text-align:center;flex-shrink:0}
.photo-box{width:110px;height:128px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;overflow:hidden;margin:0 auto}
table.t{width:100%;border-collapse:collapse;margin-bottom:10px}
td{padding:5px 8px;vertical-align:top;font-size:11px;border:1px solid #e0e6ef}
.sec{background:#003d7a;color:#fff;font-weight:700;padding:7px 10px;border:none;font-size:11.5px}
.lbl{background:#f0f4fa;font-weight:600;color:#374151;width:42%}
.val{color:#222}
table.ql{width:100%;border-collapse:collapse;margin-bottom:10px}
.ql th{background:#003d7a;color:#fff;padding:6px 8px;font-size:10.5px;border:1px solid #003d7a;text-align:left}
.ql td{padding:5px 8px;border:1px solid #e0e6ef;font-size:10.5px}
.signs{display:flex;justify-content:space-between;margin-top:24px;border-top:1px solid #ddd;padding-top:16px;gap:20px}
.sign-col{flex:1;text-align:center}
.sign-col p{font-size:11px;font-weight:700;margin-bottom:8px;color:#333}
.sign-box{height:72px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;overflow:hidden;margin:0 auto}
.sign-meta{font-size:10px;color:#888;margin-top:4px}
.pay-badge{display:inline-block;background:#d1fae5;border:1px solid #6ee7b7;color:#065f46;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700}
@media print{.top-bar{display:none}body{padding:0;background:#fff}.page{box-shadow:none;padding:8px}@page{margin:10mm;size:A4}}
</style>
</head><body><div class="page">
<div class="top-bar">
  <button class="btn btn-close" onclick="window.close()">✕ Close</button>
  <button class="btn btn-print" onclick="window.print()">🖨 Print</button>
</div>
<div class="hdr">
  <div>${img('/logo2.png', 56, 60)}</div>
  <div class="hdr-mid">
    <p>Government of Maharashtra · Skill, Employment, Entrepreneurship &amp; Innovation Department</p>
    <h1>Maharashtra State Board of Skill, Vocational Education and Training</h1>
    <p style="margin-top:4px;font-weight:700;font-size:11px;color:#003d7a">APPLICATION FORM</p>
  </div>
  <div>${img('/logo3.png', 60, 64)}</div>
</div>

<div class="layout">
<div class="main">
<table class="t">
${sec('1. Primary Details')}
${row('Full Name', (f.fullName || [f.firstName, f.middleName, f.lastName].filter(Boolean).join(' ')).toUpperCase())}
${row('Date of Birth', f.dob)} ${row('Gender', f.gender)} ${row('Aadhar No.', f.aadharNumber)}
${row('Email', f.email)} ${row('Category', f.category)} ${row('Nationality', f.nationality)}
${row('Mobile', f.primaryMobile ? '+91 ' + f.primaryMobile : '')}
${row('Name Change', YL(f.nameChangeStatus))}
</table>
<table class="t">
${sec('2. Personal Information')}
${row('Father Name', f.fatherName)} ${row('Mother Name', f.motherName)}
${row('Height (cm)', f.height)} ${row('Weight (kg)', f.weight)}
${row('Chest Deflated', f.chestDeflated)} ${row('Chest Inflated', f.chestInflated)}
${row('Hearing Impaired', YL(f.hearingImpaired))} ${row('Knows Marathi', YL(f.knowsMarathi))}
${row('Pref. Location 1', f.preferredLocation1)} ${row('Pref. Location 2', f.preferredLocation2)}
</table>
<table class="t">
${sec('3. Address & Identity')}
${row('Address', f.address)} ${row('Village / City', f.village)} ${row('Taluka', f.taluka)}
${row('District', f.district)} ${row('State', f.state)} ${row('Country', f.country)} ${row('Pin Code', f.pinCode)}
${row('Domicile MH', YL(f.domicileMaharashtra))} ${row('PWD', YL(f.pwdStatus))}
${row('Project Affected', YL(f.projectAffected))} ${row('Earthquake', YL(f.earthquakeAffected))} ${row('Ex-Servicemen', YL(f.exServiceman))}
</table>
</div>
<div class="sidebar">
  <div class="photo-box">${phB ? `<img src="${phB}" style="width:110px;height:128px;object-fit:cover"/>` : 'Photo'}</div>
  <p style="font-size:9px;color:#888;margin-top:4px">Passport Photo</p>
</div>
</div>

<div style="font-weight:800;font-size:11.5px;background:#003d7a;color:#fff;padding:7px 10px;margin-bottom:0">4. Educational Qualifications</div>
<table class="ql"><thead><tr><th>Qualification</th><th>Obtained</th><th>Max</th><th>%</th><th>Board / University</th></tr></thead>
<tbody>${(f.qualifications || []).map(qRow).join('')}</tbody></table>

<table class="t">
${sec('5. Medical & Sports')}
${row('Vision 6/6', YL(f.vision66))} ${row('Colour Vision', YL(f.colorVision))} ${row('Normal Hearing', YL(f.normalHearing))} ${row('Squint Eyes', YL(f.squintEyes))}
${row('Chest Expansion', YL(f.chestExpansion5cm))} ${row('Flat Foot', YL(f.flatFoot))} ${row('Knee Knock', YL(f.kneeKnock))} ${row('Varicose Vein', YL(f.varicoseVein))}
${row('Bone Disease', YL(f.boneDisease))} ${row('No Deformity', YL(f.noMedicalDeformity))} ${row('Mental History', YL(f.mentalHistory))} ${row('Major Surgery', YL(f.majorSurgery))}
${row('Speech Deficiency', YL(f.speechDeficiency))} ${row('Skin Disease', YL(f.skinDisease))}
${row('DL LMV', YL(f.drivingLicenseLMV))} ${row('DL HMV', YL(f.drivingLicenseHMV))} ${row('NCC-A', YL(f.nccA))} ${row('NCC-B', YL(f.nccB))} ${row('NCC-C', YL(f.nccC))}
${row('Civil Defence', YL(f.civilDefense))} ${row('Home Guard', YL(f.homeGuard))} ${row('Meritorious Sports', YL(f.meritoriousSports))}
</table>

<table class="t">
${sec('6. Payment Details')}
${row('Payment Method', ({ upi: 'UPI / QR Code', card: 'Debit/Credit Card', netbanking: 'Net Banking' }[f.paymentMethod] || f.paymentMethod || '—'))}
${row('Transaction ID', f.transactionId || '—')}
${row('Payment Status', `<span class="pay-badge">${f.paymentStatus === 'success' ? '✓ Paid' : 'Pending'}</span>`)}
</table>

<table class="t">
${sec('7. Declaration')}
${row('Candidate Date', f.declarationDate)} ${row('Candidate Place', f.declarationPlace)}
${row('Guardian Name', f.guardianName)} ${row('Guardian Date', f.guardianDate)} ${row('Guardian Place', f.guardianPlace)}
</table>

<div class="signs">
  <div class="sign-col">
    <p>Signature of Candidate (उमेदवार स्वारी)</p>
    <div class="sign-box" style="width:220px">${csB ? img(csB, 218, 70) : 'Signature'}</div>
    <p class="sign-meta">Date: ${f.declarationDate || '___'} &nbsp;·&nbsp; Place: ${f.declarationPlace || '___'}</p>
  </div>
  <div class="sign-col">
    <p>Signature of Father / Mother / Guardian</p>
    <div class="sign-box" style="width:220px">${gsB ? img(gsB, 218, 70) : 'Signature'}</div>
    <p class="sign-meta">Date: ${f.guardianDate || '___'} &nbsp;·&nbsp; Place: ${f.guardianPlace || '___'}</p>
  </div>
</div>
</div></body></html>`;

      const win = window.open('', '_blank', 'width=980,height=860,scrollbars=yes');
      win.document.open(); win.document.write(html); win.document.close();
      const t = setInterval(() => { try { if (win.closed) { clearInterval(t); } } catch (e) { clearInterval(t); } }, 600);
    });
  };

  return (
    <>
      <ErrorBanner errors={errors}/>

      {/* ══ CANDIDATE DECLARATION ══ */}
      <Card>
        <CardHeader icon={ICON}>Declaration by Applicant (अर्जदाराचे घोषणा पत्र)</CardHeader>
        <CardBody>

          {/* Declaration text box */}
          <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f0f9ff)', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
            <h4 style={{ color: '#1e3a8a', fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Declaration by Applicant</h4>
            <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
              I hereby declare that all the particulars stated in the application are true to the best of my knowledge and belief.
              I have read and understood all the provisions of the prospectus and agree to abide by them.
              In the event of suppression or distortion of any fact, my admission is liable for cancellation.
              The fire and rescue training imparted at state fire academy is strenuous and involves risk of injuries,
              damage and life risk and I will have no claim of any compensation.
            </p>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 10, lineHeight: 1.7 }}>
              मी जाहीर करतो / करते की मी अर्जी मध्ये नमूद केलेली माहिती खरी आहे. जाहिराती मध्ये दिलेल्या
              सर्व सूचना मी वाचल्या आहेत व त्याच्याशी मी बांधील आहे. कोणतीही माहिती खोटी आढळल्यास
              प्रवेश रद्द होऊ शकतो.
            </p>
          </div>

          <div className="form-row cols-2">
            <FormGroup label="Date (दिनांक)" required error={errors.declarationDate}>
              <Input type="date" value={formData.declarationDate} onChange={upd('declarationDate')} error={errors.declarationDate}/>
            </FormGroup>
            <FormGroup label="Place (ठिकाण)" required error={errors.declarationPlace}>
              <Input value={formData.declarationPlace} onChange={upd('declarationPlace')} placeholder="Enter your city / place" error={errors.declarationPlace}/>
            </FormGroup>
          </div>

          {/* Candidate Signature */}
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 8 }}>
                Signature of Candidate (उमेदवार स्वारी)
              </p>
              <input ref={candRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCand}/>
              <div style={signBox(!!candURL)} onClick={() => candRef.current.click()}>
                {candURL
                  ? <img src={candURL} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}/>
                  : <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, color: '#ccc' }}>✒️</div>
                      <div style={{ fontSize: 10, color: '#bbb', marginTop: 4 }}>Click to upload signature</div>
                    </div>}
              </div>
              <button type="button" style={uplBtn} onClick={() => candRef.current.click()}>
                {candURL ? '↺ Change Signature' : 'Upload Signature'}
              </button>
              {candURL && <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, marginTop: 4 }}>✓ Uploaded</div>}
            </div>
          </div>

          <Divider/>

          {/* ══ GUARDIAN DECLARATION ══ */}
          <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', border: '1.5px solid #86efac', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
            <h4 style={{ color: '#14532d', fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Assurance by Parent / Guardian (पालकांचे हमीपत्र)</h4>
            <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
              I father / mother / guardian hereby declare that I am fully aware of the terms and conditions of the course.
              The information provided by my son / ward is true and correct to the best of my knowledge.
              The fire and rescue training is strenuous and I / We will have no claim of any compensation
              in case of injury or any life risk during the course.
            </p>
          </div>

          <div className="form-row cols-1">
            <FormGroup label="Full Name of Parent / Guardian" required error={errors.guardianName}>
              <Input value={formData.guardianName} onChange={upd('guardianName')} placeholder="Full name of father / mother / guardian" error={errors.guardianName}/>
            </FormGroup>
          </div>
          <div className="form-row cols-2">
            <FormGroup label="Date (दिनांक)" required error={errors.guardianDate}>
              <Input type="date" value={formData.guardianDate} onChange={upd('guardianDate')} error={errors.guardianDate}/>
            </FormGroup>
            <FormGroup label="Place (ठिकाण)" required error={errors.guardianPlace}>
              <Input value={formData.guardianPlace} onChange={upd('guardianPlace')} placeholder="Enter city / place" error={errors.guardianPlace}/>
            </FormGroup>
          </div>

          {/* Guardian Signature */}
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 8 }}>
                Signature of Father / Mother / Guardian
              </p>
              <input ref={guardRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleGuard}/>
              <div style={signBox(!!guardURL)} onClick={() => guardRef.current.click()}>
                {guardURL
                  ? <img src={guardURL} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}/>
                  : <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, color: '#ccc' }}>✒️</div>
                      <div style={{ fontSize: 10, color: '#bbb', marginTop: 4 }}>Click to upload signature</div>
                    </div>}
              </div>
              <button type="button" style={uplBtn} onClick={() => guardRef.current.click()}>
                {guardURL ? '↺ Change Signature' : 'Upload Signature'}
              </button>
              {guardURL && <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, marginTop: 4 }}>✓ Uploaded</div>}
            </div>
          </div>

          <Divider/>

          {/* Agreement checkbox */}
          <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 10, padding: '14px 16px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.agreed}
                onChange={e => { updateFormData({ agreed: e.target.checked }); clr('agreed'); }}
                style={{ width: 18, height: 18, marginTop: 1, accentColor: '#003d7a', flexShrink: 0 }}/>
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, fontWeight: 500 }}>
                I have carefully read and understood all the declarations above.
                I confirm that all information provided in this application is true, correct and complete.
                I understand that any false information may result in cancellation of my application.
              </span>
            </label>
            {errors.agreed && (
              <div style={{ color: '#dc2626', fontSize: 11, marginTop: 6, marginLeft: 30, fontWeight: 500 }}>⚠ {errors.agreed}</div>
            )}
          </div>

        </CardBody>
      </Card>

      {/* ── Payment receipt summary ── */}
      {formData.paymentStatus === 'success' && (
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12, padding: '14px 18px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 28 }}>✅</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#14532d' }}>Payment Confirmed — ₹{2000}</div>
            <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>
              Transaction ID: <strong style={{ fontFamily: 'monospace', letterSpacing: 1 }}>{formData.transactionId}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Nav ── */}
      <div className="btn-row">
        <button className="btn btn-secondary" onClick={() => goTo(7)}>← Back</button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={handlePreview}
            style={{ background: '#003d7a', display: 'flex', alignItems: 'center', gap: 6 }}>
            👁 Preview Application
          </button>
          <button className="btn btn-success" onClick={handleSubmit}>
            ✓ Submit Application
          </button>
        </div>
      </div>
    </>
  );
}
